import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
}

const CATEGORY_META: Record<string, { pillBg: string; pillText: string; bar: string }> = {
  Rent:          { pillBg: "#f3e8ff", pillText: "#7e22ce", bar: "#c084fc" },
  Food:          { pillBg: "#fff7ed", pillText: "#c2410c", bar: "#fb923c" },
  Clothes:       { pillBg: "#eff6ff", pillText: "#1d4ed8", bar: "#60a5fa" },
  Transport:     { pillBg: "#ecfeff", pillText: "#0e7490", bar: "#22d3ee" },
  Utilities:     { pillBg: "#fefce8", pillText: "#a16207", bar: "#facc15" },
  Entertainment: { pillBg: "#fdf2f8", pillText: "#be185d", bar: "#f472b6" },
  Salary:        { pillBg: "#f0fdf4", pillText: "#15803d", bar: "#4ade80" },
};
const DEFAULT_META = { pillBg: "#f8fafc", pillText: "#475569", bar: "#94a3b8" };

export function Accounts({ transactions }: Props) {
  const totalIncome   = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance       = totalIncome - totalExpenses;
  const savingsRate   = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  const spentPct      = totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0;

  const categoryTotals = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {}),
  )
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  const maxCat = categoryTotals[0]?.total ?? 1;

  return (
    <div className="max-w-3xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Balance card ─────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm" style={{ padding: "24px" }}>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
          Main Wallet · Total Balance
        </p>
        <p className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-5">
          ${balance.toLocaleString()}
        </p>

        {/* progress bar */}
        <div className="mb-1">
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
            <div
              className="h-2 bg-primary-400 rounded-full"
              style={{ width: `${spentPct}%`, transition: "width .5s ease" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="text-xs text-slate-400 dark:text-slate-500">{spentPct.toFixed(1)}% spent</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">${(totalIncome - totalExpenses).toLocaleString()} remaining</span>
        </div>
      </div>

      {/* ── Income / Expense side by side ────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Income */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Total Income</p>
            <div style={{ padding: "6px", borderRadius: "8px" }} className="bg-emerald-100 dark:bg-emerald-800/40">
              <ArrowUpRight size={16} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300" style={{ marginBottom: "6px" }}>
            ${totalIncome.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-500">
            {transactions.filter((t) => t.type === "income").length} transactions
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-2xl" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Total Expenses</p>
            <div style={{ padding: "6px", borderRadius: "8px" }} className="bg-rose-100 dark:bg-rose-800/40">
              <ArrowDownRight size={16} className="text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-rose-700 dark:text-rose-300" style={{ marginBottom: "6px" }}>
            ${totalExpenses.toLocaleString()}
          </p>
          <p className="text-xs text-rose-600/70 dark:text-rose-500">
            {transactions.filter((t) => t.type === "expense").length} transactions · {savingsRate.toFixed(1)}% saved
          </p>
        </div>
      </div>

      {/* ── Category breakdown ───────────────────────── */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm" style={{ padding: "24px" }}>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest" style={{ marginBottom: "20px" }}>
          Spending by Category
        </p>

        {categoryTotals.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-6">
            No expense transactions yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {categoryTotals.map(({ name, total }) => {
              const c = CATEGORY_META[name] ?? DEFAULT_META;
              const barPct = Math.round((total / maxCat) * 100);
              const ofTotal = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;
              return (
                <div key={name}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span
                      style={{
                        background: c.pillBg,
                        color: c.pillText,
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      {name}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>{ofTotal}%</span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#334155", minWidth: "72px", textAlign: "right" }}>
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "6px", width: `${barPct}%`, background: c.bar, borderRadius: "999px", transition: "width .5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
