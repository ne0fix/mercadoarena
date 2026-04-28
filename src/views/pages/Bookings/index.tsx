import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { ROUTES } from '../../../core/constants/config';
import { Calendar, Clock, MapPin, Plus, ChevronRight, Clock3, XCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { format, isPast, isToday, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import { motion } from 'motion/react';

interface Booking {
  id: string;
  courtName: string;
  courtImage: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalValue: number;
  location: string;
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    courtName: 'Quadra 01',
    courtImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOMbajaKEzzrxV28ZQlnYpqi1-q5uZEAYjG7P-6lnIFty02dnxfFG7K1CNF5a9y5dn19VsPKtA5EbncUoEGrWhaU6nAr5IWQn-Ng0F-MjcMibVXTXz75CdY7Rri_PWOo8MmV-ZU_wlqBXGERm-siDAcEJGUBP4b4RI_J0OJkxSJen_JgbRRN6g39NPKrP3RKrYVJtIADYEeCDrP4BaeoEqkvaJOzrTYN2xB-F3SWAX09TTSBsC51gw_pc0SJecmiVRN72wUYyF9A',
    date: format(new Date(), 'yyyy-MM-dd'),
    timeSlot: '14:00',
    status: 'confirmed',
    totalValue: 80,
    location: 'Arena Central',
  },
  {
    id: '2',
    courtName: 'Quadra 02',
    courtImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqG-8IeFClXWUjwZPiIQhXlAW4SjkcIXNTdl3E7PKrzexHEEdSaLA9pDiYpPIGh83VrgjuAHoEAZw0elTfLz2fcJFNWM_oE0yktXMewyC_yaD6l15Ov_P9tJkZkRI6t1qqQa7LVqlLSJWhvfnLmXHEq0YbaVUVvrly9XQT9tL1nnAtG6zAfIajXbcdn6PnSZlNaEcYBl_rmPg20kqvuY-yUaM13sy00xr-NI4uiiXrJQQLDJ8mwgOClIB339TI2hBW__-T4Y35gA',
    date: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    timeSlot: '10:00',
    status: 'confirmed',
    totalValue: 95,
    location: 'Setor Sul',
  },
  {
    id: '3',
    courtName: 'Quadra 01',
    courtImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOMbajaKEzzrxV28ZQlnYpqi1-q5uZEAYjG7P-6lnIFty02dnxfFG7K1CNF5a9y5dn19VsPKtA5EbncUoEGrWhaU6nAr5IWQn-Ng0F-MjcMibVXTXz75CdY7Rri_PWOo8MmV-ZU_wlqBXGERm-siDAcEJGUBP4b4RI_J0OJkxSJen_JgbRRN6g39NPKrP3RKrYVJtIADYEeCDrP4BaeoEqkvaJOzrTYN2xB-F3SWAX09TTSBsC51gw_pc0SJecmiVRN72wUYyF9A',
    date: format(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    timeSlot: '16:00',
    status: 'cancelled',
    totalValue: 80,
    location: 'Arena Central',
  },
];

type FilterType = 'all' | 'upcoming' | 'past' | 'cancelled';

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);

  const getStatusConfig = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { icon: CheckCircle, label: 'Confirmada', color: 'text-green-600', bg: 'bg-green-50' };
      case 'pending':
        return { icon: Clock3, label: 'Pendente', color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'cancelled':
        return { icon: XCircle, label: 'Cancelada', color: 'text-red-600', bg: 'bg-red-50' };
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    if (filter === 'upcoming') return isFuture(bookingDate) && booking.status !== 'cancelled';
    if (filter === 'past') return isPast(bookingDate) && booking.status !== 'cancelled';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  return (
    <Layout>
      <header className="px-6 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-headline font-bold text-lg text-primary tracking-tight">Minhas Reservas</h1>
      </header>

      <main className="px-6 pb-40 max-w-4xl mx-auto">
        <section className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 court-scrollbar">
            {(['all', 'upcoming', 'past', 'cancelled'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-headline text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-primary text-white sun-shadow'
                    : 'bg-surface-container text-on-surface-variant border border-outline-variant/30'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'upcoming' ? 'Próximas' : f === 'past' ? 'Passadas' : 'Canceladas'}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <Loader />
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-on-surface-variant" />
            </div>
            <h3 className="font-headline text-xl text-on-surface font-bold mb-2">Nenhuma reserva</h3>
            <p className="text-on-surface-variant text-sm mb-6">
              Você ainda não fez nenhuma reserva.
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate(ROUTES.HOME)}
            >
              Agendar Agora
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              const bookingDate = new Date(booking.date);

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden sun-shadow"
                >
                  <div className="flex">
                    <div className="w-28 h-28 flex-shrink-0">
                      <img 
                        src={booking.courtImage} 
                        alt={booking.courtName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-headline text-lg text-on-surface font-bold">{booking.courtName}</h3>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusConfig.bg} ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant text-xs mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(bookingDate, "dd 'de' MMM", { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.timeSlot}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-headline font-bold">
                          {formatCurrency(booking.totalValue)}
                        </span>
                        {booking.status === 'confirmed' && isToday(bookingDate) && (
                          <Button 
                            variant="secondary" 
                            className="h-8 text-xs px-3"
                            onClick={() => navigate(`/booking/${booking.id}`)}
                          >
                            Jogar Agora
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <section className="mt-8">
          <Button 
            variant="outline" 
            className="w-full"
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => navigate(ROUTES.HOME)}
          >
            Nova Reserva
          </Button>
        </section>
      </main>
    </Layout>
  );
}