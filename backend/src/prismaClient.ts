import { PrismaClient } from "@prisma/client";

// Single shared PrismaClient instance used across the app.
export const prisma = new PrismaClient();
