import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";

export const questions = Router();

// ---------------------------------------------------------------------------
// TODO 1 — POST /questions/:id/upvote   body: { userId: number }
//
//   1. Parse questionId from req.params.id and userId from req.body.
//      If either is NaN -> return 400 { error: "Invalid questionId or userId" }.
//   2. In ONE prisma.$transaction([...]):
//        a) update the question:  score: { increment: 1 }   (do this FIRST)
//        b) create the Upvote:    { userId, questionId }
//   3. On success -> 201 { id, score } (the question's id and new score).
//   4. In one catch, guard with `err instanceof Prisma.PrismaClientKnownRequestError`:
//        - err.code === "P2025" -> 404 { error: "Question not found" }
//        - err.code === "P2002" -> 409 { error: "You already upvoted" }
//        - otherwise -> next(err)
// ---------------------------------------------------------------------------
questions.post("/:id/upvote", async (req, res, next) => {
  // your code here
});

// ---------------------------------------------------------------------------
// TODO 2 — GET /questions/results   -> leaderboard via raw SQL
//
//   Use prisma.$queryRaw to run:
//     SELECT id, title, score FROM "Question" ORDER BY score DESC, id ASC
//   Return the rows as JSON. Pass any error to next(err).
// ---------------------------------------------------------------------------
questions.get("/results", async (_req, res, next) => {
  // your code here
});
