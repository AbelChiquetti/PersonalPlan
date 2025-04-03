import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obter todas as transações
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

// Criar uma nova transação
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { description, amount, currency, category, type, isRecurring, date } =
      body;

    if (!description || amount === undefined || !category || !type) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        currency: currency || "BRL",
        category,
        type,
        isRecurring: isRecurring || false,
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    );
  }
}
