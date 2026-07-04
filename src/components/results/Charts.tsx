import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { ExpenseBreakdown, FinancialPoint } from '../../types';
import { formatCurrency } from '../../utils/helpers';

const axisStyle = { fontSize: 12, fill: '#94a3b8' };
const gridStyle = { stroke: '#e2e8f0', strokeDasharray: '3 3' };

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg shadow-xl p-3 text-sm">
      {label && <p className="font-medium text-slate-900 dark:text-white mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-slate-600 dark:text-slate-300">
          <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export function RevenueChart({ data }: { data: FinancialPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ProfitChart({ data }: { data: FinancialPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Profit" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ExpenseChart({ data }: { data: ExpenseBreakdown[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ExpensesBarChart({ data }: { data: ExpenseBreakdown[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Expenses">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
