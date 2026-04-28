import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../../core/constants/config';
import { Mail, Phone, Calendar, Settings, LogOut, Star, CreditCard, Bell, Shield, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import profileImage from '../../../images/aristides.jpeg';

interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user] = useState<UserData>({
    name: 'Aristides Grangeiro',
    email: 'aristides@email.com',
    phone: '(11) 99999-9999',
    cpf: '***.123.456-**',
  });

  const menuItems = [
    { icon: Calendar, label: 'Minhas Reservas', path: ROUTES.BOOKINGS, color: 'text-primary' },
    { icon: CreditCard, label: 'Métodos de Pagamento', path: '/payment-methods', color: 'text-primary' },
    { icon: Bell, label: 'Notificações', path: '/notifications', color: 'text-primary' },
    { icon: Shield, label: 'Privacidade e Segurança', path: '/security', color: 'text-primary' },
    { icon: Settings, label: 'Configurações', path: '/settings', color: 'text-primary' },
    { icon: HelpCircle, label: 'Ajuda e Suporte', path: ROUTES.CONTACT, color: 'text-primary' },
  ];

  return (
    <Layout>
      <header className="px-6 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-headline font-bold text-lg text-primary tracking-tight">Meu Perfil</h1>
      </header>

      <main className="px-6 pb-40 max-w-4xl mx-auto">
        <section className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 sun-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <img 
                  src={profileImage} 
                  alt="Foto de Perfil" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-xl text-on-surface font-bold">{user.name}</h2>
                <p className="text-on-surface-variant text-sm flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  Cliente Premium
                </p>
              </div>
              <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <Settings className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
                <Mail className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">E-mail</p>
                  <p className="text-sm text-on-surface font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
                <Phone className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">Telefone</p>
                  <p className="text-sm text-on-surface font-medium">{user.phone}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mb-8">
          <h3 className="font-headline text-lg text-primary font-bold mb-4">Minha Conta</h3>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.path.startsWith('http')) {
                    window.open(item.path, '_blank');
                  } else {
                    navigate(item.path);
                  }
                }}
                className="w-full flex items-center gap-4 p-4 border-b border-outline-variant/20 last:border-b-0 hover:bg-surface-container transition-colors"
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="flex-1 text-left font-headline text-sm text-on-surface font-medium">
                  {item.label}
                </span>
                <ChevronRight className="w-5 h-5 text-on-surface-variant" />
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-surface-container rounded-2xl p-6">
            <h3 className="font-headline text-lg text-primary font-bold mb-4">Precisa de ajuda?</h3>
            <p className="text-on-surface-variant text-sm mb-4">
              Nossa equipe está pronta para atender você. Entre em contato pelo WhatsApp.
            </p>
            <Button 
              variant="whatsapp" 
              className="w-full"
              onClick={() => navigate(ROUTES.CONTACT)}
            >
              Falar no WhatsApp
            </Button>
          </div>
        </section>

        <Button 
          variant="ghost" 
          className="w-full text-red-600"
          leftIcon={<LogOut className="w-5 h-5" />}
          onClick={() => navigate(ROUTES.LOGIN)}
        >
          Sair da Conta
        </Button>
      </main>
    </Layout>
  );
}