// Definimos el controlador usando export const

import { openai } from "../lib/openAi.config";
export const ChatController = {
    
  /**
   * Handles sending a message to the chat endpoint
   * @param {import('express').Request} req 
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  sendMessage: async (req: import('express').Request, res: import('express').Response): Promise<void> => {
    const { message } = req.body;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "You are a smart assistant" },
          {
            role: "user",
            content: message,
          },
        ],
      });
      res.status(200).json({ message: completion.choices[0].message });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },
};
