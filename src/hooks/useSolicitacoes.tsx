import { useQuery } from '@tanstack/react-query';
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
  // Busca todas as solicitações usando react-query
  const { data: solicitacoes = [], isLoading: loading, error, refetch: fetchSolicitacoes } = useQuery<Solicitacao[]>({
    queryKey: ['solicitacoes'],
    queryFn: async () => {
      console.log('useSolicitacoes: Buscando solicitações...');
      try {
        const response = await axios.get('/api/solicitacoes');
        console.log('useSolicitacoes: Resposta da API:', response.data);
        return response.data;
      } catch (err) {
        console.error('Erro ao buscar solicitações:', err);
        throw err;
      }
    }
  });

  return { solicitacoes, loading, error, fetchSolicitacoes };
}; 