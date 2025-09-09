import { Schema, model } from "mongoose";

const leaderboardSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Leaderboard = model("leaderboard", leaderboardSchema);

export default Leaderboard;
