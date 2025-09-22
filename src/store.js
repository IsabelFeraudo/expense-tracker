import { create } from "zustand";

const LOCAL_STORAGE_KEY = "girlyPopBudgetData";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return { transactions: [] };
    return JSON.parse(data);
  } catch {
    return { transactions: [] };
  }
};

const saveToLocalStorage = (state) => {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({ transactions: state.transactions })
  );
};

export const useStore = create((set, get) => ({
  transactions: loadFromLocalStorage().transactions || [],

  addTransaction: (transaction) => {
    set((state) => {
      const newTransactions = [...state.transactions, transaction];
      saveToLocalStorage({ transactions: newTransactions });
      return { transactions: newTransactions };
    });
  },

  updateTransaction: (id, updated) => {
    set((state) => {
      const newTransactions = state.transactions.map((t) =>
        t.id === id ? { ...t, ...updated } : t
      );
      saveToLocalStorage({ transactions: newTransactions });
      return { transactions: newTransactions };
    });
  },

  deleteTransaction: (id) => {
    set((state) => {
      const newTransactions = state.transactions.filter((t) => t.id !== id);
      saveToLocalStorage({ transactions: newTransactions });
      return { transactions: newTransactions };
    });
  },
}));
