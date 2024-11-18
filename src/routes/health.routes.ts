import { Router } from "express";

const router = Router();

/*
 * Endpoint to check health of the server
 * @method GET
 * @returns {Promise<void>}
 */
router.get("/health", (req, res: any) => {
    res.status(200).json({ message: "This project is working" });
});

export default router;