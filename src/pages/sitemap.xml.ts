import type { APIRoute } from 'astro';

// Static pages configuration
const staticPages = [
  {
    url: '',
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'about',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'services',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'showcase',
    changefreq: 'weekly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: 'contact',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Dynamic project pages - these would be generated from your projects data
const projectPages = [
  'farm-sensor-network',
  'yield-analytics',
  'farm-management-ios'
].map(id => ({
  url: `projects/${id}`,
  changefreq: 'monthly',
  priority: '0.8',
  lastmod: new Date().toISOString().split('T')[0]
}));

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() || 'https://agrxculture.com/';
  
  // Combine all pages
  const allPages = [...staticPages, ...projectPages];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${allPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.url === 'showcase' ? `
    <image:image>
      <image:loc>${siteUrl}images/showcase/farm-sensor-network.jpg</image:loc>
      <image:title>Farm Sensor Network - IoT Agricultural Monitoring</image:title>
      <image:caption>Precision agriculture IoT sensor network for real-time farm monitoring and data collection</image:caption>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}images/showcase/farm-management-ios.jpg</image:loc>
      <image:title>Farm Management iOS App - Mobile Farm Operations</image:title>
      <image:caption>iOS mobile application for comprehensive farm management and agricultural operations</image:caption>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}images/showcase/yield-analytics.jpg</image:loc>
      <image:title>Yield Analytics Platform - Agricultural Data Intelligence</image:title>
      <image:caption>Comprehensive yield analytics and agricultural data intelligence platform</image:caption>
    </image:image>` : ''}${page.url.startsWith('projects/') ? `
    <image:image>
      <image:loc>${siteUrl}images/showcase/${page.url.split('/')[1]}.jpg</image:loc>
      <image:title>${page.url.split('/')[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Agricultural Technology Project</image:title>
      <image:caption>Detailed case study of ${page.url.split('/')[1].replace(/-/g, ' ')} agricultural technology implementation</image:caption>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  });
};