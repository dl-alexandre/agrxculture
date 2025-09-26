# Custom Domain Setup for GitHub Pages

## Overview

This guide helps you set up a custom domain for your agricultural portfolio website hosted on GitHub Pages.

## Prerequisites

- Domain name registered with a domain registrar
- Access to domain DNS settings
- GitHub repository with Pages enabled

## Setup Steps

### 1. Configure DNS Records

#### For Root Domain (e.g., agrxculture.com):

Add these A records pointing to GitHub Pages:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

#### For Subdomain (e.g., portfolio.agrxculture.com):

Add a CNAME record:

```
CNAME: portfolio -> agrxculture.github.io
```

### 2. Update Repository Settings

1. Go to repository Settings → Pages
2. Set source to "Deploy from a branch"
3. Select "gh-pages" branch
4. Enter your custom domain in the "Custom domain" field
5. Enable "Enforce HTTPS" (after DNS propagation)

### 3. Update Environment Variables

Set the custom domain in your deployment workflow:

```bash
# In GitHub repository secrets
CUSTOM_DOMAIN=your-domain.com
```

### 4. Update Astro Configuration

Update `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://your-domain.com',
  base: '/', // Remove base path for custom domain
  // ... other config
});
```

## SSL Certificate

GitHub Pages automatically provides SSL certificates for custom domains:

- Certificate is issued by Let's Encrypt
- Automatic renewal
- HTTPS enforcement available after setup

## DNS Propagation

- DNS changes can take 24-48 hours to propagate globally
- Use tools like `dig` or online DNS checkers to verify
- Test from different locations/networks

## Verification Commands

### Check DNS Resolution:

```bash
# Check A records
dig your-domain.com A

# Check CNAME records
dig portfolio.your-domain.com CNAME

# Check from specific DNS server
dig @8.8.8.8 your-domain.com A
```

### Test HTTPS:

```bash
curl -I https://your-domain.com
```

## Troubleshooting

### Common Issues:

1. **DNS not propagating**: Wait 24-48 hours, check with multiple DNS checkers
2. **SSL certificate not issued**: Ensure DNS is correct, disable/re-enable HTTPS in GitHub settings
3. **404 errors**: Check that gh-pages branch has correct files
4. **Mixed content warnings**: Ensure all assets use HTTPS URLs

### Debug Commands:

```bash
# Check current DNS
nslookup your-domain.com

# Test SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Check HTTP headers
curl -I https://your-domain.com
```

## Performance Optimization with Custom Domain

### CDN Configuration (Optional):

If using Cloudflare or similar CDN:

1. Add domain to CDN
2. Configure cache rules for static assets
3. Enable compression and minification
4. Set up cache headers as documented in CACHE-HEADERS-SETUP.md

### Monitoring:

- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure Google Search Console
- Monitor Core Web Vitals with PageSpeed Insights

## Current Configuration

⚠️ No custom domain configured
Repository: agrxculture/agricultural-portfolio-website
Branch: gh-pages

## Next Steps

1. Set CUSTOM_DOMAIN environment variable
2. Update repository settings
3. Wait for DNS propagation
4. Enable HTTPS enforcement
5. Test deployment verification script
