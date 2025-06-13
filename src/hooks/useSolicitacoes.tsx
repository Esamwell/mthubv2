import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface Solicitacao {
  id: string; // O id do Supabase é um string/UUID
  titulo: string;
  categoria_id: string; // id da categoria
  categoria: { nome: string }; // Nome da categoria para exibição
  prioridade: 'baixa' | 'media' | 'alta'; // Ajustado para corresponder ao enum do DB
  cliente_id: string; // id do cliente
  cliente: { nome: string }; // Nome do cliente para exibição
  status: 'pendente' | 'em andamento' | 'concluido'; // Ajustado para corresponder ao enum do DB
  data_prazo: string; // Data de entrega, formato de data
  data_conclusao?: string; // Pode ser nulo
  descricao: string;
  created_at: string;
  updated_at: string;
}

export const useSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/api/solicitacoes');
      if (Array.isArray(response.data)) {
        // O backend agora deve retornar os objetos aninhados para cliente e categoria
        setSolicitacoes(response.data as Solicitacao[]);
      } else {
        console.warn('Dados recebidos do backend não são um array:', response.data);
        setSolicitacoes([]); // Garante que é sempre um array
      }
    } catch (err) {
      console.error('Erro ao buscar solicitações:', err);
      setError('Falha ao carregar solicitações.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('useSolicitacoes: useEffect disparado, chamando fetchSolicitacoes');
    fetchSolicitacoes();
  }, [fetchSolicitacoes]);

  return { solicitacoes, loading, error, fetchSolicitacoes };
}; 