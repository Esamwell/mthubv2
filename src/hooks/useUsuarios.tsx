import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type UserProfile = Tables<'profiles'>;

export const useUsuarios = () => {
  const { toast } = useToast();

  const { data: usuarios = [], isLoading, error, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        toast({
          title: 'Erro ao carregar usuários',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      return data as UserProfile[];
    },
  });

  return {
    usuarios,
    isLoading,
    error,
    refetch,
  };
}; 