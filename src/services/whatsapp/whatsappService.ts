import { CONFIG } from '../../core/constants/config';

export const whatsappService = {
  getTertiaryLink: (text: string) => {
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedText}`;
  },

  openChat: (text: string) => {
    const url = whatsappService.getTertiaryLink(text);
    window.open(url, '_blank', 'noreferrer');
  },
};
