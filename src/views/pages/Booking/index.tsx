import React from 'react';
import { useBookingViewModel } from '../../../viewmodels/useBookingViewModel';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { ArrowLeft, Calendar, Clock, MapPin, Users, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../core/utils/helpers';
import { motion } from 'motion/react';

export default function BookingPage() {
  const {
    court,
    availability,
    selectedDate,
    selectedTime,
    loading,
    bookingLoading,
    handleDateChange,
    handleTimeSelect,
    handleConfirmBooking,
    goBack,
  } = useBookingViewModel();

  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  if (loading && !court) return <Layout><Loader /></Layout>;
  if (!court) return <Layout><div className="p-8 text-center">Quadra não encontrada.</div></Layout>;

  return (
    <Layout>
      <header className="px-6 py-4 flex items-center gap-4">
        <button 
          onClick={goBack}
          className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-headline font-bold text-lg text-primary tracking-tight">Reservar Horário</h1>
      </header>

      <main className="px-6 pb-40 max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden sun-shadow mb-6">
            <img src={court.image} alt={court.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] uppercase font-bold rounded-full w-fit mb-2">
                {court.location}
              </span>
              <h2 className="text-white font-headline text-2xl font-bold">{court.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-6 text-on-surface-variant flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-headline text-xs font-bold">{court.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-headline text-xs font-bold">Até {court.maxPlayers} jogadores</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-headline text-lg text-primary font-bold">Selecione a Data</h3>
              <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">
                {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 court-scrollbar">
            {days.map((day) => {
              const isActive = format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateChange(day)}
                  className={cn(
                    "flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center transition-all",
                    isActive 
                      ? "bg-primary text-white sun-shadow scale-105" 
                      : "bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:border-primary/50"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase opacity-80">
                    {format(day, "EEE", { locale: ptBR })}
                  </span>
                  <span className="text-2xl font-bold my-1">{format(day, "dd")}</span>
                  <span className="text-[10px] font-semibold uppercase">{format(day, "MMM", { locale: ptBR })}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="font-headline text-lg text-primary mb-6 font-bold">Horários Disponíveis</h3>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {availability?.slots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={cn(
                      "py-3 px-2 rounded-xl border font-headline text-sm font-bold transition-all",
                      !slot.available && "bg-surface-container-low text-outline/50 border-outline-variant/20 cursor-not-allowed opacity-50",
                      slot.available && !isSelected && "bg-surface-container-lowest text-on-surface border-outline-variant/40 hover:bg-secondary-container hover:border-primary",
                      isSelected && "bg-primary text-white border-primary sun-shadow scale-105"
                    )}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {selectedTime && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 w-full p-6 z-[60] bg-surface/95 backdrop-blur-lg border-t border-outline-variant/30"
          >
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-surface-container-lowest border border-primary/10 p-4 rounded-2xl sun-shadow flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary-container rounded-xl text-primary">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Valor da Reserva</p>
                    <p className="font-headline text-xl text-primary font-bold">{formatCurrency(court.pricePerHour)}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Reserva para</p>
                   <p className="font-headline text-sm font-bold text-on-surface">
                     {format(selectedDate, "dd 'de' MMM", { locale: ptBR })}, {selectedTime}
                   </p>
                </div>
              </div>
              <Button 
                className="w-full h-14 text-lg"
                onClick={handleConfirmBooking}
                isLoading={bookingLoading}
              >
                Efetuar Pagamento
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </Layout>
  );
}
