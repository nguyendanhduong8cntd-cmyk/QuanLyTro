import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts'
import { formatCurrency } from '../../utils/format'

const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']

export default function RevenueChart({ monthlyRevenue = [] }) {
  const data = MONTHS.map((m, i) => ({ month: m, value: Number(monthlyRevenue[i] || 0) }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1_000_000 ? `${v / 1_000_000}tr` : v >= 1000 ? `${v / 1000}k` : v)}
          width={42}
        />
        <Tooltip
          formatter={(v) => [formatCurrency(v), 'Doanh thu']}
          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
          cursor={{ fill: 'rgba(37,99,235,0.06)' }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={42}>
          {data.map((_, i) => (
            <Cell key={i} fill="#2563eb" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
