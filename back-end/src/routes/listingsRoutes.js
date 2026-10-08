import express from "express";
import {
  getListings,
  getListingById,
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
  promoteListingWithTariff,
  renewListing,
} from "../controllers/listingsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getListings);
router.get("/my", authenticateToken, getMyListings);
router.get("/:id", getListingById);
router.post("/", authenticateToken, createListing);
router.put("/:id", authenticateToken, updateListing);
router.delete("/:id", authenticateToken, deleteListing);
router.post("/:id/promote-with-tariff", authenticateToken, promoteListingWithTariff);
router.post("/:id/renew", authenticateToken, renewListing);

export default router;
