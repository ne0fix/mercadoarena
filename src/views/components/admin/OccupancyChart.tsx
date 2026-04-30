'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface OccupancyChartProps {
  data: { hour: string; count: number }[]
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="hour"
          tick={{ fontFamily: 'Lexend', fontSize: 10, fill: '#82756b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: '#fff8f5',
            border: '1px solid #d3c4b8',
            borderRadius: 12,
            fontFamily: 'Lexend',
            fontSize: 12,
          }}
          cursor={{ fill: '#f2ddba', radius: 8 }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Agendamentos">
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.count === max ? '#624325' : '#f2ddba'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
