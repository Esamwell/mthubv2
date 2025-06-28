import React, { useState, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
// html2canvas não é mais necessário para o conteúdo principal, mas pode ser útil para outras capturas se desejar.
// import html2canvas from 'html22canvas'; 

interface ServiceItem {
  id: string;
  title: string;
  price: number;
  unit: string;
  type: 'custom' | 'catalog';
  description?: string; // Adicionado para serviços personalizados
}

interface CatalogService {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  category: string;
}

// Dados de exemplo para o catálogo de serviços
const catalogServices: CatalogService[] = [
  {
    id: '1',
    title: 'Vídeo Institucional',
    description: 'Vídeo corporativo profissional com roteiro, filmagem e edição',
    price: 2500,
    unit: '/vídeo',
    category: 'Audiovisual',
  },
  {
    id: '2',
    title: 'Vídeo de Produto',
    description: 'Vídeo showcasing produto com foco comercial',
    price: 1800,
    unit: '/vídeo',
    category: 'Audiovisual',
  },
  {
    id: '3',
    title: 'Vídeo para Redes Sociais',
    description: 'Vídeos curtos otimizados para Instagram, TikTok e Facebook',
    price: 800,
    unit: '/vídeo',
    category: 'Audiovisual',
  },
  {
    id: '4',
    title: 'Pacote de Stories',
    description: 'Conjunto de 10 stories personalizados',
    price: 800,
    unit: '/pacote',
    category: 'Audiovisual',
  },
  {
    id: '5',
    title: 'Criação de Logo',
    description: 'Logo profissional com manual de marca',
    price: 1200,
    unit: '/projeto',
    category: 'Design Gráfico',
  },
  {
    id: '6',
    title: 'Material Gráfico',
    description: 'Cartões, folders, banners e materiais impressos',
    price: 400,
    unit: '/peça',
    category: 'Design Gráfico',
  },
  {
    id: '7',
    title: 'Identidade Visual Completa',
    description: 'Logo, paleta de cores, tipografia e manual de marca',
    price: 3500,
    unit: '/projeto',
    category: 'Design Gráfico',
  },
  {
    id: '8',
    title: 'Gestão de Redes Sociais',
    description: 'Gestão completa de redes sociais com posts diários',
    price: 2000,
    unit: '/mês',
    category: 'Social Media',
  },
  {
    id: '9',
    title: 'Posts para Feed',
    description: 'Posts criativos para Instagram e Facebook',
    price: 80,
    unit: '/post',
    category: 'Social Media',
  },
  {
    id: '10',
    title: 'Campanha de Anúncios',
    description: 'Criação e gestão de campanhas pagas',
    price: 1500,
    unit: '/campanha',
    category: 'Social Media',
  },
  {
    id: '11',
    title: 'Consultoria em Marketing',
    description: 'Consultoria estratégica personalizada',
    price: 300,
    unit: '/hora',
    category: 'Estratégia',
  },
  {
    id: '12',
    title: 'Planejamento Estratégico',
    description: 'Planejamento de marketing completo',
    price: 2500,
    unit: '/projeto',
    category: 'Estratégia',
  },
];

export const Orcamento = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  // budgetRef não é mais necessário para a captura do PDF, pois será desenhado diretamente com jsPDF.
  // const budgetRef = useRef<HTMLDivElement>(null); 

  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [customService, setCustomService] = useState({
    title: '',
    price: '',
    description: '',
    unit: '',
  });

  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [observations, setObservations] = useState('');
  const [discount, setDiscount] = useState<string>('0');
  // discountType não é mais necessário, pois o desconto é sempre em porcentagem
  // const [discountType, setDiscountType] = useState<'percentage' | 'value'>('percentage'); 

  const handleAddCustomService = () => {
    const newPrice = parseFloat(customService.price.replace(',', '.'));
    if (customService.title && !isNaN(newPrice) && customService.unit) {
      setSelectedServices([
        ...selectedServices,
        { ...customService, id: Date.now().toString(), price: newPrice, type: 'custom' },
      ]);
      setCustomService({ title: '', price: '', description: '', unit: '' });
    } else {
      toast({
        title: 'Erro ao adicionar serviço personalizado',
        description: 'Preencha Título, Preço e Unidade corretamente.',
        variant: 'destructive',
      });
    }
  };

  const handleAddCatalogService = (service: CatalogService) => {
    setSelectedServices([
      ...selectedServices,
      { id: service.id, title: service.title, price: service.price, unit: service.unit, type: 'catalog', description: service.description },
    ]);
    toast({
      title: 'Serviço adicionado!',
      description: `${service.title} adicionado ao orçamento.`, 
    });
  };

  const handleRemoveService = (id: string) => {
    setSelectedServices(selectedServices.filter(service => service.id !== id));
  };

  const calculateTotal = () => {
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    const discountPercentage = parseFloat(discount.replace(',', '.')) || 0;
    const totalWithDiscount = servicesTotal * (1 - discountPercentage / 100);
    return Math.max(0, totalWithDiscount); // Garante que o total não seja negativo
  };

  const handleGeneratePdf = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Cores da paleta (amarelo e preto)
    const yellowColor = '#FFC107'; // Amarelo vibrante
    const blackColor = '#000000'; // Preto para as fontes
    const lightGreyColor = '#666666'; // Cinza claro para detalhes menores

    // Cabeçalho
    pdf.setFillColor(yellowColor); // Fundo amarelo para o cabeçalho
    pdf.rect(0, 0, pageWidth, 40, 'F'); // Desenha um retângulo preenchido para o cabeçalho
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(blackColor); // Texto preto para o cabeçalho
    pdf.text('MT ENTERPRISE', pageWidth / 2, 18, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text('Soluções criativas em marketing e publicidade', pageWidth / 2, 30, { align: 'center' });

    // Título "ORÇAMENTO"
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(blackColor);
    pdf.text('ORÇAMENTO', pageWidth / 2, 60, { align: 'center' });

    // Detalhes do Cliente e ID do Orçamento
    pdf.setFontSize(10);
    pdf.setTextColor(blackColor);
    let y = 75; // Posição Y inicial para os detalhes do cliente
    const marginX = 20; // Margem esquerda
    const labelX = marginX; // X para rótulos como Cliente:, E-mail:
    const valueX = labelX + 18; // X para valores (após o rótulo)

    pdf.setFont('helvetica', 'bold');
    pdf.text('Cliente:', labelX, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(clientData.name || 'Cliente Demo', valueX, y);
    y += 7;

    pdf.setFont('helvetica', 'bold');
    pdf.text('E-mail:', labelX, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(clientData.email || 'cliente@exemplo.com', valueX, y);
    y += 7;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Telefone:', labelX, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(clientData.phone || '75992299443', valueX, y);
    y += 7;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Data:', labelX, y);
    pdf.setFont('helvetica', 'normal');
    const today = new Date();
    pdf.text(today.toLocaleDateString('pt-BR'), valueX, y);
    y += 15;

    // Linha divisória após os detalhes do cliente
    pdf.setDrawColor(lightGreyColor);
    pdf.line(marginX, y, pageWidth - marginX, y); // Desenha uma linha horizontal
    y += 10;

    // Tabela de Serviços (cabeçalho da tabela)
    const tableStartY = y + 10;
    const colWidths = [pageWidth * 0.45, pageWidth * 0.15, pageWidth * 0.2, pageWidth * 0.2]; // Ajuste as larguras
    const colStartX = [marginX, marginX + colWidths[0], marginX + colWidths[0] + colWidths[1], marginX + colWidths[0] + colWidths[1] + colWidths[2]];

    // Desenhar cabeçalho da tabela
    pdf.setFillColor(yellowColor); // Amarelo para o cabeçalho da tabela
    pdf.rect(marginX, tableStartY, pageWidth - 2 * marginX, 10, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(blackColor); // Texto preto para o cabeçalho da tabela
    pdf.text('SERVIÇO', colStartX[0] + 2, tableStartY + 6, { align: 'left' });
    pdf.text('QTD', colStartX[1] + colWidths[1] / 2, tableStartY + 6, { align: 'center' });
    pdf.text('VALOR UNIT.', colStartX[2] + colWidths[2] - 2, tableStartY + 6, { align: 'right' });
    pdf.text('TOTAL', colStartX[3] + colWidths[3] - 2, tableStartY + 6, { align: 'right' });

    let currentY = tableStartY + 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    selectedServices.forEach(service => {
      currentY += 8;
      if (currentY > pageHeight - 50) {
        pdf.addPage();
        currentY = 20; // Reset Y para nova página
      }
      pdf.text(service.title, colStartX[0] + 2, currentY);
      pdf.text('1', colStartX[1] + colWidths[1] / 2, currentY, { align: 'center' });
      pdf.text(`R$ ${service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, colStartX[2] + colWidths[2] - 2, currentY, { align: 'right' });
      pdf.text(`R$ ${(service.price * 1).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, colStartX[3] + colWidths[3] - 2, currentY, { align: 'right' });
      if (service.description) {
        currentY += 5;
        pdf.setFontSize(7);
        pdf.setTextColor(lightGreyColor);
        pdf.text(service.description, colStartX[0] + 2, currentY);
        pdf.setFontSize(9);
        pdf.setTextColor(blackColor);
      }
    });

    currentY += 10;
    pdf.setDrawColor(lightGreyColor);
    pdf.line(marginX, currentY, pageWidth - marginX, currentY); // Linha divisória após a tabela
    currentY += 10;

    // Seção de Resumo (Subtotal, Desconto, Total)
    const summaryWidth = 70; // Largura da caixa de resumo
    const summaryX = pageWidth - marginX - summaryWidth; // Posição X para alinhar à direita
    const summaryY = currentY; // Posição Y para o resumo
    const summaryLineHeight = 7; // Altura da linha no resumo
    const summaryPadding = 4; // Preenchimento interno

    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    const discountPercentage = parseFloat(discount.replace(',', '.')) || 0;
    const discountValue = servicesTotal * (discountPercentage / 100);
    const totalWithDiscount = servicesTotal - discountValue;

    // Subtotal
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(blackColor);
    pdf.text('Subtotal:', summaryX + summaryPadding, summaryY + summaryLineHeight);
    pdf.text(`R$ ${servicesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, summaryX + summaryWidth - summaryPadding, summaryY + summaryLineHeight, { align: 'right' });

    // Desconto
    pdf.text('Desconto (%):', summaryX + summaryPadding, summaryY + summaryLineHeight * 2);
    pdf.text(`- R$ ${discountValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, summaryX + summaryWidth - summaryPadding, summaryY + summaryLineHeight * 2, { align: 'right' });

    // Linha antes do Total
    pdf.line(summaryX + summaryPadding, summaryY + summaryLineHeight * 2 + summaryPadding, summaryX + summaryWidth - summaryPadding, summaryY + summaryLineHeight * 2 + summaryPadding);

    // Total
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('TOTAL:', summaryX + summaryPadding, summaryY + summaryLineHeight * 3 + 2);
    pdf.text(`R$ ${totalWithDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, summaryX + summaryWidth - summaryPadding, summaryY + summaryLineHeight * 3 + 2, { align: 'right' });

    // Rodapé
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(lightGreyColor);
    pdf.text('Documento gerado por MT ENTERPRISE', pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.save(`Orcamento_${clientData.name || 'cliente'}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Apenas administradores podem ver esta página
  const isAdmin = profile?.user_type === 'admin';

  if (!isAdmin && profile?.user_type) {
    return (
      <Layout>
        <div className="text-center text-red-500">
          Você não tem permissão para acessar esta página.
        </div>
      </Layout>
    );
  }

  // Agrupar serviços por categoria para exibição
  const servicesByCategory = catalogServices.reduce((acc, service) => {
    (acc[service.category] = acc[service.category] || []).push(service);
    return acc;
  }, {} as Record<string, CatalogService[]>);

  return (
    <Layout>
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Gerar Orçamento</h2>
                </div>
        <div className="space-y-4">
          {/* Dados do Cliente */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card text-card-foreground shadow-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Dados do Cliente</h3>
              <div className="grid gap-2">
                <Input placeholder="Nome do Cliente" value={clientData.name} onChange={(e) => setClientData({ ...clientData, name: e.target.value })} />
                <Input type="email" placeholder="E-mail do Cliente" value={clientData.email} onChange={(e) => setClientData({ ...clientData, email: e.target.value })} />
                <Input type="tel" placeholder="Telefone do Cliente" value={clientData.phone} onChange={(e) => setClientData({ ...clientData, phone: e.target.value })} />
              </div>
              </div>

            {/* Adicionar Serviço Personalizado */}
            <div className="bg-card text-card-foreground shadow-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Serviço Personalizado</h3>
              <div className="grid gap-2">
                <Input placeholder="Título do Serviço" value={customService.title} onChange={(e) => setCustomService({ ...customService, title: e.target.value })} />
                <Input placeholder="Unidade (ex: /vídeo, /mês)" value={customService.unit} onChange={(e) => setCustomService({ ...customService, unit: e.target.value })} />
                <Input type="number" placeholder="Preço" value={customService.price} onChange={(e) => setCustomService({ ...customService, price: e.target.value })} />
                <Textarea placeholder="Descrição (opcional)" value={customService.description} onChange={(e) => setCustomService({ ...customService, description: e.target.value })} />
                <Button onClick={handleAddCustomService}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Serviço
                </Button>
              </div>
            </div>

            {/* Catálogo de Serviços */}
            <div className="bg-card text-card-foreground shadow-sm rounded-lg p-4 overflow-y-auto max-h-[400px]">
              <h3 className="text-lg font-semibold mb-2">Catálogo de Serviços</h3>
              <Input
                type="text"
                placeholder="Pesquisar serviços..."
                className="mb-2"
                onChange={(e) => { /* Implementar pesquisa aqui */ } }
              />
              <div className="grid gap-2">
                {catalogServices.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                      <p className="font-medium">{service.title} - R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {service.unit}</p>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                    <Button variant="outline" size="sm" onClick={() => handleAddCatalogService(service)}>
                      Adicionar
                          </Button>
                  </div>
                ))}
                </div>
            </div>
          </div>

          {/* Resumo do Orçamento */}
          <div className="bg-card text-card-foreground shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Resumo do Orçamento</h3>
            <div className="space-y-2 mb-4">
              {selectedServices.length === 0 ? (
                <p className="text-muted-foreground">Nenhum serviço adicionado ainda.</p>
              ) : (
                selectedServices.map(service => (
                  <div key={service.id} className="flex justify-between items-center border-b pb-1 last:border-b-0">
                    <div>
                      <p className="font-medium">{service.title}</p>
                      {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {service.unit}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveService(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end items-center gap-4 border-t pt-4">
              <div className="flex flex-col items-end">
                <p className="text-lg font-semibold">Subtotal: R$ {selectedServices.reduce((sum, service) => sum + service.price, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="flex items-center gap-2">
                  <label htmlFor="discount" className="text-lg font-semibold">Desconto (%):</label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-24 text-right"
                  />
                </div>
                <p className="text-2xl font-bold mt-2">TOTAL: R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <Button onClick={handleGeneratePdf}>
                <Download className="mr-2 h-4 w-4" /> Gerar PDF
              </Button>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Observações:</h4>
              <Textarea
                placeholder="Adicione observações aqui..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 