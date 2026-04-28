import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/api/bookingService';
import { useAppStore } from '../app/store';
import { Court } from '../models/entities/Court';

export const useHomeViewModel = () => {
  const { courts, setCourts } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getCourts();
      setCourts(data);
    } catch (err) {
      setError('Erro ao carregar quadras. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [setCourts]);

  useEffect(() => {
    if (courts.length === 0) {
      fetchCourts();
    }
  }, [courts.length, fetchCourts]);

  return {
    courts,
    loading,
    error,
    refreshCourts: fetchCourts,
  };
};
