import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Utilizando a API do Awesomeapi para cotação do dólar (gratuita e sem necessidade de chave)
    const response = await fetch(
      "https://economia.awesomeapi.com.br/last/USD-BRL"
    );
    const data = await response.json();

    if (!data || !data.USDBRL) {
      return NextResponse.json(
        { error: "Não foi possível obter a cotação do dólar" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      rate: parseFloat(data.USDBRL.bid),
      lastUpdate: data.USDBRL.create_date,
    });
  } catch (error) {
    console.error("Erro ao buscar cotação do dólar:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cotação do dólar" },
      { status: 500 }
    );
  }
}
