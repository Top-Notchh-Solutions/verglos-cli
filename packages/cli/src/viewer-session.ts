import { randomBytes } from "node:crypto";
import { createServer, type Server } from "node:http";

export async function startViewerSession(payload: string): Promise<{ readonly url: string; readonly token: string; readonly server: Server; readonly close: () => Promise<void> }> {
  const token = randomBytes(24).toString("base64url");
  const prefix = `/__verglos/${token}/`;
  const server = createServer((request, response) => {
    if ((request.url ?? "") !== prefix) { response.writeHead(404, { "content-type": "text/plain", "content-security-policy": "default-src 'none'" }); response.end("not found"); return; }
    response.writeHead(200, { "content-type": "text/html; charset=utf-8", "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'none'; base-uri 'none'; frame-ancestors 'none'", "cache-control": "no-store" }); response.end(payload);
  });
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", () => resolve()); });
  const address = server.address(); if (!address || typeof address === "string") throw new Error("viewer server did not expose a TCP address");
  return { url: `http://127.0.0.1:${address.port}${prefix}`, token, server, close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
}
