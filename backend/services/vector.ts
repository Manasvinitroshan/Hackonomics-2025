import { Pinecone } from "@pinecone-database/pinecone";

const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const INDEX_NAME = process.env.PINECONE_INDEX!;

export interface QueryResult {
  id:    string;
  score: number;
  text:  string;
}

export async function upsertDocument(
  id: string,
  values: number[],
  text: string
): Promise<void> {
  const index = client.index(INDEX_NAME);
  await index.upsert([{ id, values, metadata: { text } }]);
}

export async function querySimilar(
  values: number[],
  topK = 5
): Promise<QueryResult[]> {
  const index = client.index(INDEX_NAME);
  const response = await index.query({
    vector:          values,
    topK,
    includeValues:   false,
    includeMetadata: true,
  });
  return (response.matches ?? []).map(m => ({
    id:    m.id!,
    score: m.score!,
    text:  String((m.metadata as any).text || ""),
  }));
}
