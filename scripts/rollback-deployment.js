#!/usr/bin/env node

/**
 * Deployment rollback script
 * Reverts to previous successful deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPOSITORY =
  process.env.GITHUB_REPOSITORY || 'agrxculture/agricultural-portfolio-website';

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📋',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }[type];

  console.log(`${prefix} [${timestamp}] ${message}`);
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      timeout: 30000,
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

async function getLastSuccessfulDeployment() {
  log('Finding last successful deployment...');

  if (!GITHUB_TOKEN) {
    log(
      'GitHub token not available, cannot fetch deployment history',
      'warning'
    );
    return null;
  }

  try {
    // Get recent workflow runs
    const result = runCommand(`curl -H "Authorization: token ${GITHUB_TOKEN}" \
      -H "Accept: application/vnd.github.v3+json" \
      "https://api.github.com/repos/${REPOSITORY}/actions/runs?status=success&per_page=10"`);

    if (!result.success) {
      log('Failed to fetch deployment history', 'error');
      return null;
    }

    const runs = JSON.parse(result.output);
    const deployRuns = runs.workflow_runs.filter(
      run =>
        run.name === 'Deploy to GitHub Pages' &&
        run.conclusion === 'success' &&
        run.head_sha !== process.env.GITHUB_SHA // Exclude current deployment
    );

    if (deployRuns.length === 0) {
      log('No previous successful deployments found', 'warning');
      return null;
    }

    const lastSuccessful = deployRuns[0];
    log(
      `Found last successful deployment: ${lastSuccessful.head_sha.substring(0, 7)} from ${lastSuccessful.created_at}`,
      'success'
    );

    return lastSuccessful;
  } catch (error) {
    log(`Error fetching deployment history: ${error.message}`, 'error');
    return null;
  }
}

async function rollbackToCommit(commitSha) {
  log(`Rolling back to commit ${commitSha.substring(0, 7)}...`);

  try {
    // Create rollback branch
    const rollbackBranch = `rollback-${Date.now()}`;

    runCommand(`git checkout -b ${rollbackBranch}`);
    runCommand(`git reset --hard ${commitSha}`);

    // Force push to gh-pages
    const result = runCommand(
      `git push origin ${rollbackBranch}:gh-pages --force`
    );

    if (result.success) {
      log('Rollback completed successfully', 'success');

      // Create rollback commit message
      const rollbackMessage = `Rollback to ${commitSha.substring(0, 7)} due to deployment failure
      
Automated rollback performed by deployment verification script.
Previous deployment failed verification checks.
      
Rollback commit: ${commitSha}
Rollback time: ${new Date().toISOString()}`;

      // Create rollback commit on main branch
      runCommand(`git checkout main`);
      runCommand(`git reset --hard ${commitSha}`);
      runCommand(`git commit --allow-empty -m "${rollbackMessage}"`);

      log('Created rollback commit on main branch', 'success');
      return true;
    } else {
      log(`Rollback failed: ${result.error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Rollback error: ${error.message}`, 'error');
    return false;
  }
}

async function createRollbackIssue(reason, commitSha) {
  if (!GITHUB_TOKEN) {
    log('Cannot create GitHub issue without token', 'warning');
    return;
  }

  const issueBody = `## Deployment Rollback Alert
  
**Rollback Reason**: ${reason}
**Rolled back to**: ${commitSha?.substring(0, 7) || 'Previous successful deployment'}
**Rollback Time**: ${new Date().toISOString()}

### What Happened
The automated deployment verification detected issues with the latest deployment and performed an automatic rollback to maintain site availability.

### Next Steps
1. Review the failed deployment logs
2. Fix the issues that caused the deployment failure
3. Test changes locally before redeploying
4. Consider running staging tests before production deployment

### Verification Checks That Failed
- Site availability check
- Performance thresholds
- Broken link detection
- SEO validation

This issue was created automatically by the deployment rollback script.`;

  try {
    const result = runCommand(`curl -X POST \
      -H "Authorization: token ${GITHUB_TOKEN}" \
      -H "Accept: application/vnd.github.v3+json" \
      "https://api.github.com/repos/${REPOSITORY}/issues" \
      -d '{"title":"🚨 Automatic Deployment Rollback","body":"${issueBody.replace(/"/g, '\\"').replace(/\n/g, '\\n')}","labels":["deployment","rollback","automated"]}'`);

    if (result.success) {
      log('Created GitHub issue for rollback notification', 'success');
    }
  } catch (error) {
    log(`Failed to create rollback issue: ${error.message}`, 'warning');
  }
}

async function performRollback(reason = 'Deployment verification failed') {
  log('🚨 Initiating deployment rollback...');
  log(`Reason: ${reason}`);

  try {
    // Get last successful deployment
    const lastSuccessful = await getLastSuccessfulDeployment();

    if (!lastSuccessful) {
      log('No previous deployment found for rollback', 'error');
      return false;
    }

    // Perform rollback
    const rollbackSuccess = await rollbackToCommit(lastSuccessful.head_sha);

    if (rollbackSuccess) {
      log('🎯 Rollback completed successfully', 'success');

      // Create notification issue
      await createRollbackIssue(reason, lastSuccessful.head_sha);

      return true;
    } else {
      log('💥 Rollback failed', 'error');
      return false;
    }
  } catch (error) {
    log(`Fatal rollback error: ${error.message}`, 'error');
    return false;
  }
}

// Export for use in other scripts
export { performRollback, getLastSuccessfulDeployment };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const reason = process.argv[2] || 'Manual rollback requested';

  performRollback(reason)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`Fatal error: ${error.message}`, 'error');
      process.exit(1);
    });
}
