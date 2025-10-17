import React, { useState, useMemo } from "react";
import { useStore } from "../store";
import TransactionForm from "./TransactionForm";
import {
  format,
  parseISO,
  isSameDay,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  startOfDay,
} from "date-fns";

// 💖 FUNCIÓN PARA ASIGNAR COLORES SEGÚN MONTO
const getAmountColor = (amount) => {
  if (amount < 0) return "text-pink-700"; // fucsia casi rojo
  if (amount < 100) return "text-fuchsia-600"; // fucsia fuerte
  if (amount > 300 && amount < 500) return "text-green-300"; // verde pastel
  if (amount >= 500) return "text-blue-300"; // azul pastel
  return "text-chocolate"; // color neutro
};

export default function TransactionList({
  selectedDate,
  currentMonth,
  onClose,
}) {
  const transactions = useStore((state) => state.transactions);
  const fetchTransactions = useStore((state) => state.fetchTransactions);
  const deleteTransaction = useStore((state) => state.deleteTransaction);

  const [editTx, setEditTx] = useState(null);

  // Filtra transacciones por fecha o mes actual
  const filteredTx = useMemo(() => {
    if (selectedDate) {
      const selectedDay = startOfDay(parseISO(selectedDate));
      return transactions.filter((tx) => {
        const txDay = startOfDay(parseISO(tx.date));
        return isSameDay(txDay, selectedDay);
      });
    } else if (currentMonth) {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      return transactions.filter((tx) => {
        const txDate = startOfDay(parseISO(tx.date));
        return isWithinInterval(txDate, { start, end });
      });
    }
    return transactions;
  }, [transactions, selectedDate, currentMonth]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
      if (editTx && editTx.id === id) setEditTx(null);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="bg-pastelPink rounded-2xl p-6 shadow-md max-w-md mx-auto mb-6">
      <h2 className="text-chocolate text-xl font-semibold mb-4">
        {selectedDate
          ? `Transactions on ${format(
              startOfDay(parseISO(selectedDate)),
              "PPP"
            )}`
          : currentMonth
          ? `Transactions in ${format(currentMonth, "MMMM yyyy")}`
          : "All Transactions"}
      </h2>

      {editTx ? (
        <>
          <TransactionForm
            editTransaction={editTx}
            onClose={() => setEditTx(null)}
          />
          <button
            onClick={() => setEditTx(null)}
            className="mt-2 w-full bg-chocolate text-cream py-2 rounded-2xl hover:bg-darkPink transition-colors"
          >
            Cancel Edit
          </button>
        </>
      ) : (
        <>
          {filteredTx.length === 0 && (
            <p className="text-chocolate italic">No transactions found.</p>
          )}
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTx.map((tx) => {
              const txDay = startOfDay(parseISO(tx.date));
              const colorClass = getAmountColor(tx.amount);

              return (
                <li
                  key={tx.id}
                  className="flex justify-between items-center bg-cream rounded-2xl p-3 shadow"
                >
                  <div>
                    <p className="font-semibold text-chocolate">{tx.concept}</p>
                    <p className="text-sm text-bubblegumPink">
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </p>
                    <p className="text-xs text-chocolate">
                      {format(txDay, "PPP")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className={`font-semibold ${colorClass}`}>
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => setEditTx(tx)}
                      className="bg-bubblegumPink hover:bg-darkPink text-cream rounded-2xl px-3 py-1 text-sm transition-colors"
                      aria-label="Edit transaction"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="bg-chocolate hover:bg-darkPink text-cream rounded-2xl px-3 py-1 text-sm transition-colors"
                      aria-label="Delete transaction"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {selectedDate && (
            <button
              onClick={onClose}
              className="mt-4 w-full bg-chocolate text-cream py-2 rounded-2xl hover:bg-darkPink transition-colors"
            >
              Close
            </button>
          )}
        </>
      )}
    </div>
  );
}
