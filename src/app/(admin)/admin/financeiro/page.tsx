"use client";

import { useFinanceiroViewModel } from "@/viewmodels/admin/useFinanceiroViewModel";
import { SummaryCards } from "@/views/components/admin/financeiro/SummaryCards";
import { ProcessingAlert } from "@/views/components/admin/financeiro/ProcessingAlert";
import { TransactionTable } from "@/views/components/admin/financeiro/TransactionTable";
import { TransactionDetailDrawer } from "@/views/components/admin/financeiro/TransactionDetailDrawer";
import { RevenuePeriodChart } from "@/views/components/admin/financeiro/RevenuePeriodChart";
import { PaymentMethodBreakdown } from "@/views/components/admin/financeiro/PaymentMethodBreakdown";
import { Calendar, Search, Download, Filter } from "lucide-react";

export default function FinanceiroPage() {
  const vm = useFinanceiroViewModel();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-black text-3xl text-on-surface">Gestão Financeira</h1>
          <p className="text-on-surface-variant font-medium">Acompanhe a saúde financeira da sua arena em tempo real.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-1 flex items-center gap-1">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <Calendar size={16} className="text-primary" />
              <input
                type="date"
                value={vm.startDate}
                onChange={(e) => vm.setStartDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface focus:outline-none"
              />
            </div>
            <div className="text-outline-variant">/</div>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <input
                type="date"
                value={vm.endDate}
                onChange={(e) => vm.setEndDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface focus:outline-none"
              />
            </div>
          </div>

          <a
            href={`/api/admin/financeiro/transactions/export?startDate=${vm.startDate}&endDate=${vm.endDate}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl font-headline font-bold text-xs uppercase tracking-widest hover:bg-surface-container transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </a>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards data={vm.summary} loading={vm.loadingSummary} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenuePeriodChart
          data={vm.periodData?.data || []}
          granularity={vm.granularity}
          loading={vm.loadingPeriod}
        />
        <PaymentMethodBreakdown
          data={vm.methodData?.methods || []}
          loading={vm.loadingMethod}
        />
      </div>

      {/* Processing Alert */}
      <ProcessingAlert transactions={vm.processingTransactions} />

      {/* Main Content Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-black text-xl text-on-surface">Central de Transações</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input
                type="text"
                placeholder="Buscar cliente ou ID..."
                value={vm.filters.search || ""}
                onChange={(e) => vm.handleFilterChange({ search: e.target.value, page: 1 })}
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button className="p-2.5 bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl hover:bg-surface-container transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <TransactionTable
          transactions={vm.transactionsResult?.data || []}
          pagination={vm.transactionsResult?.pagination || { page: 1, pageSize: 20, total: 0, totalPages: 0 }}
          loading={vm.loadingTransactions}
          onPageChange={vm.handlePageChange}
          onFilterChange={vm.handleFilterChange}
          onSelect={vm.handleSelectTransaction}
          onRefund={vm.handleRefund}
          currentStatus={vm.filters.status?.[0]}
        />
      </div>

      {/* Detail Drawer */}
      <TransactionDetailDrawer
        transaction={vm.selectedTransaction}
        open={vm.isDrawerOpen}
        onClose={vm.handleCloseDrawer}
        onRefund={vm.handleRefund}
      />
    </div>
  );
}
