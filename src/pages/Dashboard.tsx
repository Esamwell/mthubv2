import React from 'react';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { Users, FileText, Clock, CheckCircle, FolderOpen, Calendar } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useSolicitacoes } from '@/hooks/useSolicitacoes';

export const Dashboard = () => {
  const { stats, isLoading, error } = useDashboardStats();
  const { solicitacoes, loading, error: errorSolicitacoes } = useSolicitacoes();

  // Debug: logar as solicitações recentes
  console.log('Solicitações Recentes:', solicitacoes);

  const pieChartData = [
    { name: 'Pendentes', value: stats?.solicitacoesPendentes || 0, color: '#FFBF00' },
    { name: 'Em Andamento', value: stats?.solicitacoesEmAndamento || 0, color: '#3B82F6' },
    { name: 'Concluídas', value: stats?.solicitacoesConcluidas || 0, color: '#22C55E' },
  ];

  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', year: 'numeric' });

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus clientes e solicitações</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total de Clientes"
            value={isLoading ? '---' : stats?.totalClientes.toString() || '0'}
            icon={Users}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Solicitações Pendentes"
            value={isLoading ? '---' : stats?.solicitacoesPendentes.toString() || '0'}
            icon={FileText}
            iconColor="text-amarelo"
          />
          <StatsCard
            title="Em Andamento"
            value={isLoading ? '---' : stats?.solicitacoesEmAndamento.toString() || '0'}
            icon={Clock}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Solicitações Concluídas"
            value={isLoading ? '---' : stats?.solicitacoesConcluidas.toString() || '0'}
            icon={CheckCircle}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Data Atual"
            value={currentDate}
            icon={Calendar}
            bgColor="bg-amarelo"
            textColor="text-foreground"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visão Geral das Solicitações */}
          <div className="lg:col-span-2 bg-background p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Visão Geral das Solicitações</h3>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Carregando solicitações...</p>
              </div>
            ) : error ? (
              <div className="h-64 flex items-center justify-center text-destructive">
                <p>Erro ao carregar solicitações.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amarelo rounded-full"></div>
                <span className="text-sm text-muted-foreground">Pendentes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Em Andamento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Concluídas</span>
              </div>
            </div>
          </div>

          {/* Solicitações Recentes */}
          <div className="bg-background p-6 rounded-lg border border-border flex flex-col h-[420px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Solicitações Recentes</h3>
              <FileText className="w-5 h-5 text-amarelo" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground"><p>Carregando solicitações...</p></div>
              ) : errorSolicitacoes ? (
                <div className="text-center py-8 text-destructive"><p>Erro ao carregar solicitações.</p></div>
              ) : solicitacoes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground"><p>Nenhuma solicitação encontrada.</p></div>
              ) : (
                <div className="space-y-3">
                  {(Array.isArray(solicitacoes) ? solicitacoes : []).map(solicitacao => (
                    <div key={solicitacao.id} className="border border-border rounded-lg p-3 flex flex-col gap-1 bg-muted shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-foreground text-base truncate max-w-[180px]">{solicitacao.titulo}</span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800 whitespace-nowrap">{solicitacao.status?.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="text-xs text-muted-foreground leading-5">
                        Cliente: {solicitacao.cliente?.nome || 'N/A'}<br/>
                        Categoria: {solicitacao.categoria?.nome || 'N/A'}<br/>
                        Criado em: {solicitacao.created_at ? new Date(solicitacao.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4">
              <a href="/solicitacoes" className="text-amarelo hover:text-amarelo-darker text-sm font-medium">
                Ver Todas as Solicitações
              </a>
            </div>
          </div>
        </div>

        {/* Atividades Hoje */}
        <div className="mt-6 bg-background p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-amarelo" />
            <h3 className="text-lg font-semibold text-gray-900">Atividades Hoje</h3>
          </div>
          {isLoading ? <p>Carregando atividades...</p> : error ? <p>Erro ao carregar atividades.</p> : <p>Nenhuma atividade para hoje</p>}
        </div>
      </div>
    </Layout>
  );
};
