import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { whatsAppService } from '@/services/WhatsAppService'

export default function ContactPage() {
  return (
    <section className="px-6 py-6 pb-24 md:pb-12 max-w-2xl mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <span className="font-headline text-[10px] text-primary uppercase tracking-widest font-bold">
          Atendimento
        </span>
        <h2 className="font-headline text-3xl text-on-surface font-bold tracking-tight">Fale Conosco</h2>
      </div>

      <div className="space-y-4 mb-8">
        <a
          href={whatsAppService.getContactLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 bg-whatsapp text-white rounded-2xl sun-shadow transition-all hover:brightness-110 active:scale-95"
        >
          <div className="p-2 bg-white/20 rounded-xl">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-headline text-lg font-bold">WhatsApp</p>
            <p className="font-headline text-xs opacity-80 uppercase tracking-wider">Atendimento imediato</p>
          </div>
        </a>

        <a
          href="tel:+5511999999999"
          className="flex items-center gap-4 p-5 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl sun-shadow transition-all hover:border-primary active:scale-95"
        >
          <div className="p-2 bg-primary/10 rounded-xl">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-headline text-lg text-on-surface font-bold">Ligação</p>
            <p className="font-headline text-xs text-on-surface-variant uppercase tracking-wider">
              (11) 99999-9999
            </p>
          </div>
        </a>

        <a
          href="mailto:contato@arenabeachserra.com.br"
          className="flex items-center gap-4 p-5 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl sun-shadow transition-all hover:border-primary active:scale-95"
        >
          <div className="p-2 bg-primary/10 rounded-xl">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-headline text-lg text-on-surface font-bold">E-mail</p>
            <p className="font-headline text-xs text-on-surface-variant">contato@arenabeachserra.com.br</p>
          </div>
        </a>
      </div>

      <div className="bg-surface-container rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-headline text-sm text-on-surface font-bold">Localização</p>
            <p className="text-on-surface-variant text-sm">Av. Beira Mar, 1234 — Bogotá, SP</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-headline text-sm text-on-surface font-bold">Horário de Funcionamento</p>
            <p className="text-on-surface-variant text-sm">Seg–Sex: 6h–22h</p>
            <p className="text-on-surface-variant text-sm">Sábado: 6h–23h</p>
            <p className="text-on-surface-variant text-sm">Domingo: 6h–21h</p>
          </div>
        </div>
      </div>
    </section>
  )
}
