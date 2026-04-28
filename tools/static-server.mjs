import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

export function createStaticServer({ root = process.cwd() } = {}) {
  const siteRoot = resolve(root);

  return createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    const relativePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
    const requestedPath = resolve(join(siteRoot, relativePath));

    if (requestedPath !== siteRoot && !requestedPath.startsWith(`${siteRoot}${sep}`)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const filePath =
      existsSync(requestedPath) && statSync(requestedPath).isDirectory()
        ? join(requestedPath, "index.html")
        : requestedPath;

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream"
    });
    createReadStream(filePath).pipe(response);
  });
}
