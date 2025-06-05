// src/pages/ai-cfo/AiCFO.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { uploadFileToS3 } from '/Users/manassingh/LeanFoundr/frontend/src/pages/ai-cfo/services/upload.ts';
import { extractText } from '/Users/manassingh/LeanFoundr/frontend/src/pages/ai-cfo/services/extract.ts';
import { askQuestion } from '/Users/manassingh/LeanFoundr/frontend/src/pages/ai-cfo/services/ask.ts';

type Message = {
  from: 'user' | 'ai';
  text: string;
};

export default function AiCFO() {
  // ── STATE ─────────────────────────────────────────────────────────────────────
  const [file, setFile] = useState<File | null>(null);
  const [contextText, setContextText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');  
  // “status” will show on screen whether we’re uploading, extracting, asking, or error.

  // ── HANDLERS ──────────────────────────────────────────────────────────────────

  // 1) When user picks a file
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files && e.target.files[0];
    setFile(picked ?? null);
    setStatus(''); // clear any previous status
    setMessages([]); 
    setContextText('');
  };

  // 2) Upload the PDF → Extract text
  const handleUploadAndExtract = async () => {
    if (!file) {
      setStatus('❗ No file selected.');
      return;
    }

    setIsUploading(true);
    setStatus('Starting upload…');
    console.log('⏳ Starting upload of file:', file.name);

    try {
      // 2a) Upload to S3
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes: UploadResponse = await uploadFileToS3(formData);
      console.log('✅ Upload succeeded, S3 key:', uploadRes.key);
      setStatus('Upload succeeded. Extracting text…');

      // 2b) Extract via backend → Textract
      const bucketName = 'ai-cfo-docs'; // must match your bucket
      const key = uploadRes.key;
      console.log(`⏳ Calling extractText(bucket=${bucketName}, key=${key})`);
      const extracted = await extractText(bucketName, key);
      console.log('✅ Extraction succeeded, text length:', extracted.length);

      // Save text into state
      setContextText(extracted);
      setStatus('Extraction complete. You can now ask questions.');

      // Show a “system” message in the chat
      setMessages([
        {
          from: 'ai',
          text: `✅ PDF uploaded & text extracted (${extracted.length} chars).`,
        },
      ]);
    } catch (err: any) {
      console.error('⚠️ Error in upload/extract:', err);
      // If the backend returned a 4xx/5xx or network error, show it
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        'Unknown upload/extract error.';
      setStatus(`❌ ${errMsg}`);
      setMessages([
        {
          from: 'ai',
          text: `❌ Upload/extraction failed: ${errMsg}`,
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  // 3) When user types a question → call /api/ask
  const handleSendQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) {
      setStatus('❗ Please type a question first.');
      return;
    }
    if (!contextText) {
      setStatus('❗ No document context. Upload a PDF first.');
      return;
    }

    setIsLoadingAnswer(true);
    setStatus('Sending question to backend…');
    console.log('➡️ Sending question:', currentQuestion);

    // Add user question to chat log immediately
    setMessages((prev) => [...prev, { from: 'user', text: currentQuestion }]);

    try {
      // 3a) Ask the backend with full context
      const answer = await askQuestion(currentQuestion, contextText);
      console.log('⬅️ Received answer:', answer);

      // 3b) Append AI’s answer to chat
      setMessages((prev) => [...prev, { from: 'ai', text: answer }]);
      setStatus('Answer received.');
    } catch (err: any) {
      console.error('⚠️ Error in /api/ask:', err);
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        'Unknown ask error.';
      setStatus(`❌ ${errMsg}`);
      setMessages((prev) => [
        ...prev,
        { from: 'ai', text: `❌ Failed to get answer: ${errMsg}` },
      ]);
    } finally {
      setIsLoadingAnswer(false);
      setCurrentQuestion('');
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem' }}>
      <h2>📄 Upload your financial PDF</h2>

      {/* File picker + Upload button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={isUploading || Boolean(contextText)}
        />
        <button
          onClick={handleUploadAndExtract}
          disabled={!file || isUploading || Boolean(contextText)}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            background: isUploading ? '#888' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: file && !isUploading && !contextText ? 'pointer' : 'not-allowed',
          }}
        >
          {isUploading ? 'Uploading…' : 'Upload & Extract'}
        </button>
      </div>

      {/* On‑screen status (uploading/extracting/answers/errors) */}
      {status && (
        <div style={{ marginBottom: '1rem', color: status.startsWith('❌') ? 'red' : 'black' }}>
          <em>{status}</em>
        </div>
      )}

      {/* Once we have contextText, show the chat UI */}
      {contextText && (
        <div style={{ marginTop: '2rem' }}>
          <h3>🤖 Ask questions about the uploaded document</h3>

          {/* Chat input form */}
          <form onSubmit={handleSendQuestion} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Type your question here…"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              style={{
                flexGrow: 1,
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: 4,
              }}
              disabled={isLoadingAnswer}
            />
            <button
              type="submit"
              disabled={!currentQuestion.trim() || isLoadingAnswer}
              style={{
                padding: '0.5rem 1rem',
                background: isLoadingAnswer ? '#888' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: currentQuestion.trim() && !isLoadingAnswer ? 'pointer' : 'not-allowed',
              }}
            >
              {isLoadingAnswer ? 'Thinking…' : 'Send'}
            </button>
          </form>

          {/* Chat log */}
          <div style={{ marginTop: '1.5rem', lineHeight: 1.5 }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '1rem',
                  textAlign: msg.from === 'user' ? 'right' : 'left',
                }}
              >
                <strong>{msg.from === 'user' ? 'You:' : 'AI:'}</strong>{' '}
                <span style={{ display: 'inline-block', maxWidth: '80%' }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
