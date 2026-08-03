import express from "express";
import { aiSearch, aiGenerateDescription } from "../controllers/aiController.js";

const router = express.Router();

router.post("/search", aiSearch);
router.post("/generate-description", aiGenerateDescription);

export default router;
