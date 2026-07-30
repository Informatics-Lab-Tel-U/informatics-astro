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

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blog/posts/published`);
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
    console.error('Error fetching posts:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blog/posts/slug/${encodeURIComponent(slug)}`);
    
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
    const res = await fetch(`${BACKEND_URL}/api/blog/categories`);
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
    const res = await fetch(`${BACKEND_URL}/api/blog/tags`);
    if (!res.ok) return [];
    const json = await res.json();
    return json && json.ok && json.data && json.data.length > 0 ? json.data : [];
  } catch (err) {
    console.error('Error fetching tags:', err);
    return [];
  }
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const posts = await getPosts();
  return posts.filter(post => post.category && post.category.slug === categorySlug);
}

export async function getPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  const posts = await getPosts();
  return posts.filter(post => post.tags && post.tags.some(tag => tag.slug === tagSlug));
}
