import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

const {
  GOOGLE_GENERATIVE_AI_API_KEY,
  PINECONE_INDEX_NAME,
  PINECONE_DB_API_KEY,
  PINECONE_NAMESPACE,
} = process.env;

if (
  !PINECONE_INDEX_NAME ||
  !GOOGLE_GENERATIVE_AI_API_KEY ||
  !PINECONE_DB_API_KEY ||
  !PINECONE_NAMESPACE
) {
  throw Error("Environment Variables are not loaded");
}

// const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const pc = new Pinecone({ apiKey: PINECONE_DB_API_KEY });
const namespace = pc.index(PINECONE_INDEX_NAME).namespace(PINECONE_NAMESPACE);

let augmentedContext = "";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { id, messages } = body;
  // console.log(messages[0].parts);
  const lastMessage = messages[0].parts[0].text;
  // console.log(lastMessage);

  try {
    const response = await namespace.searchRecords({
      query: {
        topK: 5,
        inputs: { text: lastMessage },
      },
      fields: ["text"],
    });

    // console.log("response", response.result.hits);

    const respHits = response.result.hits;
    const respMap = respHits
      .map((hit) => (hit.fields as { text: string }).text)
      .join("\n\n---\n\n");
    // console.log(respMap);
    const conext = JSON.stringify(respMap);
    augmentedContext = conext;
  } catch (err) {
    augmentedContext = "";
  }
  const systemPromt = `You are an expert assistant specialized in Formula 1.

You may be provided with some context retrieved from a knowledge base.
This context may be incomplete, partially relevant, or sometimes empty.

### Instructions:
1. If the provided context contains information that is relevant to the question:
   - Use it as the primary source for your answer.
   - You may rephrase, summarize, or combine information across multiple context snippets.
2. If the context does NOT contain sufficient information:
   - Answer the question using your own general knowledge.
3. Do NOT mention whether the answer came from the context or your own knowledge.
4. Do NOT say things like "based on the context" or "according to the documents".
5. If the question is ambiguous, make reasonable assumptions and answer clearly.
6. Keep the answer concise, factual, and easy to understand.

---

### Context:
${augmentedContext}

---

### Question:
${lastMessage}

---

### Answer:
`;
  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPromt,
    messages: convertToModelMessages(messages),

  })
  return result.toUIMessageStreamResponse();

  
}
