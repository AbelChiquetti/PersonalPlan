import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Obter todas as transações
    const transactions = await prisma.transaction.findMany();

    // Buscar a cotação do dólar atual
    const exchangeRateResponse = await fetch(
      "http://localhost:3000/api/exchange-rate",
      { cache: "no-store" }
    );
    const { rate } = await exchangeRateResponse.json();
    const usdToBrl = rate || 5.0; // Valor padrão caso a API falhe

    let totalIncome = 0;
    let totalExpense = 0;

    // Calcular totais
    transactions.forEach((transaction) => {
      const amount =
        transaction.currency === "USD"
          ? transaction.amount * usdToBrl
          : transaction.amount;

      if (transaction.type === "INCOME") {
        totalIncome += amount;
      } else if (transaction.type === "EXPENSE") {
        totalExpense += amount;
      }
    });

    const balance = totalIncome - totalExpense;

    return NextResponse.json({
      totalIncome,
      totalExpense,
      balance,
      exchangeRate: usdToBrl,
      transactionCount: transactions.length,
    });
  } catch (error) {
    console.error("Erro ao calcular resumo:", error);
    return NextResponse.json(
      { error: "Erro ao calcular resumo financeiro" },
      { status: 500 }
    );
  }
}
