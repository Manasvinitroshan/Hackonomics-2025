// backend/services/embed.ts
import OpenAI from "openai";
import express from 'express';              // runtime import
import type { Request, Response } from 'express';  // types only

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * Embed a piece of text into a vector using OpenAI.
 */
export async function embedText(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return res.data[0].embedding;
}
