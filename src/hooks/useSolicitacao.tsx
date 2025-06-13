import { useState, useEffect } from 'react';
import axios from 'axios';

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

export const useSolicitacao = (id: string | undefined) => {
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolicitacao = async () => {
      if (!id) {
        setLoading(false);
        setError('ID da solicitação não fornecido.');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:4000/api/solicitacoes/${id}`);
        setSolicitacao(response.data as Solicitacao);
      } catch (err) {
        console.error(`Erro ao buscar solicitação ${id}:`, err);
        setError('Falha ao carregar detalhes da solicitação.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacao();
  }, [id]);

  return { solicitacao, loading, error };
}; 