import type { FilterRange, CustomDateRange } from "../../types";

interface DateFilterProps {
  activeRange: FilterRange;
  onRangeChange: (range: FilterRange) => void;
  customDates: CustomDateRange;
  onCustomChange: (type: "from" | "to", value: string) => void;
}

const ranges: { id: FilterRange; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "all", label: "All" },
  { id: "custom", label: "Custom" },
];

export function DateFilter({
  activeRange,
  onRangeChange,
  customDates,
  onCustomChange,
}: DateFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        {ranges.map((r) => (
          <button
            key={r.id}
            onClick={() => onRangeChange(r.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeRange === r.id
                ? "bg-white text-primary-500 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {activeRange === "custom" && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
          <input
            type="date"
            value={customDates.from}
            className="px-3 py-1 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            onChange={(e) => onCustomChange("from", e.target.value)}
          />
          <span className="text-slate-400 text-sm font-medium italic">to</span>
          <input
            type="date"
            value={customDates.to}
            className="px-3 py-1 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            onChange={(e) => onCustomChange("to", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
