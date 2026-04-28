import React from 'react';
import { useHomeViewModel } from '../../../viewmodels/useHomeViewModel';
import { Layout } from '../../components/layout/Layout';
import { CourtCard } from '../../components/business/CourtCard';
import { Loader } from '../../components/common/Loader';
import { motion } from 'motion/react';

export default function HomePage() {
  const { courts, loading, error } = useHomeViewModel();

  return (
    <Layout>
      <section className="px-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1 mb-8">
          <span className="font-headline text-[10px] text-primary uppercase tracking-widest font-bold">
            Escolha seu espaço
          </span>
          <h2 className="font-headline text-3xl text-on-surface font-bold tracking-tight">
            Quadras Disponíveis
          </h2>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="p-8 text-center bg-error-container text-on-error-container rounded-xl">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courts.map((court, index) => (
              <motion.div
                key={court.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CourtCard court={court} />
              </motion.div>
            ))}
          </div>
        )}

        <section className="mt-12">
          <h3 className="font-headline text-xl text-on-surface mb-6 font-bold">Resumo do Dia</h3>
          <div className="bg-surface-container rounded-2xl p-6 overflow-hidden sun-shadow">
            <div className="flex gap-4 overflow-x-auto pb-4 court-scrollbar">
              {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((h) => (
                <div key={h} className="flex flex-col items-center gap-2 min-w-[60px]">
                  <div 
                    className="w-full rounded-t-lg bg-primary/20" 
                    style={{ height: `${Math.random() * 80 + 20}px` }} 
                  />
                  <span className="font-headline text-[10px] text-on-surface-variant font-bold">
                    {h.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </Layout>
  );
}
