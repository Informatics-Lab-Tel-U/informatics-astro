import type { APIRoute } from "astro";

export const prerender = false;

const BACKEND_URL =
  import.meta.env.PUBLIC_HONO_BACKEND_URL || "https://manajemenasprak-backend.iflabdev.workers.dev";
const INTERNAL_API_KEY = import.meta.env.INTERNAL_API_KEY || "";

const AUTH_HEADER = { Authorization: `Bearer ${INTERNAL_API_KEY}` };

function mapPost(post: any) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.excerpt || "",
    category: post.blog_categories ||
      post.category || { id: "0", slug: "uncategorized", name: "Uncategorized" },
    tags: (post.tags || []).flatMap((t: any) => {
      const tag = t.tag || t;
      return tag ? [tag] : [];
    }),
  };
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    let backendUrl: string;

    if (q) {
      // Jika ada query, gunakan endpoint search backend (filter di server)
      backendUrl = `${BACKEND_URL}/api/blog/search?q=${encodeURIComponent(q)}&limit=20`;
    } else {
      // Jika tidak ada query, ambil semua post sebagai search index untuk command palette
      // Limit 200 cukup untuk di-filter di client-side
      backendUrl = `${BACKEND_URL}/api/blog/posts/published?limit=200&sort=newest`;
    }

    const res = await fetch(backendUrl, { headers: AUTH_HEADER });

    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }

    const json = await res.json();
    if (!json.ok || !json.data) {
      throw new Error("Invalid backend response");
    }

    const searchIndex = json.data.map(mapPost);

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache lebih pendek agar post baru langsung muncul di search
        "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[search.json] Error:", error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
