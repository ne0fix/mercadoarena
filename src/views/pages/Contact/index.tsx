import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { whatsappService } from '../../../services/whatsapp/whatsappService';
import { MessageCircle, Phone, Mail, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  const navigate = useNavigate();

  const handleContact = (message: string) => {
    whatsappService.openChat(message);
  };

  return (
    <Layout>
      <header className="px-6 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-headline font-bold text-lg text-primary tracking-tight">Fale Conosco</h1>
      </header>

      <main className="px-6 pb-40 max-w-4xl mx-auto">
        <section className="mb-8">
          <h2 className="font-headline text-3xl text-primary font-bold mb-2">Como podemos ajudar?</h2>
          <p className="text-on-surface-variant text-sm">
            Escolha uma opção abaixo para entrar em contato com nossa equipe.
          </p>
        </section>

        <div className="space-y-4 mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => handleContact('Olá! Gostaria de fazer uma reserva ou tirar dúvidas sobre os horários disponíveis.')}
            className="w-full bg-whatsapp text-white p-6 rounded-2xl flex items-center gap-4 sun-shadow transition-all active:scale-95 hover:brightness-110"
          >
            <MessageCircle className="w-8 h-8" />
            <div className="text-left">
              <h3 className="font-headline text-lg font-bold">WhatsApp</h3>
              <p className="text-white/80 text-sm">Resposta rápida em minutos</p>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => window.open('tel:+5511999999999')}
            className="w-full bg-primary text-white p-6 rounded-2xl flex items-center gap-4 sun-shadow transition-all active:scale-95"
          >
            <Phone className="w-8 h-8" />
            <div className="text-left">
              <h3 className="font-headline text-lg font-bold">Ligação</h3>
              <p className="text-white/80 text-sm">(11) 99999-9999</p>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => window.open('mailto:contato@arenabeachpraia.com.br')}
            className="w-full bg-surface-container-high text-on-surface p-6 rounded-2xl flex items-center gap-4 border border-outline-variant/30 transition-all active:scale-95"
          >
            <Mail className="w-8 h-8 text-primary" />
            <div className="text-left">
              <h3 className="font-headline text-lg font-bold">E-mail</h3>
              <p className="text-on-surface-variant text-sm">contato@arenabeachpraia.com.br</p>
            </div>
          </motion.button>
        </div>

        <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="font-headline text-lg text-primary font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localização
          </h3>
          <p className="text-on-surface-variant text-sm mb-4">
            Arena Beach Serra - Av. Beira Mar, 1234<br />
            Praia de Bogotá, São Paulo - SP
          </p>
          <div className="bg-surface-container rounded-xl h-40 flex items-center justify-center">
            <span className="text-on-surface-variant text-sm">Ver no mapa</span>
          </div>
        </section>

        <section className="mt-6 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="font-headline text-lg text-primary font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horário de Funcionamento
          </h3>
          <div className="space-y-2 text-on-surface-variant text-sm">
            <p><span className="font-bold">Segunda a Sexta:</span> 06h00 às 22h00</p>
            <p><span className="font-bold">Sábado:</span> 06h00 às 23h00</p>
            <p><span className="font-bold">Domingo:</span> 06h00 às 21h00</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}