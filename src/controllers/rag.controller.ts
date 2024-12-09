import {
  generateOutputPrompt,
  generatePrompt,
  loadAndSplitDocs,
  vectorSaveAndSearch,
} from "../lib/docsRag";

export const RagController = {
  uploadfile: async (req: any, res: any) => {
    const question = req.body.question;
    const splits = await loadAndSplitDocs(req.file.path);
    const searches = await vectorSaveAndSearch(splits, question);
    const prompt = await generatePrompt(searches, question);
    const result = await generateOutputPrompt(prompt);
    return res.status(200).json(result);
  },
};
