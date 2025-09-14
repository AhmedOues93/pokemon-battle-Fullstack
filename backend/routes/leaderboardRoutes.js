import { Router } from "express";
import {
  getLeaderboard,
  addScore,
} from "../controllers/leaderboardController.js";

const router = Router();
router.get("/", getLeaderboard); // GET /api/leaderboard
router.post("/", addScore); // POST /api/leaderboard

export default router;
