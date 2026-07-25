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
// MOCK DATA (Data Dummy)
// ==========================================
// Data ini digunakan sementara hingga endpoint backend 'manajemenasprak' siap.
// Jika endpoint sudah siap, kita cukup mengganti isi fungsi fetch di bawah
// untuk mengarah ke URL backend (contoh: fetch('http://localhost:3000/api/posts'))

const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', slug: 'pengumuman', name: 'Pengumuman' },
  { id: 'c2', slug: 'tutorial', name: 'Tutorial' },
  { id: 'c3', slug: 'riset', name: 'Riset' },
];

const MOCK_TAGS: Tag[] = [
  { id: 't1', slug: 'pbo', name: 'PBO' },
  { id: 't2', slug: 'oprec', name: 'Oprec' },
  { id: 't3', slug: 'jaringan', name: 'Jaringan' },
  { id: 't4', slug: 'ai', name: 'AI' },
];

const MOCK_POSTS: BlogPost[] = [
  {
    id: 'p1',
    slug: 'pendaftaran-klinik-akademik-2026',
    title: 'Pendaftaran Klinik Akademik Semester Ganjil Telah Dibuka',
    description: 'Klinik Akademik untuk mata kuliah Algoritma Pemrograman, Struktur Data, dan Jaringan Komputer telah dibuka. Segera daftarkan diri Anda!',
    content: `
# Pendaftaran Klinik Akademik Dibuka!

Klinik Akademik adalah program bimbingan belajar tambahan yang dikelola oleh asisten laboratorium untuk membantu mahasiswa memahami materi perkuliahan secara lebih mendalam.

## Mata Kuliah yang Tersedia
- **Algoritma Pemrograman** (Dasar Python & C++)
- **Struktur Data**
- **Jaringan Komputer** (Praktik Cisco Packet Tracer)

Silakan daftar melalui portal asisten masing-masing sebelum batas waktu minggu depan.
    `,
    pubDate: '2026-07-20T08:00:00Z',
    author: 'Admin Laboratorium',
    heroImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[0], MOCK_TAGS[2]],
  },
  {
    id: 'p2',
    slug: 'pengenalan-arsitektur-microservices',
    title: 'Mengenal Arsitektur Microservices dalam Proyek Skala Besar',
    description: 'Pelajari dasar-dasar arsitektur microservices dan bagaimana pola desain ini memecahkan masalah monolitik pada sistem kompleks.',
    content: `
# Mengenal Microservices

Dalam pengembangan perangkat lunak modern, arsitektur monolitik mulai ditinggalkan demi pendekatan yang lebih modular dan mudah dikelola dalam skala besar, yaitu **Microservices**.

Masing-masing komponen (seperti autentikasi, pembayaran, notifikasi) berjalan sebagai layanan independen.

*Artikel selengkapnya akan diperbarui minggu depan.*
    `,
    pubDate: '2026-07-15T10:30:00Z',
    author: 'Riset & RisTI',
    heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
    category: MOCK_CATEGORIES[2],
    tags: [MOCK_TAGS[3]],
  },
  {
    id: 'p3',
    slug: 'open-recruitment-asisten-2026',
    title: 'Open Recruitment Asisten Laboratorium Fakultas Informatika',
    description: 'Fakultas Informatika resmi membuka rekrutmen asisten untuk periode akademik mendatang. Persiapkan diri Anda!',
    content: `
# Bergabunglah Bersama Kami!

Ingin berkontribusi sebagai asisten praktikum? Ini adalah kesempatan emas untuk mengasah kemampuan *hard-skill* maupun *soft-skill* Anda.

### Syarat Pendaftaran:
1. Minimal IPK 3.00
2. Telah lulus mata kuliah yang bersangkutan dengan nilai minimal AB.
3. Bersedia meluangkan waktu minimal 10 jam per minggu.

Cek halaman pendaftaran di portal SSO mahasiswa.
    `,
    pubDate: '2026-07-10T09:00:00Z',
    author: 'Koordinator Asisten',
    heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[1]],
  }
];

// ==========================================
// API FETCH FUNCTIONS
// ==========================================

const SUPABASE_URL = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getPosts(): Promise<BlogPost[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?status=eq.published&select=*,category:blog_categories(*),tags:blog_post_tags(tag:blog_tags(*))`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch posts', await res.text());
      return [];
    }
    
    const data = await res.json();
    return data.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.excerpt || '',
      content: typeof post.content === 'string' ? post.content : JSON.stringify(post.content),
      pubDate: post.published_at,
      author: 'Admin', // In real app, from post.pengguna
      heroImage: post.cover_image_url || undefined,
      category: post.category || { id: '0', slug: 'uncategorized', name: 'Uncategorized' },
      tags: (post.tags || []).map((t: any) => t.tag)
    }));
  } catch (err) {
    console.error('Error fetching posts:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return undefined;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?status=eq.published&slug=eq.${slug}&select=*,category:blog_categories(*),tags:blog_post_tags(tag:blog_tags(*))`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    
    if (!res.ok) return undefined;
    
    const data = await res.json();
    if (!data || data.length === 0) return undefined;
    
    const post = data[0];
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.excerpt || '',
      content: typeof post.content === 'string' ? post.content : JSON.stringify(post.content),
      pubDate: post.published_at,
      author: 'Admin',
      heroImage: post.cover_image_url || undefined,
      category: post.category || { id: '0', slug: 'uncategorized', name: 'Uncategorized' },
      tags: (post.tags || []).map((t: any) => t.tag)
    };
  } catch (err) {
    console.error('Error fetching post:', err);
    return undefined;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_categories?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getTags(): Promise<Tag[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_tags?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}
