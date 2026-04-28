import { create } from 'zustand';
import { Court } from '../../models/entities/Court';
import { Booking } from '../../models/entities/Booking';

interface AppState {
  courts: Court[];
  currentBooking: Partial<Booking> | null;
  setCourts: (courts: Court[]) => void;
  setCurrentBooking: (booking: Partial<Booking> | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  courts: [],
  currentBooking: null,
  setCourts: (courts) => set({ courts }),
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
}));
