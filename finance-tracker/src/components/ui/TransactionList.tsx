import { ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react";
import type { Transaction } from "../../types";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}
const CATEGORY_COLORS: Record<string, string> = {
  Rent: "bg-purple-100 text-purple-700",
  Food: "bg-orange-100 text-orange-700",
  Clothes: "bg-blue-100 text-blue-700",
  Transport: "bg-cyan-100 text-cyan-700",
  Utilities: "bg-yellow-100 text-yellow-700",
  Entertainment: "bg-pink-100 text-pink-700",
  Salary: "bg-emerald-100 text-emerald-700",
  Other: "bg-slate-100 text-slate-700",
};

export function TransactionList({ transactions, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">
          Recent Transactions
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 uppercase text-xs font-semibold">
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  No transactions yet. Add your first one above!
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {tx.type === "income" ? (
                        <ArrowUpCircle className="text-emerald-500" size={20} />
                      ) : (
                        <ArrowDownCircle className="text-rose-500" size={20} />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">
                          {tx.description}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        CATEGORY_COLORS[tx.category] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-slate-900"}`}
                  >
                    {tx.type === "income" ? "+" : "-"}$
                    {tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
