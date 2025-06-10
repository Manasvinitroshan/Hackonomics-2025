// backend/services/textract.ts
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';              // runtime import
import type { Request, Response } from 'express';  // types only

// initialize the v2 AWS SDK Textract client (you could also use v3)
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const textract = new AWS.Textract();

/**
 * Extracts all text from a PDF in S3 via the async Textract API.
 */
export async function extractTextFromS3(bucket: string, key: string): Promise<string> {
  // 1) Start the text-detection job
  const start = await textract
    .startDocumentTextDetection({
      DocumentLocation: { S3Object: { Bucket: bucket, Name: key } },
    })
    .promise();

  const jobId = start.JobId;
  if (!jobId) throw new Error('Textract didn’t return a JobId');

  // 2) Poll until the job completes
  let finished = false;
  let pages: AWS.Textract.BlockList = [];
  while (!finished) {
    await new Promise((r) => setTimeout(r, 2000));  // wait 2s

    const resp = await textract
      .getDocumentTextDetection({ JobId: jobId })
      .promise();

    const status = resp.JobStatus;
    if (status === 'SUCCEEDED') {
      finished = true;
      if (resp.Blocks) pages = resp.Blocks;
    } else if (status === 'FAILED') {
      throw new Error('Textract job failed');
    }
    // otherwise keep polling until SUCCEEDED
  }

  // 3) Pull out every LINE block’s text and concatenate
  const lines = pages
    .filter((b) => b.BlockType === 'LINE' && b.Text)
    .map((b) => b.Text!.trim());

  return lines.join('\n');
}
