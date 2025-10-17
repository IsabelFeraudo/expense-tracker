import { create } from "zustand";
import { api } from "./api";

export const useStore = create((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.listTransactions();
      set({ transactions: data, loading: false });
    } catch (e) {
      set({ error: e.message || String(e), loading: false });
    }
  },

  addTransaction: async (transaction) => {
    set({ error: null });
    try {
      const created = await api.createTransaction(transaction);
      set((state) => ({ transactions: [...state.transactions, created] }));
    } catch (e) {
      set({ error: e.message || String(e) });
    }
  },

  updateTransaction: async (id, updated) => {
    set({ error: null });
    try {
      const saved = await api.updateTransaction(id, updated);
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? saved : t)),
      }));
    } catch (e) {
      set({ error: e.message || String(e) });
    }
  },

  deleteTransaction: async (id) => {
    set({ error: null });
    try {
      await api.deleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch (e) {
      set({ error: e.message || String(e) });
    }
  },
}));
