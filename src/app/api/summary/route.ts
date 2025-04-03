import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Obter todas as transações
    const transactions = await prisma.transaction.findMany();

    // Buscar a cotação do dólar atual
    let usdToBrl = 5.0; // Valor padrão

    try {
      const exchangeRateResponse = await fetch(
        "https://economia.awesomeapi.com.br/last/USD-BRL",
        {
          next: { revalidate: 3600 }, // Revalidar a cada hora
        }
      );

      if (exchangeRateResponse.ok) {
        const data = await exchangeRateResponse.json();
        if (data && data.USDBRL) {
          usdToBrl = parseFloat(data.USDBRL.bid);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar cotação do dólar:", error);
      // Continua usando o valor padrão
    }

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
