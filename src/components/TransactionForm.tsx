import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaDollarSign, FaMoneyBillWave } from "react-icons/fa";
import {
  TransactionFormData,
  Transaction,
  TRANSACTION_CATEGORIES,
} from "@/types";

const transactionSchema = z.object({
  description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Valor deve ser um número positivo",
    }),
  currency: z.enum(["BRL", "USD"]),
  date: z.string(),
  category: z.string().min(1, "Categoria é obrigatória"),
  isRecurring: z.boolean().default(false),
  type: z.enum(["INCOME", "EXPENSE"]),
});

type TransactionFormProps = {
  onSubmit: (data: TransactionFormData) => Promise<void>;
  transaction?: Transaction;
  onCancel: () => void;
};

export default function TransactionForm({
  onSubmit,
  transaction,
  onCancel,
}: TransactionFormProps) {
  const [submitting, setSubmitting] = useState(false);

  // Definir valores padrão
  const defaultValues = {
    description: transaction?.description ?? "",
    amount: transaction?.amount ? String(transaction.amount) : "",
    currency: transaction?.currency ?? "BRL",
    date: transaction?.date
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    category: transaction?.category ?? "",
    isRecurring: transaction?.isRecurring ?? false,
    type: transaction?.type ?? "EXPENSE",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  // Observar mudanças nos valores
  const currency = watch("currency");
  const type = watch("type");

  // Resetar formulário ao mudar transação para edição
  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        amount: String(transaction.amount),
        currency: transaction.currency as "BRL" | "USD",
        date: new Date(transaction.date).toISOString().split("T")[0],
        category: transaction.category,
        isRecurring: transaction.isRecurring,
        type: transaction.type,
      });
    }
  }, [transaction, reset]);

  const onFormSubmit = async (data: z.infer<typeof transactionSchema>) => {
    try {
      setSubmitting(true);
      await onSubmit({
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date),
      });
      if (!transaction) {
        reset(defaultValues);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">
        {transaction ? "Editar Transação" : "Nova Transação"}
      </h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo da Transação */}
          <div className="col-span-full">
            <label className="block text-base font-bold text-black mb-2">
              Tipo
            </label>
            <div className="flex space-x-4">
              <label
                className={`flex items-center p-3 rounded-md border-2
                ${
                  type === "INCOME"
                    ? "bg-green-50 border-green-500"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  {...register("type")}
                  value="INCOME"
                  className="sr-only"
                  onChange={() => setValue("type", "INCOME")}
                />
                <FaMoneyBillWave
                  className={`mr-2 text-xl ${
                    type === "INCOME" ? "text-green-600" : "text-gray-800"
                  }`}
                />
                <span className="font-bold text-black text-base">Receita</span>
              </label>

              <label
                className={`flex items-center p-3 rounded-md border-2
                ${
                  type === "EXPENSE"
                    ? "bg-red-50 border-red-500"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  {...register("type")}
                  value="EXPENSE"
                  className="sr-only"
                  onChange={() => setValue("type", "EXPENSE")}
                />
                <FaDollarSign
                  className={`mr-2 text-xl ${
                    type === "EXPENSE" ? "text-red-600" : "text-gray-800"
                  }`}
                />
                <span className="font-bold text-black text-base">Despesa</span>
              </label>
            </div>
          </div>

          {/* Descrição */}
          <div className="col-span-full">
            <label
              htmlFor="description"
              className="block text-base font-bold text-black mb-2"
            >
              Descrição
            </label>
            <input
              id="description"
              type="text"
              {...register("description")}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-black text-base"
              placeholder="Ex: Compra no supermercado"
            />
            {errors.description && (
              <p className="mt-1 text-base text-red-600 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Valor e Moeda */}
          <div>
            <label
              htmlFor="amount"
              className="block text-base font-bold text-black mb-2"
            >
              Valor
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-black font-bold sm:text-base">
                  {currency === "BRL" ? "R$" : "$"}
                </span>
              </div>
              <input
                id="amount"
                type="text"
                {...register("amount")}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-16 py-3 border-2 border-gray-300 rounded-md text-black text-base"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  {...register("currency")}
                  className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-black font-medium sm:text-base rounded-md"
                >
                  <option value="BRL">BRL</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            {errors.amount && (
              <p className="mt-1 text-base text-red-600 font-medium">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Data */}
          <div>
            <label
              htmlFor="date"
              className="block text-base font-bold text-black mb-2"
            >
              Data
            </label>
            <input
              id="date"
              type="date"
              {...register("date")}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-black text-base"
            />
            {errors.date && (
              <p className="mt-1 text-base text-red-600 font-medium">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label
              htmlFor="category"
              className="block text-base font-bold text-black mb-2"
            >
              Categoria
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-black text-base"
            >
              <option value="">Selecione uma categoria</option>
              {TRANSACTION_CATEGORIES.map((category) => (
                <option key={category} value={category} className="text-black">
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-base text-red-600 font-medium">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Recorrente */}
          <div>
            <div className="flex items-center h-full pt-2">
              <input
                id="isRecurring"
                type="checkbox"
                {...register("isRecurring")}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isRecurring"
                className="ml-2 block text-base font-bold text-black"
              >
                Transação recorrente (mensal)
              </label>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-md shadow-sm text-base font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 border-2 border-transparent rounded-md shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {submitting
              ? "Salvando..."
              : transaction
              ? "Atualizar"
              : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}
