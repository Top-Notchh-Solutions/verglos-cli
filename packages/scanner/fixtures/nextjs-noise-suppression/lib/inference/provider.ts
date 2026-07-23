export async function callProvider() {
  const headers = {
    "X-Goog-Content-Length": String(1024),
    "X-Goog-Type": "application/octet-stream",
  };
  const uploadLinks = ["/spec/files"];
  const downloadLinks = ["/spec/files"];
  return { headers, uploadLinks, downloadLinks };
}
