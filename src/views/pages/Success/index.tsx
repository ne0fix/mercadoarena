import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../app/store';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { CheckCircle, Calendar, Clock, MapPin, Share2, Home } from 'lucide-react';
import { ROUTES } from '../../../core/constants/config';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { currentBooking, courts } = useAppStore();
  
  const court = courts.find(c => c.id === currentBooking?.courtId);

  if (!currentBooking) {
    navigate(ROUTES.HOME);
    return null;
  }

  const accessCode = `AB-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(7).toUpperCase()}`;

  return (
    <Layout>
      <main className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col items-center justify-center py-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-secondary-container opacity-20 rounded-full scale-150 blur-3xl" />
          <div className="relative bg-surface-container-lowest sun-shadow w-24 h-24 rounded-full flex items-center justify-center border-4 border-surface-container">
            <CheckCircle className="w-12 h-12 text-primary" fill="currentColor" />
          </div>
        </motion.div>

        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl text-primary font-bold mb-2">Reserva Confirmada!</h1>
          <p className="text-on-surface-variant max-w-[280px] mx-auto text-sm leading-relaxed">
            Tudo pronto para o seu jogo. O Arena Beach Serra awaits você!
          </p>
        </div>

        <div className="w-full bg-surface-container-lowest rounded-3xl p-6 sun-shadow border border-surface-container-high relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-secondary-container p-3 rounded-2xl text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="font-headline text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Local e Quadra</p>
                <p className="font-headline text-lg text-primary font-bold">{court?.name || 'Quadra Central'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-surface-container pt-6">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-primary-container" />
                <div>
                  <p className="font-headline text-[10px] text-on-surface-variant uppercase font-bold">Data</p>
                  <p className="font-headline text-sm font-bold text-on-surface">
                    {format(new Date(currentBooking.date!), "dd 'de' MMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-primary-container" />
                <div>
                  <p className="font-headline text-[10px] text-on-surface-variant uppercase font-bold">Horário</p>
                  <p className="font-headline text-sm font-bold text-on-surface">{currentBooking.timeSlot}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface rounded-full shadow-inner" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface rounded-full shadow-inner" />
        </div>

        <div className="mt-8 w-full flex flex-col items-center py-6 border-2 border-dashed border-outline-variant rounded-3xl bg-surface-container/30">
          <p className="font-headline text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-2">Código de Acesso</p>
          <p className="font-headline text-2xl text-primary tracking-[0.2em] font-black uppercase">
            {accessCode}
          </p>
        </div>

        <div className="w-full mt-10 space-y-4">
          <Button 
            className="w-full h-14 text-lg"
            leftIcon={<Home className="w-6 h-6" />}
            onClick={() => navigate(ROUTES.HOME)}
          >
            Voltar ao Início
          </Button>
          <Button 
            variant="outline"
            className="w-full h-14 text-lg"
            leftIcon={<Share2 className="w-6 h-6" />}
            onClick={() => {
               if (navigator.share) {
                 navigator.share({
                   title: 'Minha Reserva - Arena Beach',
                   text: `Minha reserva para o dia ${currentBooking.date} às ${currentBooking.timeSlot} está confirmada!`,
                   url: window.location.href
                 });
               }
            }}
          >
            Compartilhar com Amigos
          </Button>
        </div>
      </main>
    </Layout>
  );
}
