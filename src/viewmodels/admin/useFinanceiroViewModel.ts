import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FinanceiroSummary, 
  FinanceiroByPeriod, 
  FinanceiroByMethod, 
  PaginatedResult, 
  Transaction, 
  TransactionFilters, 
  Granularity 
} from "@/types/financeiro";
import { format, startOfMonth, endOfMonth } from "date-fns";

export function useFinanceiroViewModel() {
  // State
  const [startDate, setStartDate] = useState<string>(format(startOfMonth(new Date()), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState<string>(format(endOfMonth(new Date()), "yyyy-MM-dd"));
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [filters, setFilters] = useState<Partial<TransactionFilters>>({
    page: 1,
    pageSize: 20,
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Queries
  const { data: summary, isLoading: loadingSummary } = useQuery<FinanceiroSummary>({
    queryKey: ["financeiro-summary", startDate, endDate],
    queryFn: () => fetch(`/api/admin/financeiro/summary?startDate=${startDate}&endDate=${endDate}`).then(res => res.json()),
  });

  const { data: periodData, isLoading: loadingPeriod } = useQuery<FinanceiroByPeriod>({
    queryKey: ["financeiro-by-period", startDate, endDate, granularity],
    queryFn: () => fetch(`/api/admin/financeiro/by-period?startDate=${startDate}&endDate=${endDate}&granularity=${granularity}`).then(res => res.json()),
  });

  const { data: methodData, isLoading: loadingMethod } = useQuery<FinanceiroByMethod>({
    queryKey: ["financeiro-by-method", startDate, endDate],
    queryFn: () => fetch(`/api/admin/financeiro/by-method?startDate=${startDate}&endDate=${endDate}`).then(res => res.json()),
  });

  const { data: transactionsResult, isLoading: loadingTransactions } = useQuery<PaginatedResult<Transaction>>({
    queryKey: ["financeiro-transactions", startDate, endDate, filters],
    queryFn: () => {
      const params = new URLSearchParams({
        startDate,
        endDate,
        page: filters.page?.toString() || "1",
        pageSize: filters.pageSize?.toString() || "20",
      });
      
      if (filters.status) params.append("status", filters.status.join(","));
      if (filters.method) params.append("method", filters.method.join(","));
      if (filters.search) params.append("search", filters.search);
      
      return fetch(`/api/admin/financeiro/transactions?${params.toString()}`).then(res => res.json());
    },
  });

  // Derived state
  const processingTransactions = useMemo(() => {
    return transactionsResult?.data.filter(t => t.status === "PROCESSING") || [];
  }, [transactionsResult]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<TransactionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleRefund = async (paymentId: string) => {
    // This will be implemented using the existing refund endpoint or a new one if needed
    // For now, let's just log it
    console.log("Refund requested for payment:", paymentId);
    // In a real app, we would call an API and then invalidate queries
    // queryClient.invalidateQueries({ queryKey: ["financeiro-transactions"] });
    // queryClient.invalidateQueries({ queryKey: ["financeiro-summary"] });
  };

  return {
    // State
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    granularity,
    setGranularity,
    filters,
    selectedTransaction,
    isDrawerOpen,
    
    // Data
    summary,
    periodData,
    methodData,
    transactionsResult,
    processingTransactions,
    
    // Loading
    loadingSummary,
    loadingPeriod,
    loadingMethod,
    loadingTransactions,
    
    // Handlers
    handleFilterChange,
    handlePageChange,
    handleSelectTransaction,
    handleCloseDrawer,
    handleRefund,
  };
}
