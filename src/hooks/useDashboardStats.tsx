import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface DashboardStats {
  totalClientes: number;
  solicitacoesPendentes: number;
  solicitacoesEmAndamento: number;
  solicitacoesConcluidas: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientesRes, pendentesRes, emAndamentoRes, concluidasRes] = await Promise.all([
        axios.get('http://localhost:4000/api/counts/clientes'),
        axios.get('http://localhost:4000/api/counts/solicitacoes/pendente'),
        axios.get('http://localhost:4000/api/counts/solicitacoes/em_andamento'),
        axios.get('http://localhost:4000/api/counts/solicitacoes/concluida'),
      ]);

      setStats({
        totalClientes: clientesRes.data.count,
        solicitacoesPendentes: pendentesRes.data.count,
        solicitacoesEmAndamento: emAndamentoRes.data.count,
        solicitacoesConcluidas: concluidasRes.data.count,
      });

    } catch (err) {
      console.error('Erro ao buscar estatísticas do dashboard:', err);
      setError('Falha ao carregar estatísticas do dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, fetchStats };
}; 