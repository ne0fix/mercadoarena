'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { formatCurrency } from '@/core/utils/formatCurrency'

interface RevenueChartProps {
  data: { label: string; revenue: number; refunds: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#624325" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#624325" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="refundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#d3c4b820" />
        <XAxis
          dataKey="label"
          tick={{ fontFamily: 'Lexend', fontSize: 10, fill: '#82756b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          tick={{ fontFamily: 'Lexend', fontSize: 10, fill: '#82756b' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name === 'revenue' ? 'Receita' : 'Estornos',
          ]}
          contentStyle={{
            background: '#fff8f5',
            border: '1px solid #d3c4b8',
            borderRadius: 12,
            fontFamily: 'Lexend',
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#624325"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="refunds"
          stroke="#ef4444"
          strokeWidth={1.5}
          fill="url(#refundGrad)"
          strokeDasharray="4 2"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
