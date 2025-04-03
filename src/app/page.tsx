"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FinancialSummary from "@/components/FinancialSummary";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import {
  Transaction,
  TransactionFormData,
  FinancialSummary as FinancialSummaryType,
} from "@/types";
import { FaPlus, FaTimes } from "react-icons/fa";
import axios from "axios";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummaryType>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    exchangeRate: 5.0,
    transactionCount: 0,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<
    Transaction | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar transações e resumo financeiro
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [transactionsResponse, summaryResponse] = await Promise.all([
        axios.get("/api/transactions"),
        axios.get("/api/summary"),
      ]);

      setTransactions(transactionsResponse.data);
      setSummary(summaryResponse.data);
    } catch (err) {
      setError("Erro ao carregar dados. Por favor, tente novamente.");
      console.error("Erro ao carregar dados:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  // Adicionar nova transação
  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      await axios.post("/api/transactions", data);
      await loadData();
      setIsFormOpen(false);
    } catch (err) {
      setError("Erro ao adicionar transação. Por favor, tente novamente.");
      console.error("Erro ao adicionar transação:", err);
    }
  };

  // Atualizar transação existente
  const handleUpdateTransaction = async (data: TransactionFormData) => {
    if (!currentTransaction) return;

    try {
      await axios.put(`/api/transactions/${currentTransaction.id}`, data);
      await loadData();
      setIsFormOpen(false);
      setCurrentTransaction(undefined);
    } catch (err) {
      setError("Erro ao atualizar transação. Por favor, tente novamente.");
      console.error("Erro ao atualizar transação:", err);
    }
  };

  // Excluir transação
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

    try {
      await axios.delete(`/api/transactions/${id}`);
      await loadData();
    } catch (err) {
      setError("Erro ao excluir transação. Por favor, tente novamente.");
      console.error("Erro ao excluir transação:", err);
    }
  };

  // Editar transação
  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsFormOpen(true);
  };

  // Manipular envio do formulário
  const handleSubmit = async (data: TransactionFormData) => {
    if (currentTransaction) {
      await handleUpdateTransaction(data);
    } else {
      await handleAddTransaction(data);
    }
  };

  // Fechar formulário
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentTransaction(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between">
            <span className="font-bold text-base">{error}</span>
            <button onClick={() => setError(null)}>
              <FaTimes />
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <FinancialSummary summary={summary} />

            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-black">Transações</h2>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md flex items-center text-base font-bold"
              >
                <FaPlus className="mr-2" />
                Nova Transação
              </button>
            </div>

            {isFormOpen && (
              <div className="mb-8">
                <TransactionForm
                  onSubmit={handleSubmit}
                  transaction={currentTransaction}
                  onCancel={handleCloseForm}
                />
              </div>
            )}

            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditTransaction}
              exchangeRate={summary.exchangeRate}
            />
          </>
        )}
      </main>
    </div>
  );
}
