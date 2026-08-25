import { PrismaClient } from "@prisma/client";

// ONE shared PrismaClient for the whole app = ONE connection pool.
// Import this everywhere; never call `new PrismaClient()` per request.
export const prisma = new PrismaClient();
