// routes/ask.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import OpenAI from "openai";

import { querySimilar } from "../services/vector.ts";
import { askLLM       } from "../services/llm.ts";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question } = req.body;

      // 1) Embed the question
      const emb = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
      });
      const values = emb.data[0].embedding;

      // 2) Retrieve top-5 chunks (each hit has .id, .score and .text)
      const hits = await querySimilar(values, 5);

      // 3) Build prompt from actual text
      const context = hits
        .map(
          (h, i) => `---\n(${i + 1}) score=${h.score.toFixed(3)}\n${h.text}`
        )
        .join("\n");

      // 4) Call your LLM with real context
      const answer = await askLLM(question, context);

      return res.json({ answer });
    } catch (err: any) {
      console.error("/ask error:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
);

export default router;
