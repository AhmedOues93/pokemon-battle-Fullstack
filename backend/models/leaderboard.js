import { Schema, model } from "mongoose";

const leaderboardSchema = new Schema(
  {
    userName: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Leaderboard = model("Leaderboard", leaderboardSchema);
export default Leaderboard;
