// routes/extract.ts
import express from "express";
import type { Request, Response } from "express";
import OpenAI from "openai";

import { extractTextFromS3 } from "../services/textract.ts";
import { upsertDocument    } from "../services/vector.ts";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

router.post("/", async (req: Request, res: Response) => {
  const { bucket, key } = req.body;
  try {
    // 1) Extract raw text
    const text = await extractTextFromS3(bucket, key);

    // 2) Embed it
    const emb = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    const values = emb.data[0].embedding;

    // 3) Upsert vector + full text as metadata
    await upsertDocument(key, values, text);

    // 4) Return raw text for front-end state
    res.json({ text });
  } catch (err: any) {
    console.error("extract error:", err);
    res.status(500).json({ error: err.message || "Extract failed" });
  }
});

export default router;
