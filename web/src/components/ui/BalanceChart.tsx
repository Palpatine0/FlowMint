import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Transaction } from '../../types';

interface Props {
  transactions: Transaction[];
}

export function BalanceChart({ transactions }: Props) {
  const data = [...transactions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], curr) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const amount = curr.type === 'income' ? curr.amount : -curr.amount;

      acc.push({
        date: new Date(curr.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        balance: lastBalance + amount,
      });
      return acc;
    }, []);

  return (
    <div className="h-full w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Balance']}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={() => 'Account Balance'}
            wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#2563eb"
            fillOpacity={1}
            fill="url(#colorBalance)"
            strokeWidth={3}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
