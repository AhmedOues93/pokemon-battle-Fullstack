import Leaderboard from "../models/leaderboard.js";

export const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 10);
    const scores = await Leaderboard.find()
      .sort({ score: -1, date: 1 })
      .limit(limit)
      .lean();
    res.status(200).json(scores);
  } catch (error) {
    next(error);
  }
};

export const addScore = async (req, res, next) => {
  try {
    const { userName, score } = req.body;

    if (typeof userName !== "string" || userName.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "userName is required (min 2 chars)." });
    }
    if (typeof score !== "number" || Number.isNaN(score) || score < 0) {
      return res
        .status(400)
        .json({ message: "score must be a non-negative number." });
    }

    const created = await Leaderboard.create({
      userName: userName.trim(),
      score,
    });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};
