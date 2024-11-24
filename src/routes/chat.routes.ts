import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
const router = Router();
router.post("/chat/gpt4/send-message", ChatController.sendMessage);
router.post("/chat/hugging/send-message", ChatController.sendHuggingMessage);

export default router;
