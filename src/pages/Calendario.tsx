import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarioData } from '@/hooks/useCalendarioData';
import { Badge } from '@/components/ui/badge';

export const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const { eventos, isLoading, error } = useCalendarioData(currentDate.getMonth(), currentDate.getFullYear());

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month as Date objects
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const getSolicitacoesForDay = (day: Date) => {
    if (isLoading || error) return [];
    return (eventos || []).filter(sol => {
      const prazoDate = new Date(sol.data_prazo && sol.data_prazo.length === 10 ? sol.data_prazo + 'T00:00:00' : sol.data_prazo);
      const match = isSameDay(prazoDate, day);
      if (match) {
        console.log('Solicitação para o dia:', day, sol);
      }
      return match;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'bg-red-500 text-white';
      case 'em_andamento': return 'bg-yellow-500 text-black';
      case 'concluida': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const groupedSolicitacoes = (eventos || []).reduce((acc, sol) => {
    const dateKey = new Date(sol.data_prazo).toLocaleDateString('pt-BR');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(sol);
    return acc;
  }, {} as Record<string, typeof eventos>);

  const sortedDates = Object.keys(groupedSolicitacoes).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'));
    const dateB = new Date(b.split('/').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendário</h1>
          <p className="text-muted-foreground mt-2">Visualize as solicitações organizadas por data de entrega</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode('calendar')}
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
          >
            Visualização Calendário
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'default' : 'outline'}
          >
            Visualização Lista
          </Button>
        </div>
      </div>

      {/* Calendar / List View */}
      {viewMode === 'calendar' ? (
      <div className="bg-background rounded-lg border border-border p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amarelo rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {monthNames[currentDate.getMonth()]} De {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div key={day} className="bg-muted p-4 text-center">
              <span className="text-sm font-medium text-muted-foreground">{day}</span>
            </div>
          ))}
          
          {/* Calendar Days */}
            {days.map((day, index) => {
              const isCurrentMonthDay = day && day.getMonth() === currentDate.getMonth();
              const solicitacoesDoDia = day && isCurrentMonthDay ? getSolicitacoesForDay(day) : [];
              const isTodayDay = day ? isSameDay(day, today) : false;

              return (
            <div
              key={index}
              className={`bg-background p-4 min-h-[120px] ${
                day ? 'hover:bg-accent' : ''
                  } ${isTodayDay ? 'ring-2 ring-amarelo' : ''} ${
                    !isCurrentMonthDay ? 'bg-muted text-muted-foreground' : ''
                  }`}
            >
              {day && (
                <div>
                  <span className={`text-sm font-medium ${
                        isTodayDay ? 'text-amarelo-darker' : 'text-foreground'
                  }`}>
                        {day.getDate()}
                  </span>
                  
                    <div className="mt-2 space-y-1">
                        {(solicitacoesDoDia || []).map(sol => (
                          <div key={sol.id} className={`${getPriorityColor(sol.prioridade)} p-2 rounded text-xs`}>
                            <div className="font-medium">{sol.titulo}</div>
                            <div className="text-gray-600">{sol.cliente?.nome || 'N/A'}</div>
                      <div className="flex gap-1 mt-1">
                            <Badge className={`${getStatusColor(sol.status)}`}>{sol.status.replace(/_/g, ' ')}</Badge>
                            <Badge className={`${getPriorityColor(sol.prioridade)}`}>{sol.prioridade}</Badge>
                          </div>
                      </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="bg-background rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Solicitações em Lista</h2>
        {isLoading && <p className="text-muted-foreground">Carregando solicitações...</p>}
        {error && <p className="text-destructive">Erro ao carregar solicitações: {error}</p>}
        {!isLoading && !error && sortedDates.length === 0 && (
          <p className="text-muted-foreground">Nenhuma solicitação encontrada para este mês.</p>
        )}
        {!isLoading && !error && sortedDates.length > 0 && (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date}>
                <h3 className="text-lg font-semibold text-foreground mb-2 border-b border-border pb-1">{date}</h3>
                <div className="space-y-3">
                  {groupedSolicitacoes[date].map(sol => (
                    <div key={sol.id} className="bg-muted p-4 rounded-lg shadow-sm flex justify-between items-center">
                      <div>
                        <p className="font-medium text-foreground">{sol.titulo}</p>
                        <p className="text-sm text-muted-foreground">Cliente: {sol.cliente?.nome || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Categoria: {sol.categoria?.nome || 'N/A'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={`${getStatusColor(sol.status)}`}>{sol.status.replace(/_/g, ' ')}</Badge>
                        <Badge className={`${getPriorityColor(sol.prioridade)}`}>{sol.prioridade}</Badge>
                      </div>
            </div>
          ))}
        </div>
      </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};
