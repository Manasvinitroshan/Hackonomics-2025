import express from "express";
import OpenAI from "openai";
import { querySimilar } from "../services/vector.ts";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

router.post("/", async (req, res) => {
  const question = (req.body.question as string || "").trim();
  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }
  try {
    const embRes = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: question,
    });
    const sims = await querySimilar(embRes.data[0].embedding, 5);
    const context = sims.map((d,i) => `Context ${i+1}:\n${d.text}`).join("\n\n");

    const systemPrompt = `
You are AI CFO, a professional financial assistant.
Answer using ONLY the provided contexts.
Do NOT hallucinate.
`.trim();

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: context },
        { role: "user",   content: question },
      ],
    });

    return res.json({ answer: chat.choices[0].message.content });
  } catch (err: any) {
    console.error("Ask error:", err);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
});

export default router;
