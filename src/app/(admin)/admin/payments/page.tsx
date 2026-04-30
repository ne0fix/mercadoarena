'use client'

import { TrendingUp, TrendingDown, DollarSign, CalendarDays, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { StatsCard } from '@/views/components/admin/StatsCard'
import { RevenueChart } from '@/views/components/admin/RevenueChart'
import { useReportsViewModel } from '@/viewmodels/admin/useReportsViewModel'
import { formatCurrency } from '@/core/utils/formatCurrency'
import { cn } from '@/core/utils/helpers'

const BALANCES = [
  { label: 'Hoje', value: 1240.50, delta: '+12%', type: 'up' },
  { label: 'Esta Semana', value: 8450.00, delta: '+5%', type: 'up' },
  { label: 'Este Mês', value: 32100.00, delta: '-2%', type: 'down' },
]

export default function AdminFinancialPage() {
  const vm = useReportsViewModel()
  const summary = vm.reportData?.summary

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-2xl text-on-surface font-bold">Balanço Financeiro</h1>
        <p className="font-headline text-xs text-on-surface-variant uppercase tracking-widest font-bold">
          Gestão de faturamento e fluxo de caixa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BALANCES.map((item) => (
          <div key={item.label} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 sun-shadow">
            <p className="font-headline text-[10px] text-on-surface-variant uppercase font-extrabold tracking-widest mb-1">{item.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="font-headline text-2xl text-primary font-black">{formatCurrency(item.value)}</h3>
              <div className={cn(
                "flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-bold",
                item.type === 'up' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}>
                {item.type === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {item.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatsCard title="Receita Bruta" value={formatCurrency(summary?.totalRevenue ?? 0)} icon={<TrendingUp className="w-5 h-5" />} color="success" />
        <StatsCard title="Estornos" value={formatCurrency(summary?.refundedAmount ?? 0)} icon={<TrendingDown className="w-5 h-5" />} color="danger" />
        <StatsCard title="Receita Líquida" value={formatCurrency(summary?.netRevenue ?? 0)} icon={<DollarSign className="w-5 h-5" />} color="primary" />
        <StatsCard title="Ticket Médio" value={formatCurrency(87.5)} icon={<CalendarDays className="w-5 h-5" />} color="primary" />
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 md:p-8 sun-shadow">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline text-lg text-on-surface font-bold">Faturamento Detalhado</h3>
          <select className="bg-surface-container border-none rounded-xl px-4 py-2 font-headline text-xs font-bold text-primary outline-none">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Este ano</option>
          </select>
        </div>
        <div className="h-[300px]">
          {vm.reportData?.chartData ? (
            <RevenueChart data={vm.reportData.chartData} />
          ) : (
            <div className="w-full h-full bg-surface-container animate-pulse rounded-2xl" />
          )}
        </div>
      </div>
    </div>
  )
}
