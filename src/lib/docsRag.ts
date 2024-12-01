import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { hf } from "./hugginFace.config";
import { pipeline } from '@huggingface/transformers';
import { Embeddings } from '@langchain/core/embeddings';
import { AsyncCaller } from "@langchain/core/dist/utils/async_caller";

const embeddingPipeline =  pipeline('feature-extraction', 'sentence-transformers/all-MiniLM-L6-v2');


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

export const vectorSaveAndSearch = async (splits, question) => {
    const embeddings = new HuggingFaceEmbeddings();
    const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
    const searches = await vectorStore.similaritySearch(question);
    return searches;
  };


export const generatePrompt = async(searches, question) => {
    let context = "";
    searches.forEach((search) => {
        context = context +"\n\n" + search.pageContent;
    });
    const prompt = PromptTemplate.fromTemplate(
        `Responde a las preguntas basado solo en el siguiente contexto: {context}
         ---
        Responde a las preguntas basadas en el siguiente contexto: {question}`
    );
    const formattedPrompt = await prompt.format({
        context: context,
        question: question,
    });
    return formattedPrompt;
}

export const generateOutputPrompt = async (formattedPrompt) => {
     const out = await hf.textGeneration({
        model: "Qwen/QwQ-32B-Preview",
        inputs: `Pregunta: ${formattedPrompt}\nRespuesta:`, 
        max_length: 100000,
        temperature: 0.7, 
    });
    return out.generated_text.replace(formattedPrompt, '').trim();  
};