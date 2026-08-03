import express from "express";
import { getComplexes, getComplexById } from "../controllers/complexesController.js";

const router = express.Router();

router.get("/", getComplexes);
router.get("/:id", getComplexById);

export default router;
