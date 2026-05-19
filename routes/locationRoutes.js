import express from "express";
import { getCountries, getStates, getCities } from "../controllers/locationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/countries", protect, getCountries);
router.get("/states", protect, getStates);
router.get("/cities", protect, getCities);

export default router;
