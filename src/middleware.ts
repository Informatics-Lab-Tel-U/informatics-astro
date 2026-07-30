import { defineMiddleware } from "astro:middleware";

const BACKEND_URL = import.meta.env.PUBLIC_HONO_BACKEND_URL || "https://manajemenasprak-backend.iflabdev.workers.dev";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isStaticAsset = pathname.startsWith("/_image") ||
    pathname.startsWith("/_astro") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|woff|woff2|ttf|eot)$/i);

  if (isStaticAsset) {
    return next();
  }

  let isMaintenance = false;

  try {
    const res = await fetch(`${BACKEND_URL}/api/system/maintenance?app=informaticsweb`);

    if (res.ok) {
      const data: any = await res.json();
      isMaintenance = !!(data?.active ?? data?.maintenance);
    } else {
      isMaintenance = true;
    }
  } catch (error) {
    console.error("Failed to check maintenance mode (Backend down):", error);
    isMaintenance = true;
  }

  if (isMaintenance && pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ error: "Service Unavailable", message: "Sistem sedang dalam perbaikan." }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (isMaintenance && pathname !== "/maintenance") {
    return context.redirect("/maintenance", 302);
  }

  if (!isMaintenance && pathname === "/maintenance") {
    return context.redirect("/", 302);
  }

  return next();
});
