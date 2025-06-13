import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

// Novo tipo para cliente baseado em profiles
type ClienteProfile = Tables<'profiles'>;

export const useClientes = () => {
  const { toast } = useToast();

  // Busca todos os perfis do tipo cliente
  const { data: clientes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'cliente')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ClienteProfile[];
    },
  });

  return {
    clientes,
    isLoading,
    error,
    refetch,
  };
};
