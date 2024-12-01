import { Router } from "express";
import { StreamController } from "../controllers/stream.controller";
const router = Router();

router.post("/stream/send-message", StreamController.openChat);

export default router;