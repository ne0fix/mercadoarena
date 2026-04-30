import Image from 'next/image'
import Link from 'next/link'
import { PrismaCourtRepository } from '@/infrastructure/repositories/PrismaCourtRepository'
import { formatCurrency } from '@/core/utils/formatCurrency'
import { MapPin, Users, Clock } from 'lucide-react'

export const revalidate = 0

export default async function AdminCourtsPage() {
  const repo = new PrismaCourtRepository()
  const courts = await repo.findAll({ isActive: undefined })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl text-on-surface font-bold">Quadras</h1>
          <p className="font-headline text-xs text-on-surface-variant uppercase tracking-widest">
            {courts.length} quadras cadastradas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <div key={court.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden sun-shadow">
            <div className="relative h-40">
              {court.imageUrl ? (
                <Image src={court.imageUrl} alt={court.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary-container flex items-center justify-center">
                  <span className="font-headline text-primary text-3xl font-bold">{court.name[0]}</span>
                </div>
              )}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full font-headline text-[10px] font-bold uppercase ${court.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {court.isActive ? 'Ativa' : 'Inativa'}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-headline text-lg text-on-surface font-bold leading-tight">{court.name}</h3>
                  <p className="font-headline text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">{court.type}</p>
                </div>
                <span className="font-headline text-sm text-primary font-bold">
                  {court.pricePerHour > 0 ? `${formatCurrency(court.pricePerHour)}/h` : 'Gratuito'}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-headline text-xs font-medium">{court.location}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-headline text-xs font-medium">Até {court.maxPlayers} jogadores</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-headline text-xs font-medium">{court.openTime} – {court.closeTime}</span>
                </div>
              </div>

              <div className="mt-auto space-y-2">
                <Link href="/admin/courts/schedule" className="w-full bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2.5 rounded-xl font-headline text-[10px] font-bold uppercase transition-all tracking-wider text-center">
                  Gerenciar Horários
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-surface-container text-on-surface-variant hover:bg-outline-variant/30 px-3 py-2 rounded-xl font-headline text-[10px] font-bold uppercase transition-all">
                    Editar
                  </button>
                  <button className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl font-headline text-[10px] font-bold uppercase transition-all">
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
