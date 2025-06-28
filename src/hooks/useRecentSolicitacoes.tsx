import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Solicitacao } from './useSolicitacoes'; // Reutiliza a interface Solicitacao
import { useToast } from '@/hooks/use-toast'; // Corrigido o caminho do import

export const useRecentSolicitacoes = () => {
  const { toast } = useToast();

  const { data: recentSolicitacoes = [], isLoading: loadingRecent, error: errorRecent, refetch: fetchRecentSolicitacoes } = useQuery<Solicitacao[]>({
    queryKey: ['recentSolicitacoes'],
    queryFn: async () => {
      console.log('useRecentSolicitacoes: Buscando solicitações recentes...');
      try {
        const response = await axios.get('/api/solicitacoes/recentes');
        return response.data;
      } catch (err) {
        console.error('Erro ao buscar solicitações recentes:', err);
        throw err;
      }
    }
  });

  return { recentSolicitacoes, loadingRecent, errorRecent, fetchRecentSolicitacoes };
}; 