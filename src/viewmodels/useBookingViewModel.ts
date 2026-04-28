import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api/bookingService';
import { useAppStore } from '../app/store';
import { Court, DayAvailability } from '../models/entities/Court';
import { format } from 'date-fns';
import { ROUTES } from '../core/constants/config';

export const useBookingViewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCurrentBooking } = useAppStore();
  
  const [court, setCourt] = useState<Court | null>(null);
  const [availability, setAvailability] = useState<DayAvailability | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadCourtData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const courtData = await bookingService.getCourtById(id);
        if (courtData) {
          setCourt(courtData);
          const avail = await bookingService.getAvailability(id, format(selectedDate, 'yyyy-MM-dd'));
          setAvailability(avail);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCourtData();
  }, [id, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = async () => {
    if (!court || !selectedTime) return;

    setBookingLoading(true);
    try {
      const bookingData = {
        courtId: court.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedTime,
        totalValue: court.pricePerHour,
      };

      const result = await bookingService.createBooking(bookingData);
      setCurrentBooking(result);
      navigate(ROUTES.PAYMENT);
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  return {
    court,
    availability,
    selectedDate,
    selectedTime,
    loading,
    bookingLoading,
    handleDateChange,
    handleTimeSelect,
    handleConfirmBooking,
    goBack: () => navigate(-1),
  };
};
