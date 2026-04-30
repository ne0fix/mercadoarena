'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCancelBookingViewModel(bookingId: string, onSuccess?: () => void) {
  const [reason, setReason] = useState('')
  const [refund, setRefund] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: cancel, isPending } = useMutation({
    mutationFn: async () => {
      if (!reason.trim()) throw new Error('Informe o motivo')
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, refund }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? 'Erro ao cancelar')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-bookings'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      qc.invalidateQueries({ queryKey: ['booking', bookingId] })
      onSuccess?.()
    },
  })

  return { reason, setReason, refund, setRefund, cancel, isPending }
}
