import { Router } from "express";
import { RagController } from "../controllers/rag.controller";
import { uploadFile } from "../lib/uploadFile";

const router = Router();

router.post("/rag/upload", uploadFile.single("file") , RagController.uploadfile );

export default router;