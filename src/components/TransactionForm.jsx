import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import { v4 as uuidv4 } from "uuid";

const initialForm = {
  id: null,
  type: "income",
  date: "",
  concept: "",
  amount: "",
};

export default function TransactionForm({ editTransaction, onClose }) {
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editTransaction) {
      setForm({
        id: editTransaction.id,
        type: editTransaction.type,
        date: editTransaction.date,
        concept: editTransaction.concept,
        amount: editTransaction.amount.toString(),
      });
    } else {
      setForm(initialForm);
    }
  }, [editTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.concept || !form.amount)
      return alert("Please fill all fields");
    const amountNum = parseFloat(form.amount);
    if (isNaN(amountNum) || amountNum <= 0)
      return alert("Amount must be a positive number");

    const transaction = {
      id: form.id || uuidv4(),
      type: form.type,
      date: form.date,
      concept: form.concept,
      amount: amountNum,
    };

    if (form.id) {
      updateTransaction(form.id, transaction);
    } else {
      addTransaction(transaction);
    }
    setForm(initialForm);
    if (onClose) onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-pastelPink p-6 rounded-2xl shadow-md max-w-md mx-auto mb-6"
    >
      <h2 className="text-chocolate text-xl font-semibold mb-4">
        {form.id ? "Edit" : "Add"} Transaction
      </h2>

      <label className="block mb-2 text-chocolate font-medium">Type</label>
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full mb-4 p-2 rounded-2xl border border-chocolate focus:outline-none focus:ring-2 focus:ring-bubblegumPink"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <label className="block mb-2 text-chocolate font-medium">Date</label>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full mb-4 p-2 rounded-2xl border border-chocolate focus:outline-none focus:ring-2 focus:ring-bubblegumPink"
      />

      <label className="block mb-2 text-chocolate font-medium">Concept</label>
      <input
        type="text"
        name="concept"
        value={form.concept}
        onChange={handleChange}
        placeholder="e.g. Coffee, Salary"
        className="w-full mb-4 p-2 rounded-2xl border border-chocolate focus:outline-none focus:ring-2 focus:ring-bubblegumPink"
      />

      <label className="block mb-2 text-chocolate font-medium">Amount</label>
      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        min="0"
        step="0.01"
        className="w-full mb-6 p-2 rounded-2xl border border-chocolate focus:outline-none focus:ring-2 focus:ring-bubblegumPink"
      />

      <button
        type="submit"
        className="w-full bg-bubblegumPink hover:bg-darkPink text-cream font-semibold py-2 rounded-2xl transition-colors"
      >
        {form.id ? "Update" : "Add"} Transaction
      </button>
    </form>
  );
}
