import { serve } from "bun";

const DIST = "dist";
const BASE = "/admin";

serve({
  port: 5173,
  fetch(req) {
    const url = new URL(req.url);

    if (!url.pathname.startsWith(BASE)) {
      return new Response("Not Found", { status: 404 });
    }

    let filePath = url.pathname.slice(BASE.length);
    if (filePath === "" || filePath === "/") {
      filePath = "/index.html";
    }

    const file = Bun.file(DIST + filePath);

    // SPA fallback
    if (!file.size) {
      return new Response(Bun.file(DIST + "/index.html"));
    }

    return new Response(file);
  },
});

console.log("Admin UI running on port 5173");
