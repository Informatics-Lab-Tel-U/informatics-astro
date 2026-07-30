import { getPosts } from "@/lib/api/blog";

export const prerender = false; // We can set this to true if the whole site is static, but since output is 'server', we leave it as false to have it generate on request, but we cache it.

export async function GET() {
  try {
    const posts = await getPosts();
    
    // Map to only essential fields for search
    const searchIndex = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      category: post.category,
      tags: post.tags,
    }));

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache the search index to avoid hitting backend too often
        'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate search index' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
