import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, RefreshCw, Filter, Edit, Trash2 } from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    status: 'ativo',
    senha: ''
  });

  const { clientes, isLoading, refetch } = useClientes();
  const { profile, cadastrar } = useAuth();
  const { toast } = useToast();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Tables<'profiles'> | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setIsActionLoading(true);
    await fetch(`/api/deletar-usuario?id=${id}`, { method: 'DELETE' });
    setIsActionLoading(false);
    refetch();
  };

  const handleEdit = (cliente: Tables<'profiles'>) => {
    setEditData(cliente);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    await fetch(`/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editData.id,
        nome: editData.nome,
        email: editData.email,
        empresa: editData.empresa,
        telefone: editData.telefone,
        status: editData.status,
      }),
    });
    setIsActionLoading(false);
    setEditDialogOpen(false);
    refetch();
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.empresa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await cadastrar({
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      empresa: formData.empresa,
      telefone: formData.telefone,
      user_type: 'cliente',
    });

    if (res?.error) {
      toast({
        title: 'Erro ao cadastrar cliente',
        description: res.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Cliente cadastrado!',
        description: 'Um novo cliente foi adicionado com sucesso.',
      });
      setFormData({
        nome: '',
        email: '',
        empresa: '',
        telefone: '',
        cnpj: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        status: 'ativo',
        senha: ''
      });
      setIsDialogOpen(false);
      refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Verificar se o usuário é admin
  const isAdmin = profile?.user_type === 'admin';

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus clientes e suas informações</p>
        </div>

        {/* Lista de Clientes */}
        <div className="bg-background rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Lista de Clientes</h2>
                <p className="text-sm text-muted-foreground">{filteredClientes.length} cliente(s) cadastrado(s)</p>
              </div>
              {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-amarelo hover:bg-amarelo-darker text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Novo Cliente</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nome *
                        </label>
                        <Input 
                          placeholder="Nome do cliente" 
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <Input 
                          type="email" 
                          placeholder="email@exemplo.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Empresa
                        </label>
                        <Input 
                          placeholder="Nome da empresa" 
                          value={formData.empresa}
                          onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Telefone
                        </label>
                        <Input 
                          placeholder="(00) 00000-0000" 
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Status
                        </label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Senha *
                        </label>
                        <Input
                          type="password"
                          placeholder="Defina uma senha para o cliente"
                          value={formData.senha}
                          onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1" type="button" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          className="w-full bg-amarelo hover:bg-amarelo-darker"
                          disabled={isActionLoading}
                        >
                          Criar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-amarelo"
                />
              </div>
              <Button variant="outline" className="border-border bg-background text-foreground hover:bg-accent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Button variant="outline" className="border-border bg-background text-foreground hover:bg-accent">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar Ativos
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted rounded-tl-lg">NOME</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">EMAIL</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">EMPRESA</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">TELEFONE</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">STATUS</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted rounded-tr-lg">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-6 text-center text-muted-foreground">
                      Carregando clientes...
                    </td>
                  </tr>
                ) : filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-6 text-center text-muted-foreground">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredClientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-muted">
                      <td className="py-4 px-6 whitespace-nowrap text-foreground">{cliente.nome}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-foreground">{cliente.email}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-foreground">{cliente.empresa}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-foreground">{cliente.telefone}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <Badge className={getStatusColor(cliente.status)}>{cliente.status}</Badge>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-foreground flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(cliente)} className="text-foreground hover:bg-accent border-border">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(cliente.id)} disabled={isActionLoading} className="text-destructive hover:bg-destructive-foreground border-border">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {editData && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
                <Input
                  value={editData.nome}
                  onChange={e => setEditData({ ...editData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  value={editData.email}
                  onChange={e => setEditData({ ...editData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Empresa</label>
                <Input
                  value={editData.empresa || ''}
                  onChange={e => setEditData({ ...editData, empresa: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
                <Input
                  value={editData.telefone || ''}
                  onChange={e => setEditData({ ...editData, telefone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <Select value={editData.status} onValueChange={(value) => setEditData({ ...editData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" type="button" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="w-full bg-amarelo hover:bg-amarelo-darker"
                  disabled={isActionLoading}
                >
                  Salvar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};
