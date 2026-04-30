'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, subDays } from 'date-fns'
import type { Period } from './useDashboardViewModel'

export function useReportsViewModel() {
  const [period, setPeriod] = useState<Period>('monthly')
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [courtFilter, setCourtFilter] = useState('')

  const params = new URLSearchParams({ startDate, endDate, period })
  if (courtFilter) params.set('courtId', courtFilter)

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['admin-reports', startDate, endDate, courtFilter, period],
    queryFn: () => fetch(`/api/admin/reports?${params.toString()}`).then((r) => r.json()),
  })

  const exportCsv = async () => {
    const res = await fetch(`/api/admin/reports?${params.toString()}&format=csv`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${startDate}-${endDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    courtFilter,
    setCourtFilter,
    reportData,
    isLoading,
    exportCsv,
  }
}
