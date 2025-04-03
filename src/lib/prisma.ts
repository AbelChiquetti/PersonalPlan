import { PrismaClient } from "@prisma/client";

// Declare PrismaClient no escopo global
declare global {
  let prisma: PrismaClient | undefined;
}

// Use o cliente existente se já foi definido (desenvolvimento)
// ou crie um novo cliente (produção - ambiente serverless)
const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Em desenvolvimento, persista o cliente na variável global
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
