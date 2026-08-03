import express from "express";
import { getListings, getListingById, createListing } from "../controllers/listingsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/", authenticateToken, createListing);

export default router;
