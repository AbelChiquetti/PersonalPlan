import {
  FaArrowUp,
  FaArrowDown,
  FaBalanceScale,
  FaDollarSign,
} from "react-icons/fa";
import { FinancialSummary as FinancialSummaryType } from "@/types";

type FinancialSummaryProps = {
  summary: FinancialSummaryType;
};

export default function FinancialSummary({ summary }: FinancialSummaryProps) {
  const { totalIncome, totalExpense, balance, exchangeRate } = summary;

  // Função para formatar valores em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-black mb-1">Receitas</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="p-4 bg-green-100 rounded-full">
            <FaArrowUp className="text-green-600 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-black mb-1">Despesas</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div className="p-4 bg-red-100 rounded-full">
            <FaArrowDown className="text-red-600 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-black mb-1">Saldo</p>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
          <div className="p-4 bg-blue-100 rounded-full">
            <FaBalanceScale className="text-blue-600 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-black mb-1">Cotação USD</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(exchangeRate)}
            </p>
          </div>
          <div className="p-4 bg-purple-100 rounded-full">
            <FaDollarSign className="text-purple-600 text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
