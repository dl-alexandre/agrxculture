#!/usr/bin/env node

/**
 * Formspree Endpoint Test
 * Tests if a Formspree endpoint is valid and active
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function testFormspreeEndpoint(formId) {
  return new Promise((resolve) => {
    const url = `https://formspree.io/f/${formId}`;
    
    console.log(`Testing Formspree endpoint: ${url}`);
    
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);
      
      if (res.statusCode === 200) {
        console.log('✅ Endpoint is valid and active');
        resolve(true);
      } else if (res.statusCode === 400) {
        console.log('❌ Endpoint is invalid or not activated');
        console.log('   - Check if form ID is correct');
        console.log('   - Verify form is activated in Formspree dashboard');
        resolve(false);
      } else {
        console.log(`⚠️  Unexpected status: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log('❌ Network error:', err.message);
      resolve(false);
    });
    
    req.end();
  });
}

async function main() {
  console.log('Formspree Endpoint Tester');
  console.log('========================\n');
  
  rl.question('Enter your Formspree form ID (or press Enter to test current): ', async (input) => {
    const formId = input.trim() || 'xpwzgkqr';
    
    const isValid = await testFormspreeEndpoint(formId);
    
    if (!isValid) {
      console.log('\n🔧 To fix this:');
      console.log('1. Go to https://formspree.io/forms');
      console.log('2. Create a new form');
      console.log('3. Copy the form ID from the endpoint URL');
      console.log('4. Update your .env file with: PUBLIC_FORMSPREE_FORM_ID=your_form_id');
      console.log('5. Activate the form via email');
    }
    
    rl.close();
  });
}

main().catch(console.error);
