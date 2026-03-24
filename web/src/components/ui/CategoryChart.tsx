import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Transaction } from '../../types';

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  '#76DDAA',
  '#FF6584',
  '#6366f1',
  '#f59e0b',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#f97316',
];

export function CategoryChart({ transactions }: Props) {
  const expenses = transactions.filter((tx) => tx.type === 'expense');

  const data = Object.entries(
    expenses.reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        No expense data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius="52%"
          outerRadius="72%"
          paddingAngle={3}
          dataKey="value"
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease-out"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            fontSize: '12px',
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
