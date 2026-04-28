export interface Court {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  image: string;
  type: 'court' | 'exclusive';
  amenities: string[];
  maxPlayers: number;
  location: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DayAvailability {
  date: string;
  slots: TimeSlot[];
}
