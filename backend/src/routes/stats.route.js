import { Router } from "express";
import { IsAdmin, protectRoute } from "../middleware/auth.middleware.js";
import { getStats } from "../controllers/stats.controller.js";

const router = Router();

router.get("/", protectRoute,IsAdmin,getStats);

export default router;
