// src/pages/ai-cfo/AiCFO.tsx
import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent
} from "react";
import { uploadFileToS3 } from "/Users/manassingh/LeanFoundr/frontend/src/pages/ai-cfo/services/upload.ts";
import { extractText }    from "/Users/manassingh/LeanFoundr/frontend/src/pages/ai-cfo/services/extract.ts";
import { askQuestion }    from "/Users/manassingh/LeanFoundr/frontend/src/pages/ai-cfo/services/ask.ts";
import "/Users/manassingh/LeanFoundr/frontend/src/styles/aifcfo.css";

type Message = { from: "user" | "ai"; text: string };

export default function AiCFO() {
  const [file, setFile]                   = useState<File | null>(null);
  const [contextText, setContextText]     = useState<string>("");
  const [messages, setMessages]           = useState<Message[]>([]);
  const [question, setQuestion]           = useState<string>("");
  const [callTo, setCallTo]               = useState<string>("");
  const [status, setStatus]               = useState<string>("");
  const [loading, setLoading]             = useState<boolean>(false);
  const chatEndRef                        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle PDF selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setStatus("");
    setMessages([]);
    setContextText("");
  };

  // Upload and extract text
  const handleUploadAndExtract = async () => {
    if (!file) {
      setStatus("❗ No file selected.");
      return;
    }
    setLoading(true);
    setStatus("Uploading…");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { key } = await uploadFileToS3(formData);

      setStatus("Extracting text…");
      const text = await extractText("ai-cfo-docs", key);

      setContextText(text);
      setMessages([{ from: "ai", text: `✅ Extracted ${text.length} characters.` }]);
      setStatus("Ready to ask questions.");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Unknown error";
      setMessages([{ from: "ai", text: `❌ ${msg}` }]);
      setStatus(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Send a question to the RAG endpoint
  const handleSendQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setStatus("❗ Please enter a question.");
      return;
    }
    setLoading(true);
    setStatus("Thinking…");
    setMessages(prev => [...prev, { from: "user", text: question }]);
    try {
      const answer = await askQuestion(question);
      setMessages(prev => [...prev, { from: "ai", text: answer }]);
      setStatus("");
    } catch (err: any) {
      const msg = err.message || "Unknown error";
      setMessages(prev => [...prev, { from: "ai", text: `❌ ${msg}` }]);
      setStatus(`❌ ${msg}`);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  // Place a phone call via Retell
  const handleCallCustomer = async () => {
    if (!callTo.trim()) {
      setStatus("❗ Please enter a phone number.");
      return;
    }
    setLoading(true);
    setStatus("📞 Dialing…");
    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: callTo.trim() }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const { call_id } = await res.json();
      setStatus(`📞 Call started (ID: ${call_id})`);
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-cfo-container">
      <h2>📄 AI CFO</h2>

      {/* PDF Upload Section */}
      <div className="upload-section">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={loading || Boolean(contextText)}
        />
        <button
          onClick={handleUploadAndExtract}
          disabled={!file || loading || Boolean(contextText)}
        >
          {loading && !contextText ? "Uploading…" : "Upload & Extract"}
        </button>
      </div>

      {/* Status */}
      {status && (
        <div
          className="status"
          style={{ color: status.startsWith("❌") ? "red" : undefined }}
        >
          <em>{status}</em>
        </div>
      )}

      {/* Chat & Call UI */}
      {contextText && (
        <>
          <h3>🤖 Ask Questions</h3>
          <form onSubmit={handleSendQuestion} className="chat-input">
            <input
              type="text"
              placeholder="Type your question here…"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={!question.trim() || loading}>
              {loading ? "Thinking…" : "Send"}
            </button>
          </form>

          <div className="chat-window">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.from}`}>
                <div className={`bubble ${msg.from}`}>
                  <strong>{msg.from === "user" ? "You:" : "AI:"}</strong> {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <h3>📞 Call Customer</h3>
          <div style={{ textAlign: "center", margin: "1rem 0" }}>
            <input
              type="tel"
              placeholder="Customer number (+1XXXXXXXXXX)"
              value={callTo}
              onChange={e => setCallTo(e.target.value)}
              disabled={loading}
              style={{
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
                width: "60%",
                marginRight: "0.5rem",
              }}
            />
            <button
              onClick={handleCallCustomer}
              disabled={!callTo.trim() || loading}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 4,
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                cursor: !callTo.trim() || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Dialing…" : "Call Customer"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
