const MAX_JSON_RESPONSE_BYTES = 1 * 1024 * 1024;

export async function readJsonResponse(response: Response, maxBytes = MAX_JSON_RESPONSE_BYTES): Promise<unknown | null> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) return null;
  const bytes = await readBoundedResponse(response, maxBytes);
  if (bytes === undefined) return null;
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { return null; }
}

/** Read a provider body without retaining more than the caller's byte cap. */
export async function readBoundedResponse(response: Response, maxBytes: number): Promise<Uint8Array | undefined> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) return undefined;
  const length = Number(response.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > maxBytes) {
    await cancelBody(response);
    return undefined;
  }
  if (response.body === null) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      if (!(next.value instanceof Uint8Array)) {
        await reader.cancel().catch(() => undefined);
        return undefined;
      }
      total += next.value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return undefined;
      }
      chunks.push(next.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function cancelBody(response: Response): Promise<void> {
  try { await response.body?.cancel(); } catch { /* bounded readers never retain provider bodies */ }
}
