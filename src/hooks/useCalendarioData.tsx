import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface SolicitacaoCalendario {
  id: string;
  titulo: string;
  data_prazo: string;
  prioridade: string;
  status: string;
  cliente: { nome: string };
  categoria: { nome: string };
}

export const useCalendarioData = (month: number, year: number) => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCalendario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/solicitacoes-calendario?month=${month + 1}&year=${year}`); // Corrigido o número da porta para 4000
      setSolicitacoes(response.data);
    } catch (err) {
      console.error('Erro ao buscar solicitações para o calendário:', err);
      setError('Falha ao carregar solicitações para o calendário.');
      setSolicitacoes([]); // Limpa os dados em caso de erro
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchSolicitacoes();
  }, [fetchSolicitacoes]);

  return { solicitacoes, loading, error, fetchSolicitacoes };
}; 