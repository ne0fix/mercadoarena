'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useRefundViewModel(bookingId: string, maxAmount: number, onSuccess?: () => void) {
  const [reason, setReason] = useState('')
  const [amount, setAmount] = useState(maxAmount)
  const [isPartial, setIsPartial] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: refund, isPending } = useMutation({
    mutationFn: async () => {
      if (!reason.trim()) throw new Error('Informe o motivo do estorno')
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, reason, amount: isPartial ? amount : undefined }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? 'Erro ao processar estorno')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-bookings'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      qc.invalidateQueries({ queryKey: ['admin-payments'] })
      onSuccess?.()
    },
  })

  return { reason, setReason, amount, setAmount, isPartial, setIsPartial, refund, isPending }
}
