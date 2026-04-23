import express from "express";
import { getHero, createOrUpdateHero, deleteHero } from "../../controllers/website/heroController.js";
import upload from "../../middleware/multer.js";

const router = express.Router();

router.get("/", getHero);
router.post("/", upload.single("image"), createOrUpdateHero);
router.delete("/:id", deleteHero);

export default router;
