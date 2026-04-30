'use client'

import { Modal } from '@/views/components/ui/Modal'
import { Button } from '@/views/components/ui/Button'
import { useRefundViewModel } from '@/viewmodels/admin/useRefundViewModel'
import { formatCurrency } from '@/core/utils/formatCurrency'

interface RefundModalProps {
  bookingId: string
  maxAmount: number
  open: boolean
  onClose: () => void
}

export function RefundModal({ bookingId, maxAmount, open, onClose }: RefundModalProps) {
  const vm = useRefundViewModel(bookingId, maxAmount, onClose)

  return (
    <Modal open={open} onClose={onClose} title="Processar Estorno">
      <div className="space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-headline text-xs text-amber-800 font-bold uppercase tracking-wider">
            ⚠ Esta ação é irreversível
          </p>
        </div>

        <div>
          <p className="font-headline text-[10px] text-on-surface-variant font-bold uppercase mb-3">Tipo de Estorno</p>
          <div className="flex gap-3">
            <button
              onClick={() => vm.setIsPartial(false)}
              className={`flex-1 py-3 px-4 rounded-xl border font-headline text-sm font-bold transition-all ${!vm.isPartial ? 'bg-primary text-white border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}
            >
              Total
            </button>
            <button
              onClick={() => vm.setIsPartial(true)}
              className={`flex-1 py-3 px-4 rounded-xl border font-headline text-sm font-bold transition-all ${vm.isPartial ? 'bg-primary text-white border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}
            >
              Parcial
            </button>
          </div>
        </div>

        {vm.isPartial && (
          <div>
            <label className="block font-headline text-[10px] text-on-surface-variant font-bold uppercase mb-2">
              Valor do estorno (máx. {formatCurrency(maxAmount)})
            </label>
            <input
              type="number"
              value={vm.amount}
              onChange={(e) => vm.setAmount(Number(e.target.value))}
              max={maxAmount}
              min={0.01}
              step={0.01}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-sans text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        <div>
          <label className="block font-headline text-[10px] text-on-surface-variant font-bold uppercase mb-2">
            Motivo *
          </label>
          <textarea
            value={vm.reason}
            onChange={(e) => vm.setReason(e.target.value)}
            placeholder="Motivo do estorno..."
            rows={3}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-sans text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => vm.refund()}
            isLoading={vm.isPending}
          >
            Confirmar Estorno
          </Button>
        </div>
      </div>
    </Modal>
  )
}
