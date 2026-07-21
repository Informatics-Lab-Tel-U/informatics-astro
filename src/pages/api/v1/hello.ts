import type { APIRoute } from "astro";

// Wajib diletakkan jika output web adalah hybrid dan file ini adalah endpoint dinamis
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // Anda bisa mengambil query params dari URL request
  const url = new URL(request.url);
  const name = url.searchParams.get("name") || "Praktikan";

  // Data ini bisa berasal dari pemanggilan Database (misal: Prisma/Drizzle) atau API Eksternal
  const data = {
    status: "success",
    message: `Halo ${name}, selamat datang di API Web Laboratorium!`,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
