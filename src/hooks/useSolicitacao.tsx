import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import type { Solicitacao } from './useSolicitacoes';

// Reutiliza a interface Solicitacao do useSolicitacoes para consistência
interface Solicitacao {
  id: string;
  titulo: string;
  categoria_id: string;
  categoria: { nome: string };
  prioridade: 'baixa' | 'media' | 'alta';
  cliente_id: string;
  cliente: { nome: string };
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  data_prazo: string;
  data_conclusao?: string;
  descricao: string;
  created_at: string;
  updated_at: string;
}

export const useSolicitacao = (id?: string) => {
  const { toast } = useToast();

  const { data: solicitacao, isLoading, error, refetch } = useQuery<Solicitacao>(
    ['solicitacao', id],
    async () => {
      if (!id) return undefined;
      try {
        console.log(`useSolicitacao: Buscando solicitação com ID: ${id}`);
        const response = await axios.get(`/api/solicitacoes/${id}`); // Corrigido para /api
        console.log('useSolicitacao: Resposta da API:', response.data);
        return response.data;
      } catch (err) {
        console.error(`Erro ao buscar solicitação ${id}:`, err);
        toast({
          title: 'Erro',
          description: `Falha ao carregar solicitação ${id}.`,
          variant: 'destructive',
        });
        throw err;
      }
    },
    { enabled: !!id } // Só executa a query se o ID estiver disponível
  );

  return { solicitacao, isLoading, error, refetch };
}; 