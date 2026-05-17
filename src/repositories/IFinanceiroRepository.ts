import { 
  FinanceiroSummary, 
  PeriodDataPoint, 
  Granularity, 
  MethodData, 
  TransactionFilters, 
  Transaction, 
  PaginatedResult 
} from "@/types/financeiro";

export interface IFinanceiroRepository {
  getSummary(startDate: Date, endDate: Date): Promise<FinanceiroSummary>;
  getByPeriod(startDate: Date, endDate: Date, granularity: Granularity): Promise<PeriodDataPoint[]>;
  getByMethod(startDate: Date, endDate: Date): Promise<MethodData[]>;
  getTransactions(filters: TransactionFilters): Promise<PaginatedResult<Transaction>>;
}
