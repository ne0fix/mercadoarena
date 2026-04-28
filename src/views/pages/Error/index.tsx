import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../../core/constants/config';
import { AlertCircle, RefreshCw, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-surface-container-lowest rounded-[40px] p-10 sun-shadow border border-outline-variant/30 flex flex-col items-center text-center"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-500/10 rounded-full scale-150 blur-3xl" />
            <div className="relative w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h2 className="font-headline text-3xl text-on-background mb-4 font-bold">
            Ops! Ocorreu um erro
          </h2>
          
          <p className="text-on-surface-variant mb-10 text-sm leading-relaxed">
            Não conseguimos processar o seu pagamento. Verifique se há saldo insuficiente ou se os dados do cartão estão corretos e tente novamente.
          </p>

          <div className="bg-surface-container-low rounded-2xl px-5 py-4 mb-10 flex items-center gap-4 w-full border border-outline-variant/20">
            <AlertCircle className="w-5 h-5 text-on-surface-variant" />
            <span className="font-headline text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              Código do erro: TRANS_DENIED_042
            </span>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Button 
              className="w-full h-14" 
              onClick={() => navigate(ROUTES.PAYMENT)}
              leftIcon={<RefreshCw className="w-5 h-5" />}
            >
              Tentar Novamente
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full h-14"
              leftIcon={<Smartphone className="w-5 h-5" />}
              onClick={() => navigate(ROUTES.CONTACT)}
            >
              Falar com Suporte
            </Button>
          </div>
        </motion.div>
      </main>
    </Layout>
  );
}
