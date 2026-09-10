import express from "express";
import { getMySubscription } from "../controllers/subscriptionsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", authenticateToken, getMySubscription);

export default router;
