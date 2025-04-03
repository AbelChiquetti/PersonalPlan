export type Transaction = {
  id: string;
  description: string;
  amount: number;
  currency: "BRL" | "USD";
  date: Date | string;
  category: string;
  isRecurring: boolean;
  type: "INCOME" | "EXPENSE";
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type TransactionFormData = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt"
>;

export type FinancialSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  exchangeRate: number;
  transactionCount: number;
};

export const TRANSACTION_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Roupas",
  "Investimentos",
  "Salário",
  "Freelance",
  "Presente",
  "Outros",
];
