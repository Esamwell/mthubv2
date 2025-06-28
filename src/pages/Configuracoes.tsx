import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Globe, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const Configuracoes = () => {
  const { profile, user } = useAuth();
  const [nome, setNome] = useState(profile?.nome || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [userType, setUserType] = useState(profile?.user_type || 'cliente');
  const [agencia, setAgencia] = useState(profile?.empresa || '');
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaMsg, setSenhaMsg] = useState('');
  const [senhaLoading, setSenhaLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    const res = await fetch(`/api/editar-cliente/${profile?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        email,
        empresa: agencia,
        user_type: userType,
      }),
    });
    setIsSaving(false);
    if (res.ok) {
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações de perfil foram salvas.',
      });
      window.location.reload();
    } else {
      const errorData = await res.json();
      toast({
        title: 'Erro ao atualizar perfil',
        description: errorData.error || 'Ocorreu um erro ao salvar suas informações.',
        variant: 'destructive',
      });
    }
  };

  const handleChangePassword = async () => {
    setSenhaMsg('');
    if (!profile?.id) {
      setSenhaMsg('ID do usuário não encontrado para alterar a senha.');
      toast({
        title: 'Erro de segurança',
        description: 'ID do usuário não encontrado. Tente logar novamente.',
        variant: 'destructive',
      });
      return;
    }
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setSenhaMsg('Preencha todos os campos da senha.');
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos de senha.',
        variant: 'destructive',
      });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setSenhaMsg('A nova senha e a confirmação não coincidem.');
      toast({
        title: 'Erro de validação',
        description: 'A nova senha e a confirmação devem ser idênticas.',
        variant: 'destructive',
      });
      return;
    }

    setSenhaLoading(true);
    console.log('Configuracoes: Tentando alterar senha...');
    try {
      const res = await fetch('http://localhost:4000/alterar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          senhaAtual,
          novaSenha
        })
      });

      const textResponse = await res.text();
      console.log('Configuracoes: Resposta bruta do backend (alterar senha):', textResponse);

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (jsonError) {
        console.error('Configuracoes: Erro ao parsear JSON da resposta da alteração de senha:', jsonError);
        setSenhaLoading(false);
        toast({
          title: 'Erro de comunicação',
          description: 'Formato de resposta inválido do servidor.',
          variant: 'destructive',
        });
        return;
      }

      console.log('Configuracoes: Dados recebidos do backend (alterar senha):', data);

      if (res.ok) {
        setSenhaMsg('Senha alterada com sucesso!');
        toast({
          title: 'Senha alterada!',
          description: 'Sua senha foi atualizada com sucesso.',
        });
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        setSenhaMsg(data.error || 'Erro ao alterar senha.');
        toast({
          title: 'Erro ao alterar senha',
          description: data.error || 'Ocorreu um erro ao alterar sua senha.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setSenhaMsg('Erro de conexão ao alterar senha.');
      toast({
        title: 'Erro de rede',
        description: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
        variant: 'destructive',
      });
      console.error('Configuracoes: Erro no fetch de alteração de senha:', error);
    } finally {
      setSenhaLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-2">Gerencie suas preferências e configurações do sistema</p>
      </div>
      <div className="space-y-6">
        {/* Perfil do Usuário */}
        <div className="bg-background rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-amarelo" />
            <h2 className="text-xl font-semibold text-foreground">Perfil do Usuário</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome Completo
              </label>
              <Input value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                E-mail
              </label>
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Função
              </label>
              <Input value={userType === 'admin' ? 'Administrador' : 'Cliente'} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Agência
              </label>
              <Input value={agencia} onChange={e => setAgencia(e.target.value)} />
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-amarelo hover:bg-amarelo-darker text-primary-foreground" onClick={handleUpdateProfile} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Atualizar Perfil'}
            </Button>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-background rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-amarelo" />
            <h2 className="text-xl font-semibold text-foreground">Notificações (Em breve)</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="system-notifications" className="text-sm font-medium text-foreground">Notificações do Sistema </label>
              <Switch
                id="system-notifications"
                checked={systemNotifications}
                onCheckedChange={setSystemNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="email-updates" className="text-sm font-medium text-foreground">Atualizações por E-mail</label>
              <Switch
                id="email-updates"
                checked={emailUpdates}
                onCheckedChange={setEmailUpdates}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="dark-mode" className="text-sm font-medium text-foreground">Modo Escuro</label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </div>

        {/* Aparência e Idioma */}
        <div className="bg-background rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-amarelo" />
            <h2 className="text-xl font-semibold text-foreground">Aparência e Idioma (Em breve)</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Idioma
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português (Brasil)</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fuso Horário
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GMT-3">GMT-3 (Brasília)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-background rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-amarelo" />
            <h2 className="text-xl font-semibold text-foreground">Privacidade e Segurança</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Senha Atual</label>
              <Input
                type="password"
                value={senhaAtual}
                onChange={e => setSenhaAtual(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nova Senha</label>
              <Input
                type="password"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirmar Nova Senha</label>
              <Input
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
              />
            </div>
            {senhaMsg && (
              <p className={`text-sm ${senhaMsg.includes('sucesso') ? 'text-green-600' : 'text-destructive'}`}>
                {senhaMsg}
              </p>
            )}
            <Button className="bg-amarelo hover:bg-amarelo-darker text-primary-foreground" onClick={handleChangePassword} disabled={senhaLoading}>
              {senhaLoading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-amarelo hover:bg-amarelo-darker text-primary-foreground px-8" onClick={handleUpdateProfile} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Todas as Configurações'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};
