import { hf } from "../lib/hugginFace.config";
import { saveBlobToFile } from "../lib/saveblob";
import { 
  generateOutputPrompt, 
  generatePrompt,
  loadAndSplitDocs,
  vectorSaveAndSearch
 } from "../lib/docsRag";

export const RagController = {
  uploadfile: async (req: any, res: any) =>  {
    const question = req.body.question;
    const splits = await loadAndSplitDocs("/Users/christian/workspace/nodeRag/assets/viktor.pdf");
  const searches = await vectorSaveAndSearch(splits, question);
  const prompt = await generatePrompt(searches, question);
  const result = await generateOutputPrompt(prompt);
  return res.status(200).json({
    message: "Content has been generated successfully.",
    data: {
      content: result,
    },
  });
  }
};