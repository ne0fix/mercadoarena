import React from 'react';
import { Court } from '../../../models/entities/Court';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MapPin, Users, ArrowRight, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import { useContactViewModel } from '../../../viewmodels/useContactViewModel';
import { useNavigate } from 'react-router-dom';

interface CourtCardProps {
  court: Court;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court }) => {
  const { handleContactWhatsApp } = useContactViewModel();
  const navigate = useNavigate();

  const isExclusive = court.type === 'exclusive';

  return (
    <Card className="flex flex-col group h-full">
      <div className="relative h-56 overflow-hidden">
        <img
          src={court.image}
          alt={court.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isExclusive ? (
           <div className="absolute top-4 right-4 z-10">
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-headline text-[10px] font-bold uppercase tracking-widest border border-amber-200">
              Exclusivo
            </span>
          </div>
        ) : (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-headline text-[10px] text-primary flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Disponível agora
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-headline text-xl text-on-surface mb-1">{court.name}</h3>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-headline text-xs font-medium">{court.location}</span>
            </div>
          </div>
          {!isExclusive && (
            <div className="text-right">
              <span className="font-headline text-[10px] text-on-surface-variant block uppercase">A partir de</span>
              <span className="font-headline text-lg text-primary font-bold">{formatCurrency(court.pricePerHour)}</span>
            </div>
          )}
        </div>

        <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
          {court.description}
        </p>

        <div className="mt-auto">
          {isExclusive ? (
            <Button
              variant="whatsapp"
              className="w-full"
              leftIcon={<MessageCircle className="w-5 h-5" />}
              onClick={() => handleContactWhatsApp(court.name)}
            >
              Falar no WhatsApp
            </Button>
          ) : (
            <Button
              className="w-full"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => navigate(`/booking/${court.id}`)}
            >
              Agendar Horário
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
