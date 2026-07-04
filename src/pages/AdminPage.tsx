import { motion } from 'framer-motion';
import { Activity, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import {
  CartesianGrid, Cell, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Badge } from '../components/common/Badge';
import { ADMIN_METRICS } from '../data/mockData';
import { formatCurrency, formatNumber, formatDate } from '../utils/helpers';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

const axisStyle = { fontSize: 12, fill: '#94a3b8' };
const gridStyle = { stroke: '#e2e8f0', strokeDasharray: '3 3' };

export function AdminPage({ onNavigate }: AdminPageProps) {
  const m = ADMIN_METRICS;

  return (
    <DashboardLayout onNavigate={onNavigate} currentPath="/admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 p-3 text-white">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Platform analytics and user management</p>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <MetricCard icon={Users} label="Total Users" value={formatNumber(m.totalUsers)} change="+12.5%" color="primary" />
          <MetricCard icon={Activity} label="Active Users (30d)" value={formatNumber(m.activeUsers)} change="+8.2%" color="success" />
          <MetricCard icon={Zap} label="Total AI Requests" value={formatNumber(m.totalAiRequests)} change="+24.1%" color="accent" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MRR line chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Revenue Analytics</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Monthly recurring revenue</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-500/10 text-success-600 dark:text-success-400 text-xs font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                +18.3% MoM
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={m.mrr} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(v) => [formatCurrency(Number(v)), 'MRR']}
                />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} name="MRR" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Subscription breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
          >
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-1">Subscriptions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Plan distribution</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={m.subscriptionBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {m.subscriptionBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatNumber(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {m.subscriptionBreakdown.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{s.name}</span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">{formatNumber(s.value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent signups table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
        >
          <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-4">Recent Signups</h3>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left font-semibold text-slate-700 dark:text-slate-300 px-2 py-3">Name</th>
                  <th className="text-left font-semibold text-slate-700 dark:text-slate-300 px-2 py-3">Email</th>
                  <th className="text-left font-semibold text-slate-700 dark:text-slate-300 px-2 py-3">Date</th>
                  <th className="text-left font-semibold text-slate-700 dark:text-slate-300 px-2 py-3">Plan</th>
                </tr>
              </thead>
              <tbody>
                {m.recentSignups.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800/50">
                    <td className="px-2 py-3 font-medium text-slate-900 dark:text-white">{s.name}</td>
                    <td className="px-2 py-3 text-slate-600 dark:text-slate-400">{s.email}</td>
                    <td className="px-2 py-3 text-slate-600 dark:text-slate-400">{formatDate(s.date)}</td>
                    <td className="px-2 py-3">
                      <Badge variant={s.tier === 'enterprise' ? 'primary' : s.tier === 'pro' ? 'accent' : 'neutral'}>
                        {s.tier}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({
  icon: Icon, label, value, change, color,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  change: string;
  color: 'primary' | 'success' | 'accent';
}) {
  const colorMap = {
    primary: 'bg-primary-500/10 text-primary-500',
    success: 'bg-success-500/10 text-success-500',
    accent: 'bg-accent-500/10 text-accent-500',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex rounded-xl p-2.5 ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium text-success-500 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {change}
        </span>
      </div>
      <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </motion.div>
  );
}
