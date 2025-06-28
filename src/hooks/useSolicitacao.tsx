import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Solicitacao } from './useSolicitacoes';

export const useSolicitacao = (id?: string) => {
  const { toast } = useToast();

  const { data: solicitacao, isLoading, error, refetch } = useQuery<Solicitacao>({
    queryKey: ['solicitacao', id],
    queryFn: async () => {
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
    enabled: !!id
  });

  return { solicitacao, isLoading, error, refetch };
}; 