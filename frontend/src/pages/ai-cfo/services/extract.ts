export async function extractText(bucket: string, key: string): Promise<string> {
  const res = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, key }),
  });
  if (!res.ok) throw new Error(`Request failed with status code ${res.status}`);
  const { text } = await res.json();
  return text;
}
