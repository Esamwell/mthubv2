import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Solicitacao } from './useSolicitacoes'; // Reutiliza a interface Solicitacao

export const useRecentSolicitacoes = () => {
  const [recentSolicitacoes, setRecentSolicitacoes] = useState<Solicitacao[]>([]);
  const [loadingRecent, setLoadingRecent] = useState<boolean>(true);
  const [errorRecent, setErrorRecent] = useState<string | null>(null);

  const fetchRecentSolicitacoes = useCallback(async () => {
    setLoadingRecent(true);
    setErrorRecent(null);
    try {
      const response = await axios.get('http://localhost:4000/api/solicitacoes/recentes');
      if (Array.isArray(response.data)) {
        setRecentSolicitacoes(response.data as Solicitacao[]);
      } else {
        console.warn('Dados recebidos do backend para solicitações recentes não são um array:', response.data);
        setRecentSolicitacoes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar solicitações recentes:', err);
      setErrorRecent('Falha ao carregar solicitações recentes.');
    } finally {
      setLoadingRecent(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentSolicitacoes();
  }, [fetchRecentSolicitacoes]);

  return { recentSolicitacoes, loadingRecent, errorRecent, fetchRecentSolicitacoes };
}; 