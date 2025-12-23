import "dotenv/config";
import {
  Browser,
  Page,
  PuppeteerWebBaseLoader,
} from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
const { PINECONE_INDEX_NAME, PINECONE_DB_API_KEY, PINECONE_NAMESPACE} = process.env;

if (!PINECONE_INDEX_NAME || !PINECONE_DB_API_KEY || !PINECONE_NAMESPACE) {
  throw Error("Environment Variables are not loaded");
}

const BATCH_SIZE = 80;
const SLEEP_MS = 15_000;

const f1Data = [
  // "https://en.wikipedia.org/wiki/Formula_One",
  // "https://www.formula1.com/en/drivers",
  // "https://www.formula1.com/en/latest",
  // "https://www.formula1.com/en/teams",
  "https://www.formula1.com/en/results/2025/races",
  "https://inmotion.dhl/en/formula-1/fastest-lap-award",
  "https://www.formula1.com/en/results/2025/drivers",
  "https://www.formula1.com/en/results/2025/team",
  "https://www.formula1.com/en/latest/article/formula-1-reveals-calendar-for-2026-season.YctbMZWqBvrgyddrnauo8",
  "https://www.formula1.com/en/drivers",

];

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 100,
});


const pc = new Pinecone({
  apiKey: PINECONE_DB_API_KEY,
});

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

function chunkArray<T>(arr:T[]): T[][] {
  const chunks: T[][] = [];
  for(let i = 0; i < arr.length; i +=BATCH_SIZE){
    chunks.push(arr.slice(i, i+BATCH_SIZE));
  }
  return chunks;
}

const seedDB = async () => {
  const namespace = pc.index(PINECONE_INDEX_NAME).namespace(PINECONE_NAMESPACE)
  for await (const url of f1Data) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    
    const records = chunks.map((chunk) => ({
      _id : crypto.randomUUID(),
      text: chunk
    }))
    // console.log(records);
    const batches = chunkArray(records);
    for(const batch of batches){
      await namespace.upsertRecords(batch);
    }
     console.log(
      `Upserted ${records.length} chunks from ${url} in ${batches.length} batches`
    );
    await sleep(SLEEP_MS)
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page: Page, browser: Browser): Promise<string> => {
      const result = (await page.evaluate(
        () => document.body.innerHTML
      )) as string;
      await browser.close();
      return result;
    },
  });
  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

seedDB();
