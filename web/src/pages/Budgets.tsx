import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
}

const STORAGE_KEY = "flowmint_budgets";

const CATEGORIES = [
  { name: "Rent",          pillBg: "#f3e8ff", pillText: "#7e22ce", bar: "#a855f7" },
  { name: "Food",          pillBg: "#fff7ed", pillText: "#c2410c", bar: "#f97316" },
  { name: "Clothes",       pillBg: "#eff6ff", pillText: "#1d4ed8", bar: "#3b82f6" },
  { name: "Transport",     pillBg: "#ecfeff", pillText: "#0e7490", bar: "#06b6d4" },
  { name: "Utilities",     pillBg: "#fefce8", pillText: "#a16207", bar: "#eab308" },
  { name: "Entertainment", pillBg: "#fdf2f8", pillText: "#be185d", bar: "#ec4899" },
  { name: "Other",         pillBg: "#f8fafc", pillText: "#475569", bar: "#94a3b8" },
];

const DEFAULT_BUDGETS: Record<string, number> = {
  Rent: 2000, Food: 800, Clothes: 300, Transport: 200,
  Utilities: 150, Entertainment: 200, Other: 300,
};

function getSpentThisMonth(transactions: Transaction[], category: string): number {
  const now = new Date();
  return transactions
    .filter((t) =>
      t.type === "expense" &&
      t.category === category &&
      new Date(t.date).getMonth() === now.getMonth() &&
      new Date(t.date).getFullYear() === now.getFullYear()
    )
    .reduce((s, t) => s + t.amount, 0);
}

export function Budgets({ transactions }: Props) {
  const [budgets, setBudgets] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_BUDGETS, ...JSON.parse(saved) } : DEFAULT_BUDGETS;
    } catch {
      return DEFAULT_BUDGETS;
    }
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  }, [budgets]);

  const startEdit = (name: string) => {
    setEditing(name);
    setEditValue(String(budgets[name] ?? 0));
  };

  const saveEdit = (name: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      setBudgets((prev) => ({ ...prev, [name]: val }));
    }
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  const totalSpent  = CATEGORIES.reduce((s, c) => s + getSpentThisMonth(transactions, c.name), 0);
  const overallPct  = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const overallColor = overallPct >= 90 ? "#ef4444" : overallPct >= 70 ? "#f59e0b" : "#76DDAA";

  return (
    <div className="max-w-3xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Summary card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm" style={{ padding: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
          Monthly Budget Overview
        </p>

        {/* Spent vs budget */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "36px", fontWeight: 800, color: overallPct >= 100 ? "#ef4444" : "#0f172a", lineHeight: 1 }}>
                ${totalSpent.toLocaleString()}
              </span>
              <span style={{ fontSize: "15px", color: "#94a3b8" }}>/ ${totalBudget.toLocaleString()}</span>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>spent this month</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "22px", fontWeight: 700, color: overallPct >= 100 ? "#ef4444" : "#16a34a" }}>{overallPct.toFixed(0)}%</p>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>of budget</p>
          </div>
        </div>

        <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden", marginBottom: "10px" }}>
          <div style={{ height: "10px", width: `${overallPct}%`, background: overallColor, borderRadius: "999px", transition: "width .5s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            {totalBudget - totalSpent >= 0
              ? `$${(totalBudget - totalSpent).toLocaleString()} remaining`
              : `$${Math.abs(totalBudget - totalSpent).toLocaleString()} over budget`}
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Budget: ${totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Per-category budgets */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm" style={{ padding: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
          Category Budgets
        </p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {CATEGORIES.map(({ name, pillBg, pillText, bar }, idx) => {
            const budget  = budgets[name] ?? 0;
            const spent   = getSpentThisMonth(transactions, name);
            const pct     = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
            const rawPct  = budget > 0 ? (spent / budget) * 100 : 0;
            const isOver  = spent > budget && budget > 0;
            const isClose = !isOver && pct >= 80;
            const barColor    = isOver ? "#ef4444" : isClose ? "#f59e0b" : bar;
            const statusBg    = isOver ? "#fef2f2" : isClose ? "#fffbeb" : "#f0fdf4";
            const statusText  = isOver ? "#dc2626" : isClose ? "#d97706" : "#16a34a";
            const statusLabel = isOver ? "Over budget" : isClose ? "Almost full" : "On track";

            return (
              <div
                key={name}
                style={{
                  padding: "16px 0",
                  borderTop: idx === 0 ? "none" : "1px solid #f1f5f9",
                }}
              >
                {/* Top row: pill + status | amounts + edit */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ background: pillBg, color: pillText, fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "999px" }}>
                      {name}
                    </span>
                    <span style={{ background: statusBg, color: statusText, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>
                      {statusLabel}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {editing === name ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#94a3b8" }}>$</span>
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(name); if (e.key === "Escape") cancelEdit(); }}
                          autoFocus
                          className="border border-primary-400 rounded-lg outline-none focus:ring-2 focus:ring-primary-400 text-slate-800 dark:text-slate-100 dark:bg-slate-700"
                          style={{ width: "80px", padding: "4px 8px", fontSize: "13px" }}
                        />
                        <button onClick={() => saveEdit(name)} className="text-primary-500 hover:text-primary-600"><Check size={15} /></button>
                        <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600"><X size={15} /></button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "13px" }}>
                          <span style={{ fontWeight: 700, color: isOver ? "#dc2626" : "#1e293b" }}>${spent.toLocaleString()}</span>
                          <span style={{ color: "#cbd5e1" }}> / </span>
                          <span style={{ color: "#64748b" }}>${budget.toLocaleString()}</span>
                        </span>
                        <button onClick={() => startEdit(name)} className="text-slate-300 hover:text-primary-500 transition-colors">
                          <Pencil size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar + % */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ flex: 1, height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "8px", width: `${pct}%`, background: barColor, borderRadius: "999px", transition: "width .5s ease" }} />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: barColor, minWidth: "36px", textAlign: "right" }}>
                    {rawPct.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
