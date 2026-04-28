import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../app/store';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../../core/constants/config';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import { QrCode, CreditCard, Lock, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'motion/react';

type PaymentMethod = 'pix' | 'card';
type PaymentStep = 'select' | 'card-form' | 'confirm';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { currentBooking, courts } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [step, setStep] = useState<PaymentStep>('select');
  
  const court = courts.find(c => c.id === currentBooking?.courtId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!currentBooking) {
    navigate(ROUTES.HOME);
    return null;
  }

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
    window.scrollTo(0, 0);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    if (Math.random() > 0.9) {
      navigate(ROUTES.ERROR);
    } else {
      navigate(ROUTES.SUCCESS);
    }
  };

  const handleMethodChange = (newMethod: PaymentMethod) => {
    setMethod(newMethod);
    setStep('select');
  };

  return (
    <Layout>
      <main className="px-6 pb-40 max-w-2xl mx-auto">
        <section className="mb-8">
          <h2 className="font-headline text-3xl text-primary font-bold mb-1">Pagamento</h2>
          <p className="text-on-surface-variant text-sm">Selecione sua forma de pagamento preferida para confirmar sua reserva.</p>
        </section>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleMethodChange('pix')}
            className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
              method === 'pix' 
                ? 'bg-primary text-white sun-shadow' 
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary'
            }`}
          >
            {method === 'pix' && <Check className="w-4 h-4" />}
            <QrCode className="w-5 h-5" />
            <span className="font-headline font-bold">Pix</span>
          </button>
          <button
            onClick={() => handleMethodChange('card')}
            className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
              method === 'card' 
                ? 'bg-primary text-white sun-shadow' 
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary'
            }`}
          >
            {method === 'card' && <Check className="w-4 h-4" />}
            <CreditCard className="w-5 h-5" />
            <span className="font-headline font-bold">Cartão</span>
          </button>
        </div>

        {method === 'pix' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 sun-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <QrCode className="text-primary w-6 h-6" />
                </div>
                <h3 className="font-headline text-xl text-on-surface font-bold">Pagar com Pix</h3>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">Aprovação imediata</span>
            </div>
            
            <div className="bg-surface-container rounded-2xl p-6 text-center border border-dashed border-outline-variant">
              <p className="font-headline text-[10px] text-on-surface-variant mb-2 uppercase font-bold tracking-widest">Chave Pix Aleatória</p>
              <code className="block font-headline text-xs text-primary bg-white/80 py-3 px-4 rounded-xl mb-4 break-all font-bold">
                00020126580014br.gov.bcb.pix0136e3950b73-2d90-4e3a-9642-1e967a1496a7
              </code>
              <Button variant="secondary" className="w-full" leftIcon={<Copy className="w-5 h-5" />}>
                Copiar Código Pix
              </Button>
            </div>
          </motion.div>
        ) : step === 'confirm' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-surface-container-highest/50 rounded-3xl p-6 border border-outline-variant/20">
              <h3 className="font-headline text-xl text-primary font-bold mb-6">Resumo da Reserva</h3>
              <div className="relative w-full h-32 rounded-2xl mb-6 overflow-hidden sun-shadow">
                <img className="w-full h-full object-cover" src={court?.image} alt="Resumo" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white font-headline text-sm font-bold">{court?.name}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant font-medium">Data</span>
                  <span className="font-headline text-sm text-on-surface font-bold">
                    {format(new Date(currentBooking.date!), "EEE, dd 'de' MMM", { locale: ptBR })}
                  </span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant font-medium">Horário</span>
                  <span className="font-headline text-sm text-on-surface font-bold">{currentBooking.timeSlot}</span>
                </li>
                <li className="flex justify-between items-center pt-4">
                  <span className="font-headline text-xl text-on-surface font-bold">Total</span>
                  <span className="font-headline text-2xl text-primary font-black">{formatCurrency(currentBooking.totalValue!)}</span>
                </li>
              </ul>
              <Button 
                className="w-full h-14" 
                onClick={handleConfirmPayment}
                isLoading={loading}
              >
                Confirmar Pagamento
              </Button>
              <p className="text-center text-[10px] text-on-surface-variant mt-6 uppercase font-bold tracking-wider leading-relaxed">
                Ao finalizar, você concorda com nossos termos de uso e política de cancelamento.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 sun-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <CreditCard className="text-primary w-6 h-6" />
                </div>
                <h3 className="font-headline text-xl text-on-surface font-bold">Cartão de Crédito</h3>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleCardSubmit}>
              <div>
                <label className="block font-headline text-[10px] text-on-surface-variant mb-1 ml-1 font-bold uppercase">Número do Cartão</label>
                <input className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans transition-all" placeholder="0000 0000 0000 0000" />
              </div>
              <div>
                <label className="block font-headline text-[10px] text-on-surface-variant mb-1 ml-1 font-bold uppercase">Nome no Cartão</label>
                <input className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans transition-all uppercase" placeholder="JOÃO A. SILVA" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-[10px] text-on-surface-variant mb-1 ml-1 font-bold uppercase">Validade</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans transition-all" placeholder="MM/AA" />
                </div>
                <div>
                  <label className="block font-headline text-[10px] text-on-surface-variant mb-1 ml-1 font-bold uppercase">CVV</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans transition-all" placeholder="123" />
                </div>
              </div>
              <Button 
                type="submit"
                className="w-full h-14 mt-4" 
              >
                Finalizar Pagamento
              </Button>
            </form>
          </motion.div>
        )}

        <div className="flex items-center gap-2 p-4 text-on-surface-variant bg-surface-container-high/50 rounded-2xl">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Seu pagamento está em um ambiente seguro e criptografado.</span>
        </div>
      </main>
    </Layout>
  );
}