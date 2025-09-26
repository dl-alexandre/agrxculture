import type { APIRoute } from 'astro';

// Static pages configuration
const staticPages = [
  {
    url: '',
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: 'about',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: 'services',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: 'showcase',
    changefreq: 'weekly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: 'contact',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0],
  },
];

// Dynamic project pages - these would be generated from your projects data
const projectPages = [
  'farm-sensor-network',
  'yield-analytics',
  'farm-management-ios',
].map(id => ({
  url: `projects/${id}`,
  changefreq: 'monthly',
  priority: '0.8',
  lastmod: new Date().toISOString().split('T')[0],
}));

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() || 'https://agrxculture.com/';

  // Combine all pages
  const allPages = [...staticPages, ...projectPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
