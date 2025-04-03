import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Erro ao buscar transação:", error);
    return NextResponse.json(
      { error: "Erro ao buscar transação" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { description, amount, currency, category, type, isRecurring, date } =
      body;

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        description,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        currency,
        category,
        type,
        isRecurring,
        date: date ? new Date(date) : undefined,
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await prisma.transaction.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    return NextResponse.json(
      { error: "Erro ao excluir transação" },
      { status: 500 }
    );
  }
}
