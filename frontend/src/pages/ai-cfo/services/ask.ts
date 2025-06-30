// services/ask.ts
export async function askQuestion(question: string, context: string): Promise<string> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context }),  // include context here
  });
  const payload = await res.json();
  if (!res.ok || payload.error) {
    throw new Error(payload.error || res.statusText);
  }
  return payload.answer;
}
