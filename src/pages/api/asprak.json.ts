import type { APIRoute } from "astro";

export const prerender = false;

const BACKEND_URL =
  import.meta.env.PUBLIC_HONO_BACKEND_URL || "https://manajemenasprak-backend.iflabdev.workers.dev";
const INTERNAL_API_KEY = import.meta.env.INTERNAL_API_KEY || "";

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const term = url.searchParams.get("term");

    let backendUrl = `${BACKEND_URL}/api/asprak`;
    if (term && term !== "all") {
      // Validate term format (alphanumeric and hyphen only, max 10 chars)
      if (!/^[a-zA-Z0-9-]{1,10}$/.test(term)) {
        return new Response(JSON.stringify({ ok: false, error: "Parameter format tidak valid" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
      backendUrl += `?term=${encodeURIComponent(term)}`;
    }

    const res = await fetch(backendUrl, {
      headers: { "x-api-key": INTERNAL_API_KEY },
    });

    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }

    const json = await res.json();
    if (!json.ok || !Array.isArray(json.data)) {
      throw new Error("Invalid response format from backend");
    }

    // Filter role ASPRAK, exclude NIM and RFID from public output, and sort
    const asprakList = json.data
      .filter((a: any) => a.role === "ASPRAK")
      .map((a: any) => ({
        id: String(a.id),
        nama_lengkap: a.nama_lengkap,
        kode: a.kode,
        angkatan: a.angkatan || 0,
        role: a.role,
      }))
      .sort(
        (a: any, b: any) => b.angkatan - a.angkatan || a.nama_lengkap.localeCompare(b.nama_lengkap),
      );

    return new Response(JSON.stringify({ ok: true, data: asprakList }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("[api/asprak.json] Error:", error.message);
    return new Response(
      JSON.stringify({ ok: false, error: "Gagal memuat data asisten praktikum" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  }
};
