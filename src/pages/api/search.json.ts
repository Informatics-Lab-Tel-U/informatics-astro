import type { APIRoute } from 'astro';

export const prerender = false;

const BACKEND_URL = import.meta.env.PUBLIC_HONO_BACKEND_URL || 'https://manajemenasprak-backend.iflabdev.workers.dev';
const INTERNAL_API_KEY = import.meta.env.INTERNAL_API_KEY || '';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    
    if (!q) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(`${BACKEND_URL}/api/blog/search?q=${encodeURIComponent(q)}&limit=20`, {
      headers: {
        'Authorization': `Bearer ${INTERNAL_API_KEY}`
      }
    });
    if (!res.ok) {
      throw new Error('Backend responded with error');
    }
    
    const json = await res.json();
    if (!json.ok || !json.data) {
      throw new Error('Invalid backend response');
    }

    const searchIndex = json.data.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.excerpt || '',
      category: post.blog_categories || post.category || { id: '0', slug: 'uncategorized', name: 'Uncategorized' },
      tags: (post.tags || []).flatMap((t: any) => { const tag = t.tag || t; return tag ? [tag] : []; })
    }));

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to search posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
