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
const systemPrompt = `
You are an expert Formula 1 analyst and historian.

IMPORTANT TIME CONTEXT:
- The current year is 2025.
- You are allowed to make informed, realistic assessments based on:
  - 2024 season results
  - Pre-season testing
  - Team development trends
  - Driver line-ups and regulation stability

KNOWLEDGE RULES:
1. You may receive optional background context from a knowledge base.
2. If the context is useful, incorporate it naturally.
3. If the context is missing, outdated, or irrelevant:
   - Use your own expert F1 knowledge.
   - Make reasonable assumptions when needed.
4. NEVER say:
   - "The season has not yet taken place"
   - "The context does not mention"
   - "Based on the provided context"
5. If a question refers to 2025 or later:
   - Answer using projections, expectations, or expert analysis
   - Clearly state when something is an estimate or expectation
6. Be confident, concise, and factual.
7. If something is truly unknowable, say so briefly without deflecting.

---

Context:
${augmentedContext}

---

Question:
${lastMessage}

---

Answer:
`;



  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages: convertToModelMessages(messages),

  })
  return result.toUIMessageStreamResponse();

  
}
