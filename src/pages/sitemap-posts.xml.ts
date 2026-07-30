import type { APIRoute } from 'astro';
import { getPosts, type BlogPost } from '@/lib/api/blog';
import { siteConfig } from '@/lib/config';

export const prerender = false;

export const GET: APIRoute = async () => {
  let allPosts: BlogPost[] = [];
  let currentPage = 1;
  const limit = 100; // Fetch 100 posts at a time to avoid overwhelming the backend
  let totalPages = 1;

  try {
    // First fetch to get total count and first batch
    const initialRes = await getPosts({ page: currentPage, limit });
    allPosts = [...initialRes.data];
    totalPages = Math.ceil(initialRes.totalCount / limit);

    // Fetch the rest of the pages if any
    const fetchPromises = [];
    for (let i = 2; i <= totalPages; i++) {
      fetchPromises.push(getPosts({ page: i, limit }));
    }

    if (fetchPromises.length > 0) {
      const results = await Promise.all(fetchPromises);
      results.forEach(res => {
        allPosts = [...allPosts, ...res.data];
      });
    }

  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    // If it fails, return empty sitemap rather than crashing
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPosts
    .map(
      (post) => `
  <url>
    <loc>${siteConfig.url}/post/${post.slug}</loc>
    <lastmod>${new Date(post.pubDate).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      // Cache sitemap at edge for 1 hour, revalidate in background up to 10 mins
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=600',
    },
  });
};
