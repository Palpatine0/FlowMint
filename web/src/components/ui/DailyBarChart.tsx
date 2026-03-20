import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Transaction, FilterRange } from '../../types';

interface Props {
  transactions: Transaction[];
  activeRange: FilterRange;
}

export function DailyBarChart({ transactions, activeRange }: Props) {
  let data: any[] = [];
  const now = new Date();

  if (activeRange === 'week') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    data = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dayTxs = transactions.filter((t) => new Date(t.date).getDate() === d.getDate());
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        income: dayTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: dayTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  } else if (activeRange === 'year') {
    data = Array.from({ length: 12 }).map((_, i) => {
      const monthTxs = transactions.filter(
        (t) =>
          new Date(t.date).getMonth() === i && new Date(t.date).getFullYear() === now.getFullYear(),
      );
      const d = new Date(now.getFullYear(), i, 1);
      return {
        name: d.toLocaleDateString('en-US', { month: 'short' }),
        income: monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  } else if (activeRange === 'month') {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    data = Array.from({ length: daysInMonth }).map((_, i) => {
      const day = i + 1;
      const dayTxs = transactions.filter(
        (t) => new Date(t.date).getDate() === day && new Date(t.date).getMonth() === now.getMonth(),
      );
      return {
        name: `${day}`,
        income: dayTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: dayTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  } else {
    // For custom or all-time, just group by the unique dates available in the filtered transactions
    const uniqueDates = Array.from(
      new Set(transactions.map((t) => new Date(t.date).toLocaleDateString())),
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    if (uniqueDates.length === 0) {
      data = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          name: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
          income: 0,
          expenses: 0,
        };
      });
    } else {
      data = uniqueDates.map((dateStr) => {
        const dayTxs = transactions.filter(
          (t) => new Date(t.date).toLocaleDateString() === dateStr,
        );
        const d = new Date(dateStr);
        return {
          name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          income: dayTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          expenses: dayTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        };
      });
    }
  }

  return (
    <div className="h-full w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
            className="dark:stroke-slate-700"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={70}
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
              return `$${value}`;
            }}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
          />
          <Bar
            dataKey="income"
            name="Income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
