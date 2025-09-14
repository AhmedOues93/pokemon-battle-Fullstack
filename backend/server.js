import express from "express";
import cors from "cors";
import connectDB from "./db/index.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/leaderboard", leaderboardRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Pokemon-Leaderboard API listening on port ${port}`);
  });
});
