import "dotenv/config";
import { Browser, Page, PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenAI } from "@google/genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const {ASTRA_DB_KEYSPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APP_TOKEN, GEMINI_API_KEY} = process.env;

if(!ASTRA_DB_KEYSPACE || !ASTRA_DB_COLLECTION || !ASTRA_DB_API_ENDPOINT ||  !ASTRA_DB_APP_TOKEN || !GEMINI_API_KEY)throw Error('Environment Variables are not loaded')

const f1Data= [
    'https://en.wikipedia.org/wiki/Formula_One',
    'https://www.formula1.com/en/drivers',
    'https://www.formula1.com/en/latest',
    'https://www.formula1.com/en/teams',
    'https://x.com/F1',
    'https://aws.amazon.com/sports/f1/',
    'https://www.f1lasvegasgp.com',
    'https://www.mclaren.com/racing/formula-1/',
    'https://www.redbullracing.com/int-en',
    'https://www.skysports.com/f1',
]

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 512, chunkOverlap: 100 });

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
const client = new DataAPIClient();
const database = client.db(ASTRA_DB_API_ENDPOINT, {token: ASTRA_DB_APP_TOKEN});
console.log(`Connected to database ${database}`);
console.log(database);

const createCollection = async () => {
    const collection = await database.createCollection(ASTRA_DB_COLLECTION, {
        keyspace: ASTRA_DB_KEYSPACE,
        vector: {
            dimension: 1536,
            metric: 'euclidean'
      },
    })
    console.log(collection)
}


const loadSampleData = async() => {
    const collection = await database.collection(ASTRA_DB_COLLECTION);
    for await (const url of f1Data){
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);
        for await (const chunk of chunks){
            const embedding = await ai.models.embedContent({
                model: 'gemini-embedding-001',
                contents: chunk,
               config: {
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: 768,
    },
            })
            console.log("embeddings", embedding.embeddings);

            const vector = embedding.embeddings;
            try{
              const res = await collection.insertOne({
                  vector: vector,
                  text: chunk
              })
              console.log("res", res);

            }catch(e){
              console.log("error with insertion");
            }
        }
    }
}

const scrapePage = async(url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: true
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
      evaluate: async (page: Page, browser: Browser): Promise<string> => {
        const result = await page.evaluate(() => document.body.innerHTML) as string;
        await browser.close();
        return result;
      }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}


createCollection().then(() => loadSampleData());