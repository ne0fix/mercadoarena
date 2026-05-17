"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { MethodData } from "@/types/financeiro";
import { formatCurrency } from "@/core/utils/formatCurrency";
import { Zap, CreditCard, Banknote, Barcode } from "lucide-react";
import { cn } from "@/core/utils/helpers";

interface PaymentMethodBreakdownProps {
  data: MethodData[];
  loading: boolean;
}

const COLORS = ["#624325", "#7d5a3a", "#9c7c5f", "#c4a484"];

export function PaymentMethodBreakdown({ data, loading }: PaymentMethodBreakdownProps) {
  if (loading) {
    return (
      <div className="h-[400px] w-full bg-surface-container-low rounded-2xl border border-outline-variant/30 animate-pulse flex items-center justify-center">
        <p className="text-on-surface-variant font-headline text-xs font-bold uppercase tracking-widest">Carregando dados...</p>
      </div>
    );
  }

  const chartData = data
    .filter((m) => m.gross > 0)
    .map((m) => ({
      name: m.label,
      value: m.gross,
    }));

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <h3 className="font-headline font-black text-lg text-on-surface mb-6">Pagamentos por Método</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Donut Chart */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  background: "#fff8f5",
                  border: "1px solid #d3c4b8",
                  borderRadius: 12,
                  fontFamily: "Lexend",
                  fontSize: 12,
                }}
              />
              <Legend verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Method Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((m) => (
            <MethodStatCard key={m.method} data={m} />
          ))}
          <MethodStatCard 
            data={{ label: "Boleto", gross: 0, count: 0, approvalRate: 0, averageTicket: 0, shareOfRevenue: 0, method: "PIX" as PaymentMethod, refunded: 0, totalAttempts: 0 }} 
            disabled 
          />
          <MethodStatCard 
            data={{ label: "Dinheiro", gross: 0, count: 0, approvalRate: 0, averageTicket: 0, shareOfRevenue: 0, method: "PIX" as PaymentMethod, refunded: 0, totalAttempts: 0 }} 
            disabled 
          />
        </div>
      </div>
    </div>
  );
}

function MethodStatCard({ data, disabled }: { data: MethodData; disabled?: boolean }) {
  const Icon = data.label === "PIX" ? Zap : (data.label === "Boleto" ? Barcode : (data.label === "Dinheiro" ? Banknote : CreditCard));

  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all",
      disabled 
        ? "bg-surface-container-low/50 border-outline-variant/10 opacity-50" 
        : "bg-surface-container-low/30 border-outline-variant/30 hover:bg-surface-container-low/50"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "p-2 rounded-lg",
          disabled ? "bg-on-surface-variant/10 text-on-surface-variant" : "bg-primary/10 text-primary"
        )}>
          <Icon size={16} />
        </div>
        {disabled && <span className="text-[8px] font-headline font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">Em breve</span>}
      </div>
      
      <p className="font-headline text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">{data.label}</p>
      
      {!disabled ? (
        <div className="space-y-1">
          <p className="text-sm font-black text-on-surface">{formatCurrency(data.gross)}</p>
          <div className="flex justify-between items-center text-[10px] font-medium text-on-surface-variant">
            <span>{data.count} transações</span>
            <span className="text-green-600 font-bold">{data.approvalRate.toFixed(0)}% apr.</span>
          </div>
        </div>
      ) : (
        <p className="text-sm font-bold text-on-surface-variant/40">---</p>
      )}
    </div>
  );
}
