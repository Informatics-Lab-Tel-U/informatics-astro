export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  pubDate: string;
  author: string;
  heroImage?: string;
  category: Category;
  tags: Tag[];
}

// ==========================================
// API FETCH FUNCTIONS
// ==========================================

const BACKEND_URL = import.meta.env.PUBLIC_HONO_BACKEND_URL || 'https://manajemenasprak-backend.iflabdev.workers.dev';
const INTERNAL_API_KEY = import.meta.env.INTERNAL_API_KEY || '';

const getFetchOptions = () => ({
  headers: {
    'Authorization': `Bearer ${INTERNAL_API_KEY}`
  }
});

export interface PaginatedPosts {
  data: BlogPost[];
  totalCount: number;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
  categorySlug?: string;
  tagSlug?: string;
}

export async function getPosts(params: GetPostsParams = {}): Promise<PaginatedPosts> {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.categorySlug) searchParams.append('categorySlug', params.categorySlug);
    if (params.tagSlug) searchParams.append('tagSlug', params.tagSlug);

    const qs = searchParams.toString();
    const url = `${BACKEND_URL}/api/blog/posts/published${qs ? '?' + qs : ''}`;
    
    const res = await fetch(url, getFetchOptions());
    if (!res.ok) return { data: [], totalCount: 0 };
    
    const json = await res.json();
    if (!json || !json.ok || !json.data) return { data: [], totalCount: 0 };
    
    const data = json.data.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.excerpt || '',
      content: typeof post.content === 'string' ? post.content : (post.content ? JSON.stringify(post.content) : ''),
      pubDate: post.published_at || new Date().toISOString(),
      author: post.pengguna?.nama_lengkap || 'Admin Laboratorium',
      heroImage: post.cover_image_url || '/default-image.svg',
      category: post.blog_categories || post.category || { id: '0', slug: 'uncategorized', name: 'Uncategorized' },
      tags: (post.tags || []).flatMap((t: any) => { const tag = t.tag || t; return tag ? [tag] : []; })
    }));

    return {
      data,
      totalCount: json.meta?.totalCount || data.length
    };
  } catch (err) {
    console.error('Error fetching posts:', err);
    return { data: [], totalCount: 0 };
  }
}

export async function getRelatedPosts(categorySlug: string, excludeSlug: string, limit: number = 2): Promise<BlogPost[]> {
  try {
    const searchParams = new URLSearchParams({
      categorySlug,
      excludeSlug,
      limit: limit.toString()
    });
    const res = await fetch(`${BACKEND_URL}/api/blog/posts/related?${searchParams.toString()}`, getFetchOptions());
    if (!res.ok) return [];
    
    const json = await res.json();
    if (!json || !json.ok || !json.data) return [];
    
    return json.data.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.excerpt || '',
      content: typeof post.content === 'string' ? post.content : (post.content ? JSON.stringify(post.content) : ''),
      pubDate: post.published_at || new Date().toISOString(),
      author: post.pengguna?.nama_lengkap || 'Admin Laboratorium',
      heroImage: post.cover_image_url || '/default-image.svg',
      category: post.blog_categories || post.category || { id: '0', slug: 'uncategorized', name: 'Uncategorized' },
      tags: (post.tags || []).flatMap((t: any) => { const tag = t.tag || t; return tag ? [tag] : []; })
    }));
  } catch (err) {
    console.error('Error fetching related posts:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blog/posts/slug/${encodeURIComponent(slug)}`, getFetchOptions());
    
    if (!res.ok) return undefined;
    
    const json = await res.json();
    if (!json || !json.ok || !json.data) return undefined;
    
    const post = json.data;
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.excerpt || '',
      content: typeof post.content === 'string' ? post.content : (post.content ? JSON.stringify(post.content) : ''),
      pubDate: post.published_at || new Date().toISOString(),
      author: post.pengguna?.nama_lengkap || 'Admin Laboratorium',
      heroImage: post.cover_image_url || '/default-image.svg',
      category: post.blog_categories || post.category || { id: '0', slug: 'uncategorized', name: 'Uncategorized' },
      tags: (post.tags || []).flatMap((t: any) => { const tag = t.tag || t; return tag ? [tag] : []; })
    };
  } catch (err) {
    console.error('Error fetching post:', err);
    return undefined;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blog/categories`, getFetchOptions());
    if (!res.ok) return [];
    const json = await res.json();
    return json && json.ok && json.data && json.data.length > 0 ? json.data : [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blog/tags`, getFetchOptions());
    if (!res.ok) return [];
    const json = await res.json();
    return json && json.ok && json.data && json.data.length > 0 ? json.data : [];
  } catch (err) {
    console.error('Error fetching tags:', err);
    return [];
  }
}
