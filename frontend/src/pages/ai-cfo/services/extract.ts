export async function extractText(bucket: string, key: string): Promise<string> {
  const res = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket, key }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Extract failed (${res.status}): ${errText}`);
  }
  const { text } = await res.json();
  return text;
}
