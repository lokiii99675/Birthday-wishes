/**
 * Tiny zero-dependency static web server for the Happy Birthday page.
 *
 *   npm run dev        → http://localhost:3000
 *   npm run dev -- 5500 → http://localhost:5500
 *
 * Why a server at all? Opening index.html directly from the filesystem (file://)
 * breaks audio playback in most browsers. Serving over http:// fixes that.
 *
 * No packages, no install, no build step — just Node.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".mpeg": "audio/mpeg",
  ".mp4": "audio/mp4",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(
      new URL(req.url, `http://${req.headers.host}`).pathname,
    );
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Bad request");
  }

  if (urlPath === "/") urlPath = "/index.html";

  // Resolve safely inside ROOT (blocks ../ traversal).
  const filePath = path.resolve(ROOT, "." + urlPath);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 — Not found: " + urlPath);
    }

    const type =
      MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    const headers = {
      "Content-Type": type,
      "Content-Length": stats.size,
      "Cache-Control": "no-cache",
      "Accept-Ranges": "bytes",
    };

    // Range support so audio seeking works.
    const range = req.headers.range;
    if (range) {
      const match = /bytes=(\d*)-(\d*)/.exec(range);
      if (match) {
        const start = match[1] ? parseInt(match[1], 10) : 0;
        const end = match[2] ? parseInt(match[2], 10) : stats.size - 1;
        if (start <= end && end < stats.size) {
          headers["Content-Length"] = end - start + 1;
          headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`;
          res.writeHead(206, headers);
          return fs.createReadStream(filePath, { start, end }).pipe(res);
        }
      }
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  Port ${PORT} is already in use.`);
    console.error(`  Try another port:   npm run dev -- ${PORT + 1}\n`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("  🎂  Happy Birthday site is running!");
  console.log("");
  console.log(`      →  http://localhost:${PORT}`);
  console.log("");
  console.log("  Press Ctrl+C to stop.");
  console.log("");
});
