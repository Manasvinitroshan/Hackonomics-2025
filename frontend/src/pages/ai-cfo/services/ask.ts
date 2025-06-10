export async function askQuestion(question: string): Promise<string> {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    // try to parse JSON error, otherwise text
    const ct = res.headers.get('content-type') || '';
    const errMsg = ct.includes('application/json')
      ? (await res.json()).error
      : await res.text();
    throw new Error(errMsg || `Request failed: ${res.status}`);
  }

  const { answer } = await res.json();
  return answer;
}
