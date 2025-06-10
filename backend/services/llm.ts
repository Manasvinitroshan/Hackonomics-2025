// backend/services/llm.ts
import OpenAI from "openai";
import express from 'express';              // runtime import
import type { Request, Response } from 'express';  // types only

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function askLLM(question: string, context: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: `You're an AI CFO assistant analyze the document.  Context:\n${context}` },
      { role: "user", content: question },
    ],
  });
  return response.choices[0].message.content || "";
}
