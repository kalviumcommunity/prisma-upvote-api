# Upvote API — a mini Prisma + Express project

A tiny Q&A voting service built with **TypeScript + Express + Prisma + PostgreSQL**.
The schema, seed, app wiring, and a single shared Prisma client are already done.
Your job is to build the **two route handlers** in
[`src/routes/questions.ts`](src/routes/questions.ts).

By the end you will have a real endpoint that writes atomically, handles errors
by mapping database codes to HTTP status codes, and reads a leaderboard with raw SQL.

---

## What you build

### 1. `POST /questions/:id/upvote`  — body: `{ "userId": number }`

- **Parse & validate** `questionId` from `req.params.id` and `userId` from the body.
  If either is `NaN`, respond **`400`** `{ "error": "Invalid questionId or userId" }`.
- **One transaction.** Inside a single `prisma.$transaction([...])`:
  1. **update the question first** — `score: { increment: 1 }`
  2. **then create the Upvote** — `{ userId, questionId }`
  Respond **`201`** with `{ id, score }` (the question id and its new score).
- **Error mapping** in one `catch`, guarded by
  `err instanceof Prisma.PrismaClientKnownRequestError`:
  - `P2025` → **`404`** `{ "error": "Question not found" }`
  - `P2002` → **`409`** `{ "error": "You already upvoted" }`
  - anything else → `next(err)`

> Order matters: updating the question first means a missing question throws a
> clean `P2025` on the update. If you create the upvote first, a missing question
> fails with a foreign-key error instead.

### 2. `GET /questions/results`  — leaderboard via raw SQL

Use `prisma.$queryRaw` to run:

```sql
SELECT id, title, score FROM "Question" ORDER BY score DESC, id ASC
```

Return the rows as JSON. Pass any error to `next(err)`.

---

## Project layout

```
prisma/
  schema.prisma      # Question + Upvote (Upvote has @@unique([userId, questionId]))
  seed.ts            # inserts 3 questions
src/
  prisma.ts          # the ONE shared PrismaClient (one connection pool)
  app.ts             # express app + central error handler (done)
  server.ts          # starts the server (done)
  routes/
    questions.ts     # <-- YOU WRITE THE TWO HANDLERS HERE
.env.example
```

---

## Setup

Requires **Node 18+** and a local **PostgreSQL** instance.

```bash
npm install
cp .env.example .env          # point DATABASE_URL at your local Postgres
npx prisma migrate dev --name init
npm run seed                  # inserts 3 questions
npm run dev                   # http://localhost:3000
```

---

## Try it

```bash
# first upvote            -> 201
curl -s -X POST localhost:3000/questions/1/upvote -H 'content-type: application/json' -d '{"userId":7}'
# same user again         -> 409 (already upvoted)
curl -s -X POST localhost:3000/questions/1/upvote -H 'content-type: application/json' -d '{"userId":7}'
# a different user        -> 201
curl -s -X POST localhost:3000/questions/1/upvote -H 'content-type: application/json' -d '{"userId":8}'
# missing question        -> 404
curl -s -X POST localhost:3000/questions/999/upvote -H 'content-type: application/json' -d '{"userId":7}'
# leaderboard             -> ordered by score
curl -s localhost:3000/questions/results
```

Expected output:

```text
{"id":1,"score":1}
{"error":"You already upvoted"}
{"id":1,"score":2}
{"error":"Question not found"}
[{"id":1,"title":"How does connection pooling work?","score":2},{"id":2,"title":"When should I use a transaction?","score":0},{"id":3,"title":"Raw SQL vs the query builder?","score":0}]
```

---

## Done when

- [ ] `POST /questions/:id/upvote` validates ids (`400` on bad input).
- [ ] Both writes run inside one `$transaction` (question update first).
- [ ] Duplicate upvote → `409`, missing question → `404`, mapped in one `catch`.
- [ ] `GET /questions/results` uses `$queryRaw`, sorted by score.
- [ ] The `curl` run above shows `201 → 409 → 201 → 404` and a score-sorted leaderboard.
