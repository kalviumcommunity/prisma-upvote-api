import express, { ErrorRequestHandler } from "express";
import { questions } from "./routes/questions.js";

export const app = express();

app.use(express.json());
app.use("/questions", questions);

// central error handler: anything passed to next(err) lands here as a 500
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);
