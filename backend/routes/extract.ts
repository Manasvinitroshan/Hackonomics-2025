// routes/extract.ts
import express from "express";
import type { Request, Response } from "express";
import OpenAI from "openai";
import AWS from "aws-sdk";

import { extractTextFromS3 } from "../services/textract.ts";
import { upsertDocument }    from "../services/vector.ts";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Initialize S3 client for saving extracted text
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

router.post("/", async (req: Request, res: Response) => {
  const { bucket, key } = req.body;
  if (!bucket || !key) {
    return res.status(400).json({ error: "Missing bucket or key" });
  }

  try {
    // 1) Extract raw text from the PDF in S3
    const text = await extractTextFromS3(bucket, key);

    // 2) Save the extracted text back to S3 as a .txt file
    const txtKey = key.replace(/\.pdf$/i, ".txt");
    await s3.putObject({
      Bucket: bucket,
      Key:    txtKey,
      Body:   text,
      ContentType: "text/plain",
    }).promise();

    // 3) Create embeddings for the text
    const emb = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    const values = emb.data[0].embedding;

    // 4) Upsert the vector and metadata
    await upsertDocument(key, values, text);

    // 5) Send the extracted text back to the client
    res.json({ text });
  } catch (err: any) {
    console.error("extract error:", err);
    res.status(500).json({ error: err.message || "Extract failed" });
  }
});

export default router;
