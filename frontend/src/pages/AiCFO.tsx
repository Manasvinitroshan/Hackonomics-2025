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
import { FaFileUpload } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";


import "../styles/aifcfo.css";

type Message = { from: "user" | "ai"; text: string };

export default function AiCFO() {
  const [file, setFile]               = useState<File | null>(null);
  const [fileKey, setFileKey]         = useState<string>("");
  const [contextText, setContextText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "ai", text: "Hey, how can I help you with your financial documents?" }
  ]);
  
  const [question, setQuestion]       = useState<string>("");
  const [status, setStatus]           = useState<string>("");
  const [loading, setLoading]         = useState<boolean>(false);
  const [phone, setPhone]             = useState<string>("");
  const chatEndRef                    = useRef<HTMLDivElement>(null);
  

  // Pull phone from Cognito ID token
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.phone_number) {
          setPhone(payload.phone_number);
        }
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setFileKey("");
    setStatus("");
    setMessages([]);
    setContextText("");
  };

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
      const { key }  = await uploadFileToS3(formData);
      setFileKey(key);

      setStatus("Extracting text…");
      const text = await extractText("ai-cfo-docs", key);

      setContextText(text);
      setMessages([{ from: "ai", text: "How can I help you?" }]);
      setStatus("Ready to ask questions.");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Unknown error";
      setMessages([{ from: "ai", text: `❌ ${msg}` }]);
      setStatus(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCallCustomer = async () => {
    if (!phone) {
      setStatus("❗ No phone number available.");
      return;
    }
    setLoading(true);
    setStatus("📞 Dialing…");
    try {
      const resp = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phone, key: fileKey || undefined }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Call failed");
      setStatus(`📞 Call started (ID: ${data.call_id})`);
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-cfo-page">
      <div className="ai-cfo-header">
        <h2>AI CFO</h2>
        <p className="ai-cfo-subtitle">
          Instantly turn your PDFs into actionable financial insights.
        </p>
      </div>

      <div className="ai-cfo-container">
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
            { <FaFileUpload /> }
          </button>
        </div>

        {status && (
          <div className="status">
            <em>{status}</em>
          </div>
        )}

        {/* Chat window remains unchanged */}
        <div className="chat-window">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.from}`}>
              <div className={`bubble ${msg.from}`}>
                <strong>{msg.from === 'user' ? 'You:' : 'AI:'}</strong> {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSendQuestion} className="chat-input">
          <input
            type="text"
            placeholder="Type your question…"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={!question.trim() || loading}>
          <IoMdSend />

          </button>
        </form>

        {/* Centered Call Customer section */}
        <div className="call-section">
          <div className="phone-display">
            
          </div>
          <button
            onClick={handleCallCustomer}
            disabled={!phone || loading}
          >
            {loading ? "Dialing…" : "Consult AI CFO"}
          </button>
        </div>
      </div>
    </div>
);
}
