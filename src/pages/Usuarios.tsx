import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  user_type: 'admin' | 'cliente';
}

export const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    user_type: 'cliente',
  });

  const { usuarios, isLoading, refetch } = useUsuarios();
  const { profile, cadastrar } = useAuth();
  const { toast } = useToast();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Usuario | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }
    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/usuarios?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Erro ao excluir usuário',
          description: errorData.error || 'Não foi possível excluir o usuário.',
          variant: 'destructive',
        });
        console.error('Erro ao excluir usuário:', errorData);
      } else {
        toast({
          title: 'Usuário excluído',
          description: 'O usuário foi removido com sucesso.',
        });
        refetch();
      }
    } catch (error) {
      toast({
        title: 'Erro ao excluir usuário',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
      console.error('Erro ao excluir usuário:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditData(usuario);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    await fetch(`/api/editar-usuario?id=${editData?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: editData?.nome,
        email: editData?.email,
        user_type: editData?.user_type,
      }),
    });
    setIsActionLoading(false);
    setEditDialogOpen(false);
    refetch();
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    const res = await cadastrar({
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      user_type: formData.user_type as 'admin' | 'cliente',
    });
    setIsActionLoading(false);

    if (res?.error) {
      toast({
        title: 'Erro ao cadastrar usuário',
        description: res.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Usuário cadastrado!',
        description: 'Um novo usuário foi adicionado com sucesso.',
      });
      setFormData({
        nome: '',
        email: '',
        senha: '',
        user_type: 'cliente',
      });
      setIsDialogOpen(false);
      refetch();
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'cliente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Apenas administradores podem ver esta página
  const isAdmin = profile?.user_type === 'admin';

  if (!isAdmin && profile?.user_type) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-500">
          Você não tem permissão para acessar esta página.
        </div>
      </Layout>
    );
  }

  if (isLoading && !profile?.user_type) {
    return (
      <Layout>
        <div className="p-8 text-center text-muted-foreground">
          Carregando dados...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground mt-2">Gerencie os usuários do sistema</p>
        </div>

        {/* Lista de Usuários */}
        <div className="bg-background rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Lista de Usuários</h2>
                <p className="text-sm text-muted-foreground">{filteredUsuarios.length} usuário(s) encontrado(s)</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amarelo hover:bg-amarelo-darker text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Novo Usuário</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nome
                      </label>
                      <Input
                        placeholder="Nome completo do usuário"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Senha *
                      </label>
                      <Input
                        type="password"
                        placeholder="Defina uma senha"
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Cargo *
                      </label>
                      <Select value={formData.user_type} onValueChange={(value) => setFormData({ ...formData, user_type: value as 'admin' | 'cliente' })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="cliente">Cliente</SelectItem>
                        </SelectContent>
                      </Select>
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
            </div>

            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-amarelo"
                />
              </div>
              <Button variant="outline" className="border-border bg-background text-foreground hover:bg-accent" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
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
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">TIPO DE USUÁRIO</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted rounded-tr-lg">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-6 text-center text-muted-foreground">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : filteredUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-6 text-center text-muted-foreground">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-muted">
                      <td className="py-4 px-6 whitespace-nowrap text-foreground">{usuario.nome}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-foreground">{usuario.email}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <Badge className={getUserTypeColor(usuario.user_type)}>{usuario.user_type === 'admin' ? 'Administrador' : 'Cliente'}</Badge>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-foreground flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(usuario)} className="text-foreground hover:bg-accent border-border">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(usuario.id)} disabled={isActionLoading} className="text-destructive hover:bg-destructive-foreground border-border">
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
            <DialogTitle>Editar Usuário</DialogTitle>
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
                <label className="block text-sm font-medium text-foreground mb-2">Cargo</label>
                <Select value={editData.user_type} onValueChange={(value) => setEditData({ ...editData, user_type: value as 'admin' | 'cliente' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
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