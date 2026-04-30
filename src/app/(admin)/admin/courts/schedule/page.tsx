'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Plus, Trash2, Save, X } from 'lucide-react'
import { Button } from '@/views/components/ui/Button'
import { cn } from '@/core/utils/helpers'

const DEFAULT_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00'
]

export default function CourtSchedulePage() {
  const router = useRouter()
  const [slots, setSlots] = useState(DEFAULT_SLOTS)
  const [newSlot, setNewSlot] = useState('')

  const addSlot = () => {
    if (newSlot && !slots.includes(newSlot)) {
      setSlots([...slots].sort())
      setNewSlot('')
    }
  }

  const removeSlot = (slot: string) => {
    setSlots(slots.filter(s => s !== slot))
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-surface-container rounded-full">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <div>
          <h1 className="font-headline text-xl text-on-surface font-bold">Configurar Horários</h1>
          <p className="font-headline text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
            Quadra 01
          </p>
        </div>
      </header>

      <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 sun-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-base text-on-surface font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Horários de Funcionamento
          </h3>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">
            {slots.length} Slots
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
          {slots.map((slot) => (
            <div key={slot} className="relative group">
              <div className="bg-surface-container border border-outline-variant/30 py-3 rounded-xl text-center font-headline text-sm font-bold text-on-surface">
                {slot}
              </div>
              <button 
                onClick={() => removeSlot(slot)}
                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="border-2 border-dashed border-outline-variant/30 rounded-xl flex items-center justify-center p-1">
             <input 
               type="time" 
               className="bg-transparent border-none p-0 w-full text-center font-headline text-xs font-bold outline-none"
               value={newSlot}
               onChange={(e) => setNewSlot(e.target.value)}
               onBlur={addSlot}
             />
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1" leftIcon={<Save className="w-5 h-5" />}>
            Salvar Alterações
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
        <p className="text-amber-800 text-xs font-medium leading-relaxed">
          <strong>Aviso:</strong> A remoção de um horário não cancela agendamentos já existentes para aquele slot. Certifique-se de tratar reservas pendentes antes de desativar um horário.
        </p>
      </div>
    </div>
  )
}
