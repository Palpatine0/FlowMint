import type { FilterRange, CustomDateRange } from '../../types';

interface DateFilterProps {
  activeRange: FilterRange;
  onRangeChange: (range: FilterRange) => void;
  customDates: CustomDateRange;
  onCustomChange: (type: 'from' | 'to', value: string) => void;
}

const ranges: { id: FilterRange; label: string }[] = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'all', label: 'All' },
  { id: 'custom', label: 'Custom' },
];

export function DateFilter({
  activeRange,
  onRangeChange,
  customDates,
  onCustomChange,
}: DateFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl w-fit">
        {ranges.map((r) => (
          <button
            key={r.id}
            onClick={() => onRangeChange(r.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeRange === r.id
                ? 'bg-white dark:bg-slate-600 text-primary-500 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {activeRange === 'custom' && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
          <input
            type="date"
            value={customDates.from}
            max={customDates.to || undefined}
            className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-200"
            onChange={(e) => onCustomChange('from', e.target.value)}
          />
          <span className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">to</span>
          <input
            type="date"
            value={customDates.to}
            min={customDates.from || undefined}
            className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-200"
            onChange={(e) => onCustomChange('to', e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
