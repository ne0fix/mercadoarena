'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import type { Court, DayAvailability } from '@/models/entities/Court'

export function useBookingViewModel(courtId: string) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  const { data: court, isLoading: loadingCourt } = useQuery<Court>({
    queryKey: ['court', courtId],
    queryFn: () => fetch(`/api/courts/${courtId}`).then((r) => r.json()),
  })

  const dateStr = format(selectedDate, 'yyyy-MM-dd')

  const { data: availability, isLoading: loadingSlots } = useQuery<DayAvailability>({
    queryKey: ['availability', courtId, dateStr],
    queryFn: () =>
      fetch(`/api/courts/${courtId}/availability?date=${dateStr}`).then((r) => r.json()),
    enabled: !!courtId,
  })

  const handleDateChange = (day: Date) => {
    setSelectedDate(day)
    setSelectedSlot(null)
  }

  const handleSlotSelect = (time: string) => setSelectedSlot(time)

  const proceed = () => {
    if (!selectedSlot) return
    router.push(
      `/payment?courtId=${courtId}&date=${dateStr}&startTime=${selectedSlot}`
    )
  }

  return {
    court,
    days,
    selectedDate,
    selectedSlot,
    availability,
    loadingCourt,
    loadingSlots,
    handleDateChange,
    handleSlotSelect,
    proceed,
    goBack: () => router.back(),
  }
}
