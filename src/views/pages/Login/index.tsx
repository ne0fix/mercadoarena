import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ROUTES } from '../../../core/constants/config';
import { User, Lock, EyeOff, ArrowRight, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import logo from '../../../images/logo.svg';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[linear-gradient(135deg,#fff8f5_0%,#f6ece5_100%)]">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 sun-shadow border border-outline-variant/30"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-28 h-28 mb-4 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden shadow-sm border-4 border-surface-container">
            <img 
              alt="Arena Beach Logo" 
              className="w-full h-full object-cover" 
              src={logo}
            />
          </div>
          <h1 className="font-headline text-3xl text-primary text-center font-bold">Arena Beach Serra</h1>
          <p className="text-on-surface-variant text-center mt-1 text-sm">Sua dose diária de esporte e pé na areia.</p>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="font-headline text-2xl text-on-surface font-bold">Bem-vindo</h2>
          <p className="font-headline text-xs text-outline uppercase tracking-widest font-bold">Acesse sua conta para agendar</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email/CPF Input */}
          <div className="relative group">
            <label className="absolute -top-2.5 left-3 px-1 bg-surface-container-lowest font-headline text-[10px] items-center font-bold text-outline group-focus-within:text-primary transition-colors">E-mail ou CPF</label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-transparent">
              <User className="text-outline mr-3 w-5 h-5" />
              <input 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface font-sans text-sm placeholder:text-outline-variant" 
                placeholder="seuemail@exemplo.com" 
                type="text"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative group">
            <label className="absolute -top-2.5 left-3 px-1 bg-surface-container-lowest font-headline text-[10px] font-bold text-outline group-focus-within:text-primary transition-colors">Senha</label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-transparent">
              <Lock className="text-outline mr-3 w-5 h-5" />
              <input 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface font-sans text-sm placeholder:text-outline-variant" 
                placeholder="••••••••" 
                type="password"
                required
              />
              <button type="button" className="text-outline hover:text-primary transition-colors">
                <EyeOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 bg-transparent" />
              <span className="font-headline text-xs text-on-surface-variant group-hover:text-primary transition-colors font-medium">Lembrar de mim</span>
            </label>
            <button type="button" className="font-headline text-xs text-primary font-bold hover:underline decoration-2 underline-offset-4">Esqueceu a senha?</button>
          </div>

          <Button type="submit" className="w-full h-14" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Entrar
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
          <p className="text-on-surface-variant text-sm">
            Ainda não tem uma conta? 
            <button onClick={() => {}} className="text-primary font-bold hover:underline ml-1">Cadastre-se</button>
          </p>
        </div>
      </motion.main>

      <button className="mt-6 flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full cursor-pointer hover:bg-secondary-container transition-colors">
        <HelpCircle className="w-5 h-5 text-primary" />
        <span className="font-headline text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Precisa de ajuda com o acesso?</span>
      </button>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 right-0 -z-10 opacity-20 pointer-events-none">
        <svg fill="none" height="400" viewBox="0 0 400 400" width="400" xmlns="http://www.w3.org/2000/svg">
          <path d="M400 400H0C100 350 200 380 300 250C400 120 350 50 400 0V400Z" fill="#d8c4a2"></path>
        </svg>
      </div>
    </div>
  );
}
