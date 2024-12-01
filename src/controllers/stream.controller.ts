import { hf } from "../lib/hugginFace.config";
export const StreamController = {
  openChat: async (req: any, res: any) => {
    try {
        res.setHeader("Content-Type", "text/plain");
        for await (const chunk of hf.chatCompletionStream({
          model: "google/gemma-2-9b-it",
          messages: [{ role: "user", content: "Si lees esto me debes un bsito" }],
          max_tokens: 512,
        })) {
          const content = chunk.choices[0].delta.content || "";
          console.log(content); 
          res.write(content); 
        }
    
        // Finaliza la respuesta
        res.end();
      } catch (error) {
        console.error("Error:", error);
    
        // Asegurarse de no enviar cabeceras si ya se enviaron datos
        if (!res.headersSent) {
          res.status(500).send("Ocurrió un error.");
        }
      } 
    return res.status(200).json({ message: "ok" });
  },
};
