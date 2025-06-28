import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, RefreshCw, Eye, Edit, Trash2 } from 'lucide-react';
import { useSolicitacoes } from '@/hooks/useSolicitacoes';
import { useClientes } from '@/hooks/useClientes';
import { useCategorias } from '@/hooks/useCategorias';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Solicitacao } from '@/hooks/useSolicitacoes';
import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';
import { SolicitacaoDetalhes } from '@/pages/SolicitacaoDetalhes';

export const Solicitacoes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { solicitacoes, loading, error, fetchSolicitacoes } = useSolicitacoes();
  const { clientes, isLoading: loadingClientes, error: errorClientes } = useClientes();
  const { categorias, isLoading: loadingCategorias, error: errorCategorias } = useCategorias();
  const { toast } = useToast();

  const [selectedType, setSelectedType] = useState('todos-tipos');
  const [selectedStatus, setSelectedStatus] = useState('todos-status');
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState<string | undefined>(undefined);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingSolicitacao, setEditingSolicitacao] = useState<Solicitacao | null>(null);

  const [isActionLoading, setIsActionLoading] = useState(false);

  console.log('Solicitacoes Component: loading', loading, 'error', error);
  console.log('Solicitacoes Component: loadingClientes', loadingClientes, 'errorClientes', errorClientes);
  console.log('Solicitacoes Component: loadingCategorias', loadingCategorias, 'errorCategorias', errorCategorias);

  const [newSolicitacao, setNewSolicitacao] = useState({
    titulo: '',
    categoria_id: '',
    prioridade: 'media',
    status: 'pendente',
    cliente_id: '',
    dataEntrega: '',
    descricao: '',
  });

  useEffect(() => {
    if (!isModalOpen) {
      setNewSolicitacao({
        titulo: '',
        categoria_id: '',
        prioridade: 'media',
        status: 'pendente',
        cliente_id: '',
        dataEntrega: '',
        descricao: '',
      });
      setIsEditing(false);
      setEditingSolicitacao(null);
    } else if (isEditing && editingSolicitacao) {
      setNewSolicitacao({
        titulo: editingSolicitacao.titulo || '',
        categoria_id: editingSolicitacao.categoria_id || '',
        prioridade: editingSolicitacao.prioridade || 'media',
        status: editingSolicitacao.status || 'pendente',
        cliente_id: editingSolicitacao.cliente_id || '',
        dataEntrega: editingSolicitacao.data_prazo ? new Date(editingSolicitacao.data_prazo).toISOString().split('T')[0] : '',
        descricao: editingSolicitacao.descricao || '',
      });
    }
  }, [isModalOpen, isEditing, editingSolicitacao]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSolicitacao(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewSolicitacao(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (solicitacao: Solicitacao) => {
    setIsEditing(true);
    setEditingSolicitacao(solicitacao);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
      try {
        await axios.delete(`/api/solicitacoes/${id}`);
        toast({
          title: "Sucesso!",
          description: "Solicitação excluída com sucesso.",
        });
        fetchSolicitacoes(); // Recarregar a lista
      } catch (err) {
        console.error(`Erro ao deletar solicitação ${id}:`, err);
        toast({
          title: "Erro",
          description: "Falha ao excluir solicitação. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveSolicitacao = async () => {
    setIsActionLoading(true);
    try {
      if (!newSolicitacao.titulo || !newSolicitacao.categoria_id || !newSolicitacao.cliente_id) {
        toast({
          title: "Campos obrigatórios",
          description: "Título, Tipo e Cliente são campos obrigatórios.",
          variant: "destructive",
        });
        setIsActionLoading(false);
        return;
      }

      // Padronizar status e dataEntrega
      const statusPadronizado = (() => {
        switch (newSolicitacao.status.toLowerCase().replace(/ /g, '_')) {
          case 'pendente': return 'pendente';
          case 'em_andamento':
          case 'em andamento': return 'em_andamento';
          case 'concluida':
          case 'concluído':
          case 'concluido': return 'concluida';
          case 'cancelada': return 'cancelada';
          default: return 'pendente';
        }
      })();
      const dataEntregaPadronizada = newSolicitacao.dataEntrega ? newSolicitacao.dataEntrega : null;

      const solicitacaoParaEnviar = {
        ...newSolicitacao,
        status: statusPadronizado,
        dataEntrega: dataEntregaPadronizada,
      };

      console.log('Enviando para edição/criação:', solicitacaoParaEnviar);

      if (isEditing && editingSolicitacao) {
        await axios.post(`/api/solicitacoes/${editingSolicitacao.id}`, {
          ...solicitacaoParaEnviar,
          _method: 'PUT',
        });
        toast({
          title: "Sucesso!",
          description: "Solicitação atualizada com sucesso.",
        });
      } else {
        await axios.post('/api/solicitacoes', solicitacaoParaEnviar);
        toast({
          title: "Sucesso!",
          description: "Solicitação criada com sucesso.",
        });
      }

      setNewSolicitacao({
        titulo: '',
        categoria_id: '',
        prioridade: 'media',
        status: 'pendente',
        cliente_id: '',
        dataEntrega: '',
        descricao: '',
      });
      setIsModalOpen(false);
      fetchSolicitacoes();
    } catch (err) {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} solicitação:`, err);
      toast({
        title: "Erro",
        description: `Falha ao ${isEditing ? 'atualizar' : 'criar'} solicitação. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

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
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = () => {
    fetchSolicitacoes();
  };

  const filteredSolicitacoes = (solicitacoes || []).filter(item => {
    const matchesSearchTerm = item.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos-tipos' || item.categoria_id === selectedType;
    const matchesStatus = selectedStatus === 'todos-status' || item.status === selectedStatus;
    return matchesSearchTerm && matchesType && matchesStatus;
  });

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Solicitações</h1>
          <p className="text-muted-foreground mt-2">Gerencie as solicitações e acompanhe o status</p>
        </div>

        {/* Lista de Solicitações */}
        <div className="bg-background rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Lista de Solicitações</h2>
                <p className="text-sm text-muted-foreground">{loading ? "Carregando solicitações..." : `${filteredSolicitacoes.length} solicitações encontradas`}</p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amarelo hover:bg-amarelo-darker text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Solicitação
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Solicitação' : 'Nova Solicitação'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Título *
                      </label>
                      <Input 
                        placeholder="Título da solicitação" 
                        name="titulo"
                        value={newSolicitacao.titulo}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo *
                      </label>
                      <Select 
                        value={newSolicitacao.categoria_id}
                        onValueChange={(value) => handleSelectChange('categoria_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingCategorias ? (
                            <SelectItem value="loading" disabled>Carregando categorias...</SelectItem>
                          ) : errorCategorias ? (
                            <SelectItem value="error" disabled>Erro ao carregar categorias</SelectItem>
                          ) : categorias.map(categoria => (
                            <SelectItem key={categoria.id} value={categoria.id}>
                              {categoria.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Prioridade *
                        </label>
                        <Select 
                          value={newSolicitacao.prioridade}
                          onValueChange={(value) => handleSelectChange('prioridade', value as 'baixa' | 'media' | 'alta')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Status *
                        </label>
                        <Select 
                          value={newSolicitacao.status}
                          onValueChange={(value) => handleSelectChange('status', value as 'pendente' | 'em_andamento' | 'concluida' | 'cancelada')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluida">Concluído</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Cliente *
                      </label>
                      <Select
                        value={newSolicitacao.cliente_id}
                        onValueChange={(value) => handleSelectChange('cliente_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingClientes ? (
                            <SelectItem value="loading" disabled>Carregando clientes...</SelectItem>
                          ) : errorClientes ? (
                            <SelectItem value="error" disabled>Erro ao carregar clientes</SelectItem>
                          ) : clientes.map(cliente => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Data de Entrega
                      </label>
                      <Input 
                        type="date" 
                        name="dataEntrega"
                        value={newSolicitacao.dataEntrega}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Descrição
                      </label>
                      <Textarea 
                        placeholder="Descrição detalhada da solicitação" 
                        rows={3}
                        name="descricao"
                        value={newSolicitacao.descricao}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        className="flex-1 bg-amarelo hover:bg-amarelo-darker"
                        onClick={handleSaveSolicitacao}
                      >
                        Criar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Modal de Detalhes da Solicitação */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Detalhes da Solicitação</DialogTitle>
                </DialogHeader>
                {selectedSolicitacaoId && <SolicitacaoDetalhes id={selectedSolicitacaoId} />}
              </DialogContent>
            </Dialog>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar solicitação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-amarelo"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px] border-border bg-background text-foreground hover:bg-accent">
                  <SelectValue placeholder="Todos os Tipos" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="todos-tipos">Todos os Tipos</SelectItem>
                  {loadingCategorias ? (
                    <SelectItem value="loading" disabled>Carregando tipos...</SelectItem>
                  ) : errorCategorias ? (
                    <SelectItem value="error" disabled>Erro ao carregar tipos</SelectItem>
                  ) : categorias.map(categoria => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px] border-border bg-background text-foreground hover:bg-accent">
                  <SelectValue placeholder="Todos os Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="todos-status">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleRefresh} className="border-border bg-background text-foreground hover:bg-accent">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Table of Solicitacoes */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted rounded-tl-lg">TÍTULO</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">TIPO</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">PRIORIDADE</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">CLIENTE</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">STATUS</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">DATA DE ENTREGA</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">CONCLUÍDO EM</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted rounded-tr-lg">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-4 px-6 text-center text-muted-foreground">
                      Carregando solicitações...
                    </td>
                  </tr>
                ) : filteredSolicitacoes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-4 px-6 text-center text-muted-foreground">
                      Nenhuma solicitação encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredSolicitacoes.map((item) => (
                    <tr key={item.id} className="hover:bg-muted">
                      <TableCell className="py-3 px-6 text-foreground">{item.titulo}</TableCell>
                      <TableCell className="py-3 px-6 text-foreground">{item.categoria?.nome}</TableCell>
                      <TableCell className="py-3 px-6">
                        <Badge className={getPriorityColor(item.prioridade)}>{item.prioridade}</Badge>
                      </TableCell>
                      <TableCell className="py-3 px-6 text-foreground">{item.cliente?.nome}</TableCell>
                      <TableCell className="py-3 px-6">
                        <Badge className={getStatusColor(item.status)}>{item.status.replace(/_/g, ' ')}</Badge>
                      </TableCell>
                      <TableCell className="py-3 px-6 text-foreground">{item.data_prazo ? new Date(item.data_prazo).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell className="py-3 px-6 text-foreground">{item.data_conclusao ? new Date(item.data_conclusao).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="py-3 px-6 text-foreground flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => {
                          setSelectedSolicitacaoId(item.id);
                          setIsDetailsModalOpen(true);
                        }} className="text-foreground hover:bg-accent border-border">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(item)} className="text-foreground hover:bg-accent border-border">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item.id)} className="text-destructive hover:bg-destructive-foreground border-border">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Details Modal */}
          <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">Detalhes da Solicitação</DialogTitle>
              </DialogHeader>
              {selectedSolicitacaoId && <SolicitacaoDetalhes id={selectedSolicitacaoId} />}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};
