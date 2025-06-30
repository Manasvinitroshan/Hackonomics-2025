// backend/services/kb.ts
import AWS from 'aws-sdk';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const RETELL_API = 'https://api.retellai.com/v2';
const apiKey     = process.env.RETELL_API_KEY!;
const llmId      = process.env.RETELL_LLM_ID!; // your agent’s LLM ID

export async function ingestPdfIntoKb(bucket: string, key: string) {
  // 1) Fetch the PDF from S3 as a Buffer
  const resp = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  const pdfBuffer = resp.Body as Buffer;

  // 2) Upload to Retell as a new KB
  const form = new FormData();
  form.append('knowledge_base_name', key);
  form.append('knowledge_base_files', pdfBuffer, { filename: key });

  const createResp = await axios.post(
    `${RETELL_API}/create-knowledge-base`,
    form,
    { headers: { Authorization: `Bearer ${apiKey}`, ...form.getHeaders() } }
  );
  const kbId = createResp.data.knowledge_base_id as string;

  // 3) Poll until Retell has finished indexing it
  while (true) {
    const statusResp = await axios.get(
      `${RETELL_API}/get-knowledge-base/${kbId}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    if (statusResp.data.status === 'ready') break;
    console.log(`Waiting for KB ${kbId} to be ready (status: ${statusResp.data.status})…`);
    await new Promise(r => setTimeout(r, 5000));
  }

  // 4) Attach the KB to your agent’s LLM
  await axios.patch(
    `${RETELL_API}/update-retell-llm/${llmId}`,
    { knowledge_base_ids: [kbId] },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  return kbId;
}
