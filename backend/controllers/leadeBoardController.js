import { Leaderboard } from "../models/leaderboard";

export const getLeaderboard = async (_req, res) => {
  try {
    const scores = await Leaderboard.find().limit10;
    res.status(201).json(scores);
  } catch (error) {
    res.status(500).json("Server Error !");
  }
};

export const addScore = async (_req, res) => {
  try {
    const { userName, score } = req.body;
    if (!userName || score === undefined) {
      return;
      res.status(400).json({ message: "Bad Request try again" });
    }
    const newScore = new Leaderboard({ userName, score });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json("Server Error !");
  }
};
