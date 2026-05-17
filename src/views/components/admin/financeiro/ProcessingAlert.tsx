import { Transaction } from "@/types/financeiro";
import { AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/core/utils/formatCurrency";

interface ProcessingAlertProps {
  transactions: Transaction[];
}

export function ProcessingAlert({ transactions }: ProcessingAlertProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-2 text-amber-800 mb-3">
        <AlertTriangle size={20} />
        <h3 className="font-headline font-bold text-sm">
          {transactions.length} transaç{transactions.length > 1 ? "ões" : "ão"} aguardando confirmação do gateway
        </h3>
      </div>

      <div className="space-y-2">
        {transactions.map((t) => {
          const waitingTime = formatDistanceToNow(new Date(t.createdAt), {
            locale: ptBR,
            addSuffix: true,
          });
          const isOverdue = new Date().getTime() - new Date(t.createdAt).getTime() > 2 * 60 * 60 * 1000;

          return (
            <div
              key={t.id}
              className="flex items-center justify-between bg-white/50 border border-amber-100 rounded-xl p-3 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-xs font-mono text-on-surface-variant">#{t.id.slice(0, 8)}</div>
                <div className="text-sm font-bold text-on-surface">{t.booking.user.name}</div>
                <div className="text-sm text-on-surface-variant font-medium">
                  {formatCurrency(t.amount)}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <Clock size={14} className={isOverdue ? "text-red-500" : ""} />
                  <span className={isOverdue ? "text-red-600 font-bold" : ""}>há {waitingTime}</span>
                  {isOverdue && <AlertTriangle size={14} className="text-red-500" />}
                </div>
                <button className="p-1 hover:bg-amber-100 rounded-lg transition-colors text-amber-700">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
