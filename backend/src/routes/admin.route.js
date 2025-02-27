import { Router } from "express";
import { IsAdmin, protectRoute } from "../middleware/auth.middleware.js";
import { createSong,deleteSong,createAlbum,deleteAlbum,checkAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.use(protectRoute,IsAdmin)

router.get('/check', checkAdmin);

router.post("/songs",createSong);
router.delete("/songs/:id",deleteSong);

router.post("/album",createAlbum);
router.delete("/album/:id", deleteAlbum);

export default router;
