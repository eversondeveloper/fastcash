/* eslint-disable no-unused-vars */
import { useState } from 'react';

export const useGeracaoPDF = () => {
  const [gerandoPDF, setGerandoPDF] = useState(false);

  const formatarDataFiltro = (dataString) => {
    if (!dataString) return '';
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  /**
   * Limpa tags HTML e preserva quebras de linha e marcadores de lista
   */
  const processarHtmlParaTexto = (html) => {
    if (!html) return "";
    let texto = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<div[^>]*>/gi, "\n") 
      .replace(/<li>/gi, "  • ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, ""); 
    
    texto = texto.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
    return texto.trim();
  };

  /**
   * Formata a identificação do atendente: Primeiro Nome + CPF Mascarado
   */
  const formatarIdentificacaoPDF = (nome, cpf) => {
    if (!nome) return "Sistema";
    const primeiroNome = nome.split(' ')[0].toUpperCase();
    if (!cpf) return primeiroNome;

    const cpfLimpo = cpf.replace(/\D/g, '');
    const cpfFormatado = cpfLimpo.length === 11 
      ? `${cpfLimpo.substring(0, 3)}...${cpfLimpo.substring(9, 11)}` 
      : cpf;

    return `${primeiroNome} (${cpfFormatado})`;
  };

  const gerarPDF = async ({
    vendasFiltradas,
    retiradasFiltradas,
    totaisPorMetodo,
    totalVendasBruto,
    totalValorPago,
    totalTroco,
    totalRetiradas,
    totalLiquido,
    quantidadeVendas,
    filtroDataInicio,
    filtroDataFim,
    filtroMetodosPagamento,
    dadosEmpresa,
    observacoes, 
  }) => {
    if (quantidadeVendas === 0 && retiradasFiltradas.length === 0 && (!observacoes || observacoes.length === 0)) {
      console.warn("Não há dados para exportar.");
      return;
    }

    setGerandoPDF(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margemInferior = 25; 
      let y = 20;

      let periodoTexto = "Período: Todas as datas";
      if (filtroDataInicio || filtroDataFim) {
        const inicio = filtroDataInicio ? formatarDataFiltro(filtroDataInicio) : 'Início';
        const fim = filtroDataFim ? formatarDataFiltro(filtroDataFim) : 'Fim';
        periodoTexto = `Período: ${inicio} a ${fim}`;
      }

      const cores = {
        primaria: [25, 25, 25],
        secundaria: [100, 100, 100],
        destaque: [41, 128, 185],
        sucesso: [39, 174, 96],
        alerta: [230, 126, 34],
        fundo: [248, 248, 248],
        borda: [220, 220, 220],
      };

      const adicionarCabecalhoPagina = () => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...cores.secundaria);
        doc.text("Continuação do Relatório Financeiro", 20, 15);
        doc.line(20, 17, pageWidth - 20, 17);
        return 25; 
      };

      const adicionarCabecalhoEmpresa = (yStart) => {
        let currentY = yStart;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...cores.primaria);
        const nomePrincipal = dadosEmpresa?.nome_fantasia || dadosEmpresa?.razao_social || "EMPRESA NÃO CADASTRADA";
        doc.text(nomePrincipal, 20, currentY);
        currentY += 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...cores.secundaria);
        if (dadosEmpresa?.cnpj) { doc.text(`CNPJ: ${dadosEmpresa.cnpj}`, 20, currentY); currentY += 4; }
        doc.setDrawColor(...cores.borda);
        doc.line(20, currentY + 2, pageWidth - 20, currentY + 2);
        currentY += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.destaque);
        doc.text("RELATÓRIO FINANCEIRO", pageWidth / 2, currentY, { align: "center" });
        currentY += 5;
        doc.setFontSize(10);
        doc.setTextColor(...cores.primaria);
        doc.text(periodoTexto.toUpperCase(), pageWidth / 2, currentY, { align: "center" });
        currentY += 8;
        return currentY;
      };

      y = adicionarCabecalhoEmpresa(y);
      y += 5;

      // 1. Resumo Executivo
      doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text("Resumo Executivo", 20, y);
      y += 8;
      const larguraCard = (pageWidth - 50) / 3;
      const metricaCards = [
        { titulo: "Vendas", valor: quantidadeVendas, cor: cores.destaque, prefixo: "", formatar: (v) => v.toString() },
        { titulo: "Faturamento", valor: totalVendasBruto, cor: cores.sucesso, prefixo: "R$ ", formatar: (v) => v.toFixed(2).replace('.', ',') },
        { titulo: "Saldo Líquido", valor: totalLiquido, cor: totalLiquido >= 0 ? cores.sucesso : [200, 0, 0], prefixo: "R$ ", formatar: (v) => v.toFixed(2).replace('.', ',') },
      ];

      let xCard = 20;
      metricaCards.forEach((card) => {
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(xCard, y, larguraCard, 20, 2, 2, "F");
        doc.setFontSize(8); doc.setTextColor(...cores.secundaria);
        doc.text(card.titulo, xCard + 5, y + 7);
        doc.setFontSize(11); doc.setTextColor(...card.cor);
        doc.text(card.prefixo + card.formatar(card.valor), xCard + 5, y + 15);
        xCard += larguraCard + 5;
      });
      y += 30;

      // 2. Tabela de Vendas (NOME CURTO + CPF)
      if (vendasFiltradas.length > 0) {
        if (y > pageHeight - 40) { doc.addPage(); y = adicionarCabecalhoPagina(); }
        doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.primaria);
        doc.text(`Detalhamento de Vendas`, 20, y); y += 6;
        
        doc.setFillColor(...cores.primaria); doc.rect(20, y, pageWidth - 40, 6, "F");
        doc.setTextColor(255, 255, 255); doc.setFontSize(8);
        doc.text("Data/Hora", 25, y + 4); 
        doc.text("Atendente (CPF)", 62, y + 4); // <--- Cabeçalho ajustado
        doc.text("Pagamento", 110, y + 4); 
        doc.text("Total", pageWidth - 25, y + 4, { align: "right" });
        y += 10;
        
        doc.setTextColor(...cores.primaria); doc.setFont("helvetica", "normal");
        vendasFiltradas.forEach(v => {
          if (y > pageHeight - 15) { doc.addPage(); y = adicionarCabecalhoPagina(); }
          
          const dataV = new Date(v.data_hora || v.data_venda).toLocaleString('pt-BR');
          doc.text(dataV, 25, y);
          
          // Formatação solicitada: Primeiro nome + CPF mascarado
          const identFunc = formatarIdentificacaoPDF(v.nome_atendente, v.cpf_atendente || v.cpf);
          doc.text(identFunc, 62, y);
          
          const pag = (v.pagamentos || []).map(p => p.metodo).join(', ');
          doc.text(pag.substring(0, 30), 110, y);
          
          doc.text(`R$ ${parseFloat(v.valor_total_bruto).toFixed(2).replace('.', ',')}`, pageWidth - 25, y, { align: "right" });
          y += 6;
        });
        y += 10;
      }

      // 3. Tabela de Retiradas
      if (retiradasFiltradas.length > 0) {
        if (y > pageHeight - 40) { doc.addPage(); y = adicionarCabecalhoPagina(); }
        doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.text(`Retiradas de Caixa`, 20, y); y += 6;
        doc.setFillColor(...cores.alerta); doc.rect(20, y, pageWidth - 40, 6, "F");
        doc.setTextColor(255, 255, 255); doc.setFontSize(8);
        doc.text("Data", 25, y + 4); doc.text("Motivo", 70, y + 4); doc.text("Valor", pageWidth - 25, y + 4, { align: "right" });
        y += 10;
        doc.setTextColor(...cores.primaria); doc.setFont("helvetica", "normal");
        retiradasFiltradas.forEach(r => {
          if (y > pageHeight - 15) { doc.addPage(); y = adicionarCabecalhoPagina(); }
          const dr = new Date(r.data_retirada || r.data_corrigida);
          doc.text(dr.toLocaleDateString('pt-BR'), 25, y);
          doc.text(r.motivo.substring(0, 45), 70, y);
          doc.text(`R$ ${parseFloat(r.valor).toFixed(2).replace('.', ',')}`, pageWidth - 25, y, { align: "right" });
          y += 6;
        });
        y += 10;
      }

      // 4. Seção de Observações Diárias
      if (observacoes && observacoes.length > 0) {
        if (y > pageHeight - 30) { doc.addPage(); y = adicionarCabecalhoPagina(); }
        
        doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.destaque);
        doc.text("Observações do Período", 20, y);
        y += 8;

        observacoes.forEach((obs) => {
          const textoProcessado = processarHtmlParaTexto(obs.texto);
          const partes = obs.data_observacao.split('T')[0].split('-');
          const dataNota = `${partes[2]}/${partes[1]}/${partes[0]}`;

          if (y > pageHeight - 15) { doc.addPage(); y = adicionarCabecalhoPagina(); }
          doc.setFontSize(9); doc.setFont("helvetica", "bold");
          doc.setTextColor(...cores.primaria);
          doc.text(`DATA: ${dataNota}`, 20, y);
          y += 6;

          doc.setFont("helvetica", "normal");
          doc.setTextColor(...cores.secundaria);
          const linhasObs = doc.splitTextToSize(textoProcessado, pageWidth - 40);
          
          linhasObs.forEach((linha) => {
            if (y > pageHeight - margemInferior) {
              doc.addPage();
              y = adicionarCabecalhoPagina();
              doc.setFontSize(8); doc.setFont("helvetica", "italic");
              doc.text(`(continuação nota ${dataNota})`, 20, y);
              y += 6;
              doc.setFontSize(9); doc.setFont("helvetica", "normal");
            }
            doc.text(linha, 25, y);
            y += 5; 
          });
          
          y += 5; 
        });
      }

      const totalPaginas = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(...cores.secundaria);
        doc.text(`Página ${i} de ${totalPaginas}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      const sufixo = (filtroDataInicio || filtroDataFim) ? `${filtroDataInicio || 'ini'}_a_${filtroDataFim || 'fim'}` : 'geral';
      doc.save(`relatorio_financeiro_${sufixo}.pdf`);

    } catch (error) { 
      console.error("Erro ao gerar PDF:", error); 
    } finally { 
      setGerandoPDF(false); 
    }
  };

  return { gerarPDF, gerandoPDF };
};