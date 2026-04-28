export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  BOOKING: '/booking/:id',
  PAYMENT: '/payment',
  CONTACT: '/contact',
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  SUCCESS: '/booking-success',
  ERROR: '/booking-error',
} as const;

export const CONFIG = {
  WHATSAPP_NUMBER: '5511999999999',
  CURRENCY: 'BRL',
  LOCALE: 'pt-BR',
} as const;
