import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

interface Categoria {
  id: string; // UUID
  nome: string;
}

export const useCategorias = () => {
  const { toast } = useToast();

  const { data: categorias = [], isLoading, error } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('id, nome')
        .order('nome', { ascending: true });

      if (error) {
        toast({
          title: "Erro ao carregar categorias",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data as Categoria[];
    },
  });

  return {
    categorias,
    isLoading,
    error,
  };
}; 