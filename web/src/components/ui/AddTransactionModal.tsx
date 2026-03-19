import React, { useState } from "react";
import { X } from "lucide-react";
import type { Transaction, TransactionType } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Transaction) => void;
}

const PRESET_CATEGORIES = [
  "Rent",
  "Food",
  "Clothes",
  "Transport",
  "Utilities",
  "Entertainment",
  "Salary",
  "Other",
];

export function AddTransactionModal({ isOpen, onClose, onAdd }: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<TransactionType>("expense");
  const [customCategory, setCustomCategory] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = category === "Other" ? customCategory : category;

    onAdd({
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      description,
      type,
      date: new Date(date).toISOString(),
      category: finalCategory || "Uncategorized",
    });
    onClose();
    setAmount("");
    setDescription("");
    setCategory(PRESET_CATEGORIES[0]);
    setCustomCategory("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none"
              placeholder="e.g. Monthly Rent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {category === "Other" && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Custom Category
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gym, Subscriptions..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-primary-200 bg-primary-50/30 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none"
                />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2 rounded-xl border-2 transition-all ${type === "income" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-100 text-slate-500"}`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2 rounded-xl border-2 transition-all ${type === "expense" ? "border-rose-500 bg-rose-50 text-rose-700" : "border-slate-100 text-slate-500"}`}
            >
              Expense
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-400 text-white py-3 rounded-xl font-bold hover:bg-primary-500 transition-colors mt-4"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
