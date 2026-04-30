import { CONFIG } from '@/core/constants/config'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || ''

export class WhatsAppService {
  private number: string

  constructor(number = CONFIG.WHATSAPP_NUMBER) {
    this.number = number
  }

  getLink(text: string): string {
    return `https://wa.me/${this.number}?text=${encodeURIComponent(text)}`
  }

  openChat(text: string): void {
    window.open(this.getLink(text), '_blank')
  }

  getContactLink(): string {
    return this.getLink('Olá! Gostaria de mais informações sobre a Arena Beach Serra.')
  }

  getExclusiveLink(spaceName: string): string {
    return this.getLink(`Olá! Tenho interesse em agendar o espaço exclusivo "${spaceName}". Poderia me passar mais informações?`)
  }

  getSupportLink(bookingCode?: string): string {
    const msg = bookingCode
      ? `Olá! Preciso de suporte com minha reserva de código ${bookingCode}.`
      : 'Olá! Preciso de suporte com meu agendamento.'
    return this.getLink(msg)
  }
}

export const whatsAppService = new WhatsAppService()
