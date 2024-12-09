import { hf } from "../lib/hugginFace.config";
export const StreamController = {
  openChat: async (req: any, res: any) => {
    // Not working yet
    try {
        res.setHeader("Content-Type", "text/plain");
        for await (const chunk of hf.chatCompletionStream({
          model: "google/gemma-2-9b-it",
          messages: [{ role: "user", content: "Chat completion" }],
          max_tokens: 512,
        })) {
          const content = chunk.choices[0].delta.content || "";
          console.log(content); 
          res.write(content); 
        }
        res.end();
      } catch (error) {
        console.error("Error:", error);
        if (!res.headersSent) {
          res.status(500).send("Ocurrió un error.");
        }
      } 
    return res.status(200).json({ message: "ok" });
  },
};
