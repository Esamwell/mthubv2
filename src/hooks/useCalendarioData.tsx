import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface EventoCalendario {
  id: string;
  titulo: string;
  start: string;
  end: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em andamento' | 'concluido';
  cliente_nome: string;
}

export const useCalendarioData = (month: number, year: number) => {
  const { data: eventos = [], isLoading, error, refetch } = useQuery<EventoCalendario[]>(
    {
      queryKey: ['eventosCalendario', month, year],
      queryFn: async () => {
        console.log(`useCalendarioData: Buscando eventos para o mês ${month + 1} e ano ${year}...`);
        try {
          const response = await axios.get(`/api/solicitacoes-calendario?month=${month + 1}&year=${year}`); // Corrigido para /api
          console.log('useCalendarioData: Resposta da API:', response.data);
          return response.data;
        } catch (err) {
          console.error('Erro ao buscar eventos do calendário:', err);
          throw err;
        }
      },
    }
  );

  return { eventos, isLoading, error, refetch };
}; 