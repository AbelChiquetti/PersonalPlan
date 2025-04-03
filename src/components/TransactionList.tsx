import { useState } from "react";
import { FaEdit, FaTrash, FaSync, FaDollarSign } from "react-icons/fa";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type TransactionListProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  exchangeRate: number;
};

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
  exchangeRate,
}: TransactionListProps) {
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Formatar valores monetários
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency === "USD" ? "USD" : "BRL",
    }).format(value);
  };

  // Formatar data
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  // Ordenar transações
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === "date") {
      const dateA = new Date(a[sortField] as string).getTime();
      const dateB = new Date(b[sortField] as string).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortField === "amount") {
      const amountA = a.currency === "USD" ? a.amount * exchangeRate : a.amount;
      const amountB = b.currency === "USD" ? b.amount * exchangeRate : b.amount;
      return sortDirection === "asc" ? amountA - amountB : amountB - amountA;
    }

    const valueA = String(a[sortField]);
    const valueB = String(b[sortField]);
    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  // Alternar ordenação
  const toggleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                Data{" "}
                {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("description")}
              >
                Descrição{" "}
                {sortField === "description" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("category")}
              >
                Categoria{" "}
                {sortField === "category" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("amount")}
              >
                Valor{" "}
                {sortField === "amount" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-black">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-base font-bold text-black">
                          {transaction.description}
                        </div>
                        <div className="text-sm font-medium text-black flex items-center">
                          {transaction.isRecurring && (
                            <span className="flex items-center mr-2">
                              <FaSync
                                className="text-blue-600 mr-1"
                                size={14}
                              />
                              <span className="font-semibold">Recorrente</span>
                            </span>
                          )}
                          {transaction.currency === "USD" && (
                            <span className="flex items-center">
                              <FaDollarSign
                                className="text-green-600 mr-1"
                                size={14}
                              />
                              <span className="font-semibold">USD</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-black">
                    {transaction.category}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-base font-bold 
                    ${
                      transaction.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(transaction.amount, transaction.currency)}
                    {transaction.currency === "USD" && (
                      <div className="text-sm font-medium text-black">
                        ~
                        {formatCurrency(
                          transaction.amount * exchangeRate,
                          "BRL"
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 text-xl"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900 text-xl"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-base font-medium text-black"
                >
                  Nenhuma transação encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
