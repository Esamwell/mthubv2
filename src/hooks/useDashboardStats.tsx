import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface DashboardStats {
  totalClientes: number;
  solicitacoesPendentes: number;
  solicitacoesEmAndamento: number;
  solicitacoesConcluidas: number;
}

export const useDashboardStats = () => {
  const { data: stats, isLoading, error, refetch } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      console.log('useDashboardStats: Buscando estatísticas do dashboard...');
      const [clientesRes, pendenteRes, emAndamentoRes, concluidaRes] = await Promise.all([
        axios.get('/api/counts/clientes'),
        axios.get('/api/counts/solicitacoes/pendente'),
        axios.get('/api/counts/solicitacoes/em_andamento'),
        axios.get('/api/counts/solicitacoes/concluida'),
      ]);

      return {
        totalClientes: clientesRes.data.count,
        solicitacoesPendentes: pendenteRes.data.count,
        solicitacoesEmAndamento: emAndamentoRes.data.count,
        solicitacoesConcluidas: concluidaRes.data.count,
      };
    },
  });

  return { stats, isLoading, error, refetch };
}; 