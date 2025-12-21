import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
const {
  ASTRA_DB_KEYSPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
} = process.env;

if (
  !ASTRA_DB_KEYSPACE ||
  !ASTRA_DB_COLLECTION ||
  !ASTRA_DB_API_ENDPOINT ||
  !ASTRA_DB_APPLICATION_TOKEN ||
  !GEMINI_API_KEY
) {
  throw Error("Environment Variables are not loaded");
}

import { NextRequest, NextResponse } from "next/server";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const embeddings = {
  embedQuery: async (query: string) => {
    const embedding = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: query,
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: 768,
      },
    });
    return embedding.embeddings![0].values! as number[];
  },
  embedDocuments: async (documents: string[]) => {
    const embeddings = await Promise.all(
      documents.map(async (doc) => {
        const embedding = await ai.models.embedContent({
          model: "gemini-embedding-001",
          contents: doc,
          config: {
            taskType: "RETRIEVAL_DOCUMENT",
            outputDimensionality: 768,
          },
        });
        return embedding.embeddings![0].values! as number[];
      })
    );
    return embeddings;
  },
};
// const vectorStore = await AstraDBVectorStore.fromExistingIndex(
//   embeddings,
//   {
//     collection: ASTRA_DB_COLLECTION,
//     token: ASTRA_DB_APPLICATION_TOKEN,
//     endpoint: ASTRA_DB_API_ENDPOINT,
//     keyspace: ASTRA_DB_KEYSPACE,
//   }
// );

let vectorStore: AstraDBVectorStore | null = null;

async function getVectorStore() {
  if (!vectorStore) {
    vectorStore = await AstraDBVectorStore.fromExistingIndex(
      embeddings,
      {
        collection: ASTRA_DB_COLLECTION,
        token: ASTRA_DB_APPLICATION_TOKEN,
        endpoint: ASTRA_DB_API_ENDPOINT,
        keyspace: ASTRA_DB_KEYSPACE
      }
    );
  }
  return vectorStore;
}


export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { id, messages } = body;
  // console.log(messages[0].parts);
  const lastMessage = messages[0].parts[0].text;
  // console.log(lastMessage);
  const store = await getVectorStore();
  const docs = await store.similaritySearch(lastMessage, 3);


  console.log(docs)



  // const res = await ai.models.generateContent({
  //     model: "gemini-2.5-flash",
  //     contents: lastMessage,
  //     config: {
  //         taskType: "RETRIEVAL_DOCUMENT",
  //         outputDimensionality: 1536,
  //     }
  // })

  return NextResponse.json({ message: "hello from the server" });
}
