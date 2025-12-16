import { serve } from "bun";
import { join } from "path";

const DIST = "dist";
const BASE = "/admin";

serve({
  port: 5173,
  fetch(req) {
    const url = new URL(req.url);

    // Reject anything outside /admin
    if (!url.pathname.startsWith(BASE)) {
      return new Response("Not Found", { status: 404 });
    }

    // Map URL to file
    let filePath = url.pathname.replace(BASE, "");
    if (filePath === "" || filePath === "/") {
      filePath = "/index.html";
    }

    const fullPath = join(DIST, filePath);
    const file = Bun.file(fullPath);

    if (!file.size) {
      // SPA fallback
      return new Response(Bun.file(join(DIST, "index.html")));
    }

    return new Response(file);
  },
});

console.log("Serving at http://localhost:5173/admin/");
