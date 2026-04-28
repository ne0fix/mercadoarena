import React from 'react';
import { Home, Calendar, User, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../core/constants/config';
import { cn } from '../../../core/utils/helpers';

export const Footer: React.FC = () => {
  const items = [
    { icon: Home, label: 'Início', path: ROUTES.HOME },
    { icon: Calendar, label: 'Reservas', path: ROUTES.BOOKINGS },
    { icon: User, label: 'Perfil', path: ROUTES.PROFILE },
    { icon: MessageCircle, label: 'Suporte', path: ROUTES.CONTACT },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-t border-outline-variant/30 flex justify-between items-center px-4 md:px-8 py-3 rounded-t-3xl sun-shadow">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 px-2 py-2 transition-all active:scale-90 flex-1',
              isActive ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-primary'
            )
          }
        >
          <item.icon className="w-5 h-5 md:w-6 md:h-6" />
          <span className="font-headline text-[8px] md:text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </footer>
  );
};
