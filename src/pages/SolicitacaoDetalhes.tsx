import React from 'react';
// import { Layout } from '@/components/Layout'; // Remover esta importação
import { useSolicitacao } from '@/hooks/useSolicitacao';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface SolicitacaoDetalhesProps {
  id: string | undefined;
}

export const SolicitacaoDetalhes: React.FC<SolicitacaoDetalhesProps> = ({ id }) => {
  console.log('SolicitacaoDetalhes: ID recebido:', id);
  const { solicitacao, isLoading, error } = useSolicitacao(id);
  console.log('SolicitacaoDetalhes: Dados recebidos do hook:', solicitacao);

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-orange-100 text-orange-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Carregando detalhes da solicitação...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Erro ao carregar detalhes da solicitação: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Solicitação não encontrada ou não foi possível carregar os dados.<br/>Verifique se o ID está correto e se há dados no banco.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título
        </label>
        <Input
          value={solicitacao.titulo}
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo
        </label>
        <Select value={solicitacao.categoria?.nome || 'N/A'} disabled>
          <SelectTrigger>
            <SelectValue>{solicitacao.categoria?.nome || 'N/A'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={solicitacao.categoria?.nome || 'N/A'}>
              {solicitacao.categoria?.nome || 'N/A'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridade
          </label>
          <Select value={solicitacao.prioridade} disabled>
            <SelectTrigger>
              <SelectValue>{solicitacao.prioridade}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={solicitacao.prioridade}>
                {solicitacao.prioridade}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <Select value={solicitacao.status} disabled>
            <SelectTrigger>
              <SelectValue>{solicitacao.status}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={solicitacao.status}>
                {solicitacao.status}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cliente
        </label>
        <Select value={solicitacao.cliente?.nome || 'N/A'} disabled>
          <SelectTrigger>
            <SelectValue>{solicitacao.cliente?.nome || 'N/A'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={solicitacao.cliente?.nome || 'N/A'}>
              {solicitacao.cliente?.nome || 'N/A'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data de Entrega
        </label>
        <Input
          type="date"
          value={solicitacao.data_prazo && !isNaN(new Date(solicitacao.data_prazo).getTime()) ? new Date(solicitacao.data_prazo).toISOString().split('T')[0] : ''}
          readOnly
        />
      </div>
      {solicitacao.data_conclusao && !isNaN(new Date(solicitacao.data_conclusao).getTime()) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Concluído Em
          </label>
          <Input
            value={solicitacao.data_conclusao && !isNaN(new Date(solicitacao.data_conclusao).getTime()) ? new Date(solicitacao.data_conclusao).toLocaleDateString() : 'N/A'}
            readOnly
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <Textarea
          value={solicitacao.descricao || ''}
          readOnly
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Criado em
        </label>
        <Input
          value={solicitacao.created_at && !isNaN(new Date(solicitacao.created_at).getTime()) ? new Date(solicitacao.created_at).toLocaleString() : 'N/A'}
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Última atualização
        </label>
        <Input
          value={solicitacao.updated_at && !isNaN(new Date(solicitacao.updated_at).getTime()) ? new Date(solicitacao.updated_at).toLocaleString() : 'N/A'}
          readOnly
        />
      </div>
    </div>
  );
}; 