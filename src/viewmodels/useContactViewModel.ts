import { whatsappService } from '../services/whatsapp/whatsappService';

export const useContactViewModel = () => {
  const handleContactWhatsApp = (locationName: string) => {
    const text = `Olá! Gostaria de saber mais informações sobre a locação do espaço ${locationName}.`;
    whatsappService.openChat(text);
  };

  return {
    handleContactWhatsApp,
  };
};
