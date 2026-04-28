import React from 'react';
import { Search } from 'lucide-react';
import logo from '../../../images/logo.svg';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
              <img 
               src={logo} 
               alt="Logo" 
               className="w-full h-full object-cover"
             />
        </div>
        <h1 className="font-headline font-bold text-lg text-primary tracking-tight">Arena Beach Serra</h1>
      </div>
      <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
        <Search className="w-6 h-6 text-primary" />
      </button>
    </header>
  );
};
