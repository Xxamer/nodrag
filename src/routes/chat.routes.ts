import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
const router = Router();
router.post("/chat/send-message", ChatController.sendMessage);

export default router;
