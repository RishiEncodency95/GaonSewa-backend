import express from "express";
import { getHero, createOrUpdateHero, deleteHero, getHeroById, updateHero } from "../../controllers/website/heroController.js";
import upload from "../../middleware/multer.js";

const router = express.Router();

router.get("/", getHero);
router.get("/:id", getHeroById);
router.post("/", upload.single("image"), createOrUpdateHero);
router.delete("/:id", deleteHero);
router.put("/:id", upload.single("image"), updateHero);
export default router;
