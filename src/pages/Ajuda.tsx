import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, LayoutDashboard, FileText, Calendar, Settings } from 'lucide-react';

export const Ajuda = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Central de Ajuda</h1>
          <p className="text-muted-foreground mt-2">Encontre respostas e aprenda a usar o sistema</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Busque por perguntas frequentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-amarelo"
            />
          </div>
        </div>

        {/* Como usar cada página */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Como usar cada página</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                <LayoutDashboard className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-3">Visão geral do sistema</p>
              <p className="text-xs text-muted-foreground">Gerencie todas as solicitações</p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Solicitações</h3>
              <p className="text-sm text-muted-foreground mb-3">Gerencie todas as solicitações</p>
              <p className="text-xs text-muted-foreground">Organize entregas e prazos</p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Calendário</h3>
              <p className="text-sm text-muted-foreground mb-3">Organize entregas e prazos</p>
              <p className="text-xs text-muted-foreground">Personalize sua experiência</p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Settings className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Configurações</h3>
              <p className="text-sm text-muted-foreground mb-3">Personalize sua experiência</p>
              <p className="text-xs text-muted-foreground">Personalize sua experiência</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-background rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Perguntas Frequentes</h2>
          
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="text-left text-foreground">
                Como criar uma nova solicitação?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Para criar uma nova solicitação, vá até a página "Solicitações" e clique no botão "Nova Solicitação". 
                Preencha todos os campos obrigatórios como título, tipo, cliente e data de entrega.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="text-left text-foreground">
                Como alterar o status de uma solicitação?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Você pode alterar o status de uma solicitação clicando em "Ver detalhes" na linha da solicitação 
                desejada e então modificando o campo de status.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="text-left text-foreground">
                Como visualizar as solicitações no calendário?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Acesse a página "Calendário" para ver todas as solicitações organizadas por data de entrega. 
                Você pode navegar entre os meses usando os botões de navegação.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="text-left text-foreground">
                Como personalizar as notificações?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Vá até "Configurações" e na seção "Notificações" você pode ativar ou desativar notificações 
                do sistema e atualizações por e-mail conforme sua preferência.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="text-left text-foreground">
                Como alterar minha senha?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Na página "Configurações", vá até a seção "Privacidade e Segurança" onde você pode alterar sua senha 
                informando a senha atual e a nova senha.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-border rounded-lg px-4">
              <AccordionTrigger className="text-left text-foreground">
                Como acompanhar o progresso das solicitações?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No Dashboard você tem uma visão geral de todas as solicitações com contadores por status. 
                Também pode acessar a página "Solicitações" para ver detalhes específicos de cada uma.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};
