import { Router } from "express";
import { getLeaderboard, addScore } from "../controllers/leaderboardController";

const router = Router();

router.get("/", getLeaderboard);
router.post("/", addScore);

export default router;
