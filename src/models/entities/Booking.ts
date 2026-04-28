export interface Booking {
  id: string;
  courtId: string;
  date: string;
  timeSlot: string;
  userId: string;
  totalValue: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
