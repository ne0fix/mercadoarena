"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PeriodDataPoint, Granularity } from "@/types/financeiro";
import { formatCurrency } from "@/core/utils/formatCurrency";

interface RevenuePeriodChartProps {
  data: PeriodDataPoint[];
  granularity: Granularity;
  loading: boolean;
}

export function RevenuePeriodChart({ data, granularity, loading }: RevenuePeriodChartProps) {
  if (loading) {
    return (
      <div className="h-[350px] w-full bg-surface-container-low rounded-2xl border border-outline-variant/30 animate-pulse flex items-center justify-center">
        <p className="text-on-surface-variant font-headline text-xs font-bold uppercase tracking-widest">Carregando dados...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[350px] w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex items-center justify-center">
        <p className="text-on-surface-variant font-headline text-xs font-bold uppercase tracking-widest">Sem dados para este período</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <h3 className="font-headline font-black text-lg text-on-surface mb-6">Evolução da Receita</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d3c4b820" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontFamily: "Lexend", fontSize: 10, fill: "#82756b" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={(v) => `R$${v}`}
              tick={{ fontFamily: "Lexend", fontSize: 10, fill: "#82756b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), ""]}
              contentStyle={{
                background: "#fff8f5",
                border: "1px solid #d3c4b8",
                borderRadius: 12,
                fontFamily: "Lexend",
                fontSize: 12,
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: 4 }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: 20, fontSize: 10, fontFamily: "Lexend", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}
            />
            <Bar
              name="Receita Bruta"
              dataKey="gross"
              fill="#624325"
              radius={[4, 4, 0, 0]}
              barSize={granularity === "day" ? 20 : 40}
            />
            <Bar
              name="Estornos"
              dataKey="refunded"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              barSize={granularity === "day" ? 20 : 40}
            />
            <Line
              name="Receita Líquida"
              type="monotone"
              dataKey="net"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
