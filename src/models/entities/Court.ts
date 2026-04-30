export type CourtType = 'REGULAR' | 'EXCLUSIVE'

export interface Court {
  id: string
  name: string
  description: string
  pricePerHour: number
  imageUrl: string | null
  type: CourtType
  amenities: string[]
  maxPlayers: number
  location: string
  isActive: boolean
  openTime: string
  closeTime: string
  slotDuration: number
  createdAt: Date
  updatedAt: Date
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface DayAvailability {
  date: string
  slots: TimeSlot[]
}
