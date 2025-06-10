// services/vector.ts
import { Pinecone } from "@pinecone-database/pinecone";

const API_KEY    = process.env.PINECONE_API_KEY!;
const INDEX_NAME = process.env.PINECONE_INDEX!;

const client = new Pinecone({ apiKey: API_KEY });

/** Make sure this is exported so ask.ts can import it without error */
export interface QueryResult {
  id:     string;
  score:  number;
  text:   string;
}

export async function upsertDocument(
  id: string,
  values: number[],
  text: string
): Promise<void> {
  const index = client.index(INDEX_NAME);
  await index.upsert([
    {
      id,
      values,
      metadata: { text },
    },
  ]);
}

export async function querySimilar(
  values: number[],
  topK = 10
): Promise<QueryResult[]> {
  const index = client.index(INDEX_NAME);
  const response = await index.query({
    vector:           values,
    topK,
    includeValues:    false,
    includeMetadata:  true,
  });

  return (response.matches ?? []).map((m) => ({
    id:    m.id!,
    score: m.score!,
    text:  String((m.metadata as any)?.text ?? ""),
  }));
}
