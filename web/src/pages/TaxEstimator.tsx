import { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  Receipt,
  Info,
  ArrowRight,
  ShieldCheck,
  Globe,
  MapPin,
  Building2,
  HardHat,
  Monitor,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import type { Transaction } from '../types';

interface TaxEstimatorProps {
  transactions: Transaction[];
}

export function TaxEstimator({ transactions }: TaxEstimatorProps) {
  const [visaStatus, setVisaStatus] = useState('US Citizen / Resident');
  const [stateCode, setStateCode] = useState('CA');
  const [federalRate, setFederalRate] = useState(12);

  const STATE_RATES: Record<string, number> = {
    CA: 0.08,
    TX: 0,
    FL: 0,
    NV: 0,
    WA: 0,
    NY: 0.065,
    OTHER: 0.05,
  };

  const taxData = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Business deduction categories
    const deductionCategories = ['Office', 'Software', 'Travel', 'Equipment', 'Marketing', 'Rent'];
    const deductions = transactions
      .filter((t) => t.type === 'expense' && deductionCategories.includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);

    const taxableIncome = Math.max(0, income - deductions);

    // F-1/OPT and J-1 Non-Resident Aliens are explicitly exempt from FICA (15.3% SE Tax)
    const isExemptFromSE = visaStatus === 'F-1 / OPT' || visaStatus === 'J-1';
    const selfEmploymentTax = isExemptFromSE ? 0 : taxableIncome * 0.153;

    // Look up real state tax average rates
    const stateTaxRate = STATE_RATES[stateCode] ?? 0.05;
    const stateTax = taxableIncome * stateTaxRate;

    // Federal effective rate
    const estimatedFederalTax = taxableIncome * (federalRate / 100);

    const totalTax = selfEmploymentTax + stateTax + estimatedFederalTax;

    const netIncome = income - totalTax;

    return {
      income,
      deductions,
      taxableIncome,
      selfEmploymentTax,
      stateTax,
      estimatedFederalTax,
      totalTax,
      netIncome,
      deductionBreakdown: deductionCategories
        .map((cat) => ({
          name: cat,
          value: transactions
            .filter((t) => t.type === 'expense' && t.category === cat)
            .reduce((sum, t) => sum + t.amount, 0),
        }))
        .filter((d) => d.value > 0),
    };
  }, [transactions, visaStatus, stateCode, federalRate]);

  const chartData = [
    { name: 'Gross Income', amount: taxData.income, fill: '#6366f1' },
    { name: 'Deductions', amount: taxData.deductions, fill: '#10b981' },
    { name: 'Estimated Tax', amount: taxData.totalTax, fill: '#ef4444' },
    { name: 'Net Profit', amount: taxData.netIncome, fill: '#f59e0b' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calculator className="text-primary-500" />
            Smart Tax Estimator
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time tax liability insights for freelancers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          {/* Visa Status Toggle */}
          <div className="flex items-center gap-2 px-3">
            <Globe size={16} className="text-slate-400" />
            <select
              value={visaStatus}
              onChange={(e) => setVisaStatus(e.target.value)}
              className="text-sm font-bold bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 cursor-pointer outline-none w-28 md:w-auto"
            >
              <option value="US Citizen / Resident">US Citizen / Resident</option>
              <option value="F-1 / OPT">F-1 / OPT Student</option>
              <option value="J-1">J-1 Exchange Visitor</option>
            </select>
          </div>
          <div className="hidden md:block h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />

          {/* State Dropdown */}
          <div className="flex items-center gap-2 px-3">
            <MapPin size={16} className="text-slate-400" />
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="text-sm font-bold bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 cursor-pointer outline-none w-28 md:w-auto"
            >
              <option value="CA">California (8%)</option>
              <option value="NY">New York (6.5%)</option>
              <option value="TX">Texas (0%)</option>
              <option value="FL">Florida (0%)</option>
              <option value="WA">Washington (0%)</option>
              <option value="NV">Nevada (0%)</option>
              <option value="OTHER">Other State (~5%)</option>
            </select>
          </div>
          <div className="hidden md:block h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />

          {/* Federal Bracket */}
          <div className="flex items-center gap-2 px-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Fed Bracket</span>
            <select
              value={federalRate}
              onChange={(e) => setFederalRate(Number(e.target.value))}
              className="text-sm font-bold bg-transparent border-none focus:ring-0 text-primary-600 cursor-pointer outline-none"
            >
              <option value={10}>10%</option>
              <option value={12}>12%</option>
              <option value={22}>22%</option>
              <option value={24}>24%</option>
              <option value={32}>32%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={48} className="text-primary-500" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            Gross Income
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            ${taxData.income.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-lg w-fit">
            <Info size={12} />
            YTD EARNINGS
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Receipt size={48} className="text-emerald-500" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            Total Deductions
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            -${taxData.deductions.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg w-fit">
            <ShieldCheck size={12} />
            TAX BREAKS FOUND
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Calculator size={48} className="text-rose-500" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            Est. Tax Liability
          </p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
            ${taxData.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-lg w-fit">
            <ArrowRight size={12} />
            SET THIS ASIDE
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm bg-gradient-to-br from-primary-500 to-primary-600 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 text-white group-hover:scale-110 transition-transform">
            <Info size={48} />
          </div>
          <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">
            Net Take Home
          </p>
          <p className="text-2xl font-black text-white">
            ${taxData.netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-white/90 bg-white/10 px-2 py-1 rounded-lg w-fit">
            REAL PROFIT
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Comparison Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-2">
            Income vs Taxes & Deductions
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                  tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(v) => `$${v >= 1000 ? v / 1000 + 'k' : v}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(v: any) => [`$${v.toLocaleString()}`, '']}
                />
                <Bar dataKey="amount" radius={[12, 12, 12, 12]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deduction Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
            Deduction Categories
          </h3>
          <p className="text-xs text-slate-500 mb-8 font-medium">
            Top business expense categories found.
          </p>

          {taxData.deductionBreakdown.length > 0 ? (
            <div className="space-y-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taxData.deductionBreakdown}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taxData.deductionBreakdown.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][
                              index % 6
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none' }}
                      formatter={(v: any) => `$${v.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {taxData.deductionBreakdown.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: [
                            '#6366f1',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444',
                            '#8b5cf6',
                            '#ec4899',
                          ][idx % 6],
                        }}
                      />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-full text-slate-400">
                <Receipt size={32} />
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                No deductions found yet.
              </p>
              <p className="text-xs text-slate-400 max-w-[200px]">
                Tag your business expenses as 'Office', 'Software', or 'Travel' to see them here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tax Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4 p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
            <Building2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Quarterly Payments
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Remember to pay estimated taxes every quarter to avoid IRS penalties.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-3xl">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
            <Monitor size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Software Deductions
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              SaaS subscriptions like Adobe, Slack, or GitHub are 100% tax deductible.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6 bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-3xl">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-xl text-orange-600 dark:text-orange-400">
            <HardHat size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Home Office</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              You may be able to deduct a portion of your rent/utilities for your workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
