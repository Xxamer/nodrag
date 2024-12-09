import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { hf } from "./hugginFace.config";
import { full, pipeline } from "@huggingface/transformers";
import { Embeddings } from "@langchain/core/embeddings";
import { AsyncCaller } from "@langchain/core/dist/utils/async_caller";

const embeddingPipeline = pipeline(
  "feature-extraction",
  "sentence-transformers/all-MiniLM-L6-v2"
);

class HuggingFaceEmbeddings implements Embeddings {
  caller: AsyncCaller;
  async embedDocuments(documents: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const doc of documents) {
      const result = await (await embeddingPipeline)(doc);
      embeddings.push(result[0]);
    }
    return embeddings;
  }
  async embedQuery(query: string): Promise<number[]> {
    const result = await (await embeddingPipeline)(query);
    return result[0];
  }
}
export const loadAndSplitDocs = async (file_path: string) => {
  const loader = new PDFLoader(file_path);
  const docs = await loader.load();
  const splittedText = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });
  const allSplits = await splittedText.splitDocuments(docs);
  return allSplits;
};

export const vectorSaveAndSearch = async (
  splits: Array<any>,
  question: string
) => {
  const embeddings = new HuggingFaceEmbeddings();
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  const searches = await vectorStore.similaritySearch(question);
  return searches;
};

export const generatePrompt = async (
  searches: Array<any>,
  question: string
) => {
  const context = searches.map((search) => search.pageContent).join("\n\n");
  const prompt = `Pregunta, respondeme solo con contenido en español: ${question}\n\nContexto:\n${context}\n\nRespuesta:`;
  return prompt;
};

const splitContext = (text: string, chunkSize = 1000) => {
  const chunks = [];
  while (text.length > 0) {
    chunks.push(text.slice(0, chunkSize));
    text = text.slice(chunkSize);
  }
  return chunks;
};

export const generateOutputPrompt = async (formattedPrompt: string) => {
  const contextChunks = splitContext(formattedPrompt, 1000);
  let fullText = ""
  for (const chunk of contextChunks) {
    const partialResponse = await hf.chatCompletion({
      model: "google/gemma-2-9b-it",
      messages: [{ role: "user", content: `Resumen parcial:\n\n${chunk}` }],
      max_tokens: 1000,
    });
    fullText += partialResponse.choices[0].message.content;
    // return partialResponse.choices[0].message.content;
  }
  console.log(fullText);
  return fullText;
};
