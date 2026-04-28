import { Court, DayAvailability } from '../../models/entities/Court';
import { Booking } from '../../models/entities/Booking';

// Mock Data
const MOCK_COURTS: Court[] = [
  {
    id: '1',
    name: 'Quadra 01',
    description: 'Vôlei de Praia & Futevôlei - Areia Branca de altíssima qualidade.',
    pricePerHour: 80,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOMbajaKEzzrxV28ZQlnYpqi1-q5uZEAYjG7P-6lnIFty02dnxfFG7K1CNF5a9y5dn19VsPKtA5EbncUoEGrWhaU6nAr5IWQn-Ng0F-MjcMibVXTXz75CdY7Rri_PWOo8MmV-ZU_wlqBXGERm-siDAcEJGUBP4b4RI_J0OJkxSJen_JgbRRN6g39NPKrP3RKrYVJtIADYEeCDrP4BaeoEqkvaJOzrTYN2xB-F3SWAX09TTSBsC51gw_pc0SJecmiVRN72wUYyF9A',
    type: 'court',
    amenities: ['Ducha', 'Iluminação Profissional'],
    maxPlayers: 12,
    location: 'Arena Central',
  },
  {
    id: '2',
    name: 'Quadra 02',
    description: 'Beach Tennis Especial - Perfeita para competições e treinos intensos.',
    pricePerHour: 95,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqG-8IeFClXWUjwZPiIQhXlAW4SjkcIXNTdl3E7PKrzexHEEdSaLA9pDiYpPIGh83VrgjuAHoEAZw0elTfLz2fcJFNWM_oE0yktXMewyC_yaD6l15Ov_P9tJkZkRI6t1qqQa7LVqlLSJWhvfnLmXHEq0YbaVUVvrly9XQT9tL1nnAtG6zAfIajXbcdn6PnSZlNaEcYBl_rmPg20kqvuY-yUaM13sy00xr-NI4uiiXrJQQLDJ8mwgOClIB339TI2hBW__-T4Y35gA',
    type: 'court',
    amenities: ['Kit Raquetes', 'Bolas Incluso'],
    maxPlayers: 4,
    location: 'Setor Sul',
  },
  {
    id: '3',
    name: 'Laje BS',
    description: 'Reserve nosso espaço exclusivo no terraço para eventos corporativos, aniversários ou treinos fechados com vista para o mar.',
    pricePerHour: 0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9osfn84CNv_7dPvMp7XqFkJ_02qyN8guVXKlcY9Lc846HGucoRlg77buncKXS2nZcGTnzQB6JXv2j-ApngRCIwGS06Eeyj5F0meEKltsuZn2tgJjSol_Y0sleJilpO4MLdwtYFCbqei4DAa1g7qTob0ChCQv7DUDDwJh6bYUdJa8DJDEdjZ0jze-2jgWXsk2TuqXd8_r2QuUKT5F0lTtIrrCyOckemGkAyiFatrt9eVXmyRqj7SWsK-cOzeEFezzHxFPzDjtXvQ',
    type: 'exclusive',
    amenities: ['Open Bar opcional', 'Som Ambiente', 'Vista Panorâmica'],
    maxPlayers: 50,
    location: 'Rooftop',
  },
];

export const bookingService = {
  getCourts: async (): Promise<Court[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_COURTS;
  },

  getCourtById: async (id: string): Promise<Court | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_COURTS.find((court) => court.id === id);
  },

  getAvailability: async (courtId: string, date: string): Promise<DayAvailability> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const hours = ['06:00', '07:00', '08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    return {
      date,
      slots: hours.map((time) => ({
        time,
        available: Math.random() > 0.3, // Randomly mock availability
      })),
    };
  },

  createBooking: async (data: Partial<Booking>): Promise<Booking> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: Math.random().toString(36).substr(2, 9),
      courtId: data.courtId!,
      date: data.date!,
      timeSlot: data.timeSlot!,
      userId: 'user-123',
      totalValue: data.totalValue!,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
  },
};
