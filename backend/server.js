// import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import errorHandler from "./middelwares/errorHandler.js";
import notFound from "./middelwares/notFound.js";
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use("/{*splat}", (req, _res) => {
  throw new Error(`URL unavailable; you used ${req.originalUrl}`, {
    cause: 404,
  });
});

app.use(errorHandler);
app.use(notFound);

connectDB();

const server = app.listen(port, () => {
  console.log(` Pokemon-Leaderboard API listening on port ${port} `);
});
