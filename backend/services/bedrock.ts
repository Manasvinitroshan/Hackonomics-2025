// Placeholder, adapt to whichever wrapper you use
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import express from 'express';              // runtime import
import type { Request, Response } from 'express';  // types only
import dotenv from 'dotenv';
dotenv.config();

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function callBedrock(prompt: string): Promise<string> {
  const input = {
    body: JSON.stringify({ prompt }),
    modelId: 'amazon.titan-tg1-large',
    contentType: 'application/json',
    accept: 'application/json'
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  return response.body?.toString() || '';
}
