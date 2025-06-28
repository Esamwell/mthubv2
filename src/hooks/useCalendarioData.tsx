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
          const response = await axios.get(`/api/solicitacoes`);
          console.log('useCalendarioData: Resposta da API:', response.data);
          // Filtra solicitações do mês/ano selecionados
          return response.data.filter((sol: any) => {
            if (!sol.data_prazo) return false;
            // Força horário zero para datas no formato YYYY-MM-DD
            const data = new Date(sol.data_prazo.length === 10 ? sol.data_prazo + 'T00:00:00' : sol.data_prazo);
            console.log('Comparando:', data, 'com mês:', month, 'e ano:', year);
            return data.getMonth() === month && data.getFullYear() === year;
          });
        } catch (err) {
          console.error('Erro ao buscar eventos do calendário:', err);
          throw err;
        }
      },
    }
  );

  return { eventos, isLoading, error, refetch };
}; 