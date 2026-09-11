const MAX_JSON_RESPONSE_BYTES = 1 * 1024 * 1024;

export async function readJsonResponse(response: Response): Promise<unknown | null> {
  const length = Number(response.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > MAX_JSON_RESPONSE_BYTES) return null;
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_JSON_RESPONSE_BYTES) return null;
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { return null; }
}
