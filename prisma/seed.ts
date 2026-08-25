import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // clean slate so re-seeding is idempotent
  await prisma.upvote.deleteMany();
  await prisma.question.deleteMany();

  await prisma.question.createMany({
    data: [
      { id: 1, title: "How does connection pooling work?" },
      { id: 2, title: "When should I use a transaction?" },
      { id: 3, title: "Raw SQL vs the query builder?" },
    ],
  });

  console.log("Seeded 3 questions.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
