import { Router } from "express";
import { protectRoute, IsAdmin } from "../middleware/auth.middleware.js";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeFouYouSongs,
  getTrendingSongs,
} from "../controllers/song.controller.js";

const router = Router();

router.get("/", protectRoute, IsAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeFouYouSongs);
router.get("/trending", getTrendingSongs);
export default router;
