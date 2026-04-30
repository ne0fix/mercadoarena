'use client'

import { ArrowLeft, Calendar, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Button } from '@/views/components/ui/Button'
import { Loader } from '@/views/components/ui/Loader'
import { BookingCard } from '@/views/components/business/BookingCard'
import { useMyBookingsViewModel } from '@/viewmodels/client/useMyBookingsViewModel'
import { cn } from '@/core/utils/helpers'

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'upcoming', label: 'Próximas' },
  { key: 'past', label: 'Passadas' },
  { key: 'cancelled', label: 'Canceladas' },
] as const

export default function BookingsPage() {
  const router = useRouter()
  const vm = useMyBookingsViewModel()

  return (
    <>
      <header className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-headline font-bold text-lg text-primary tracking-tight">Minhas Reservas</h1>
      </header>

      <main className="w-full px-6 pb-24 md:pb-12 max-w-4xl mx-auto overflow-x-hidden">
        <section className="mb-6 -mx-6 px-6">
          <div className="flex gap-2 overflow-x-auto pb-2 court-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => vm.setFilter(f.key)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full font-headline text-sm font-medium transition-all',
                  vm.filter === f.key
                    ? 'bg-primary text-white sun-shadow'
                    : 'bg-surface-container text-on-surface-variant border border-outline-variant/30'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {vm.isLoading ? (
          <Loader />
        ) : vm.filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-on-surface-variant" />
            </div>
            <h3 className="font-headline text-xl text-on-surface font-bold mb-2">Nenhuma reserva</h3>
            <p className="text-on-surface-variant text-sm mb-6">Você ainda não fez nenhuma reserva.</p>
            <Button className="w-full" onClick={() => router.push('/')}>
              Agendar Agora
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {vm.filtered.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <BookingCard
                  booking={booking}
                  onCancel={(id) => vm.cancelBooking(id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        <section className="mt-8">
          <Button
            variant="outline"
            className="w-full"
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => router.push('/')}
          >
            Nova Reserva
          </Button>
        </section>
      </main>
    </>
  )
}
