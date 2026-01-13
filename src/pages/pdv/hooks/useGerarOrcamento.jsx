// hooks/useGerarOrcamento.js
import { useState } from 'react';

export const useGerarOrcamento = () => {
  const [gerandoOrcamento, setGerandoOrcamento] = useState(false);
  const [erroPDF, setErroPDF] = useState(null);

  const formatarMoeda = (valor) => {
    return parseFloat(valor || 0)
      .toFixed(2)
      .replace('.', ',');
  };

  const gerarOrcamentoPDF = async ({ 
    produtosSelecionados, 
    totalGeral,
    nomeCliente = "",
    emailCliente = "",
    telefoneCliente = "",
    observacoes = "",
    dadosEmpresa
  }) => {
    if (!produtosSelecionados || produtosSelecionados.length === 0) {
      setErroPDF("Não há produtos selecionados para gerar orçamento.");
      console.warn("Não há produtos selecionados para gerar orçamento.");
      return;
    }

    setGerandoOrcamento(true);
    setErroPDF(null);

    try {
      // 1. Validação dos dados dos produtos
      const produtosValidos = produtosSelecionados.filter(produto => {
        return produto && produto.descricao && produto.preco !== undefined;
      });

      if (produtosValidos.length === 0) {
        throw new Error("Nenhum produto válido para gerar orçamento.");
      }

      // 2. Importação segura do jsPDF com fallback
      let jsPDF;
      try {
        const jspdfModule = await import("jspdf");
        jsPDF = jspdfModule.jsPDF;
      } catch (importError) {
        throw new Error("Biblioteca de PDF não disponível. Tente instalar: npm install jspdf");
      }

      // 3. Criação do documento
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 4. Configurações e Estilos (Cores e Padrões do Relatório)
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 20;
      let currentPage = 1;

      const cores = {
        primaria: [25, 25, 25], // Cinza Escuro/Preto (Para textos principais e barras)
        secundaria: [100, 100, 100], // Cinza Médio (Para subtítulos e detalhes)
        destaque: [41, 128, 185], // Azul (Para títulos e linhas decorativas)
        sucesso: [39, 174, 96], // Verde (Para Total)
        alerta: [230, 126, 34], // Laranja (Para Validade)
        fundo: [250, 250, 250], // Fundo de linhas alternadas
        borda: [230, 230, 230],
      };

      // 5. Função segura para adicionar texto
      const adicionarTexto = (texto, x, yPos, options = {}) => {
        try {
          if (!texto || texto === "undefined" || texto === "null") {
            texto = "-";
          }
          doc.text(String(texto), x, yPos, options);
        } catch (textError) {
          console.warn('Erro ao adicionar texto:', textError, { texto, x, yPos });
          doc.text("(erro)", x, yPos, options);
        }
      };

      // 6. Função para cabeçalho da página (Adaptada do Relatório)
      const adicionarCabecalhoPagina = () => {
        doc.setFillColor(...cores.primaria);
        doc.rect(0, 0, pageWidth, 15, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text("ORÇAMENTO", 20, 10);

        doc.setFontSize(9);
        doc.setTextColor(200, 200, 200);
        doc.text(`Página ${currentPage}`, pageWidth - 20, 10, { align: "right" });
        
        doc.setDrawColor(...cores.destaque);
        doc.setLineWidth(0.5);
        doc.line(20, 17, pageWidth - 20, 17);
        
        y = 25;
      };

      adicionarCabecalhoPagina();

      // 7. Informações da empresa (DINÂMICO e com estilo)
      try {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.destaque);
        adicionarTexto("INFORMAÇÕES DA EMPRESA", 20, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...cores.primaria);
        
        if (dadosEmpresa) {
          const nomePrincipal = dadosEmpresa.nome_fantasia || dadosEmpresa.razao_social || "Empresa Não Cadastrada";
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          adicionarTexto(nomePrincipal.toUpperCase(), 20, y);
          y += 5;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");

          if (dadosEmpresa.cnpj) {
            adicionarTexto(`CNPJ: ${dadosEmpresa.cnpj}`, 20, y);
            y += 4;
          }
          if (dadosEmpresa.inscricao_estadual) {
            adicionarTexto(`IE: ${dadosEmpresa.inscricao_estadual}`, 20, y);
            y += 4;
          }
          
          const enderecoCompleto = [
              dadosEmpresa.endereco,
              dadosEmpresa.cidade,
              dadosEmpresa.estado ? dadosEmpresa.estado : null,
              dadosEmpresa.cep ? `CEP: ${dadosEmpresa.cep}` : null
          ].filter(Boolean).join(' - ');

          if (enderecoCompleto) {
             adicionarTexto(`Endereço: ${enderecoCompleto}`, 20, y);
             y += 4;
          }
          
          const telefoneEmail = [
            dadosEmpresa.telefone ? `Tel: ${dadosEmpresa.telefone}` : null,
            dadosEmpresa.email ? `Email: ${dadosEmpresa.email}` : null
          ].filter(Boolean).join(' | ');

          if (telefoneEmail) {
            adicionarTexto(telefoneEmail, 20, y);
            y += 4;
          }

        } else {
          adicionarTexto("Dados da Empresa indisponíveis.", 20, y);
          y += 4;
        }

        y += 6;
        doc.setDrawColor(...cores.borda);
        doc.setLineWidth(0.3);
        doc.line(20, y, pageWidth - 20, y);
        y += 8;
      } catch (sectionError) {
        console.error('Erro na seção da empresa:', sectionError);
        y += 30;
      }

      // 8. Informações do cliente
      try {
        if (nomeCliente || emailCliente || telefoneCliente || observacoes) {
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...cores.destaque);
          adicionarTexto("INFORMAÇÕES DO CLIENTE", 20, y);
          y += 7;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...cores.primaria);

          if (nomeCliente) {
            adicionarTexto(`Nome: ${nomeCliente}`, 20, y);
            y += 4;
          }
          if (emailCliente) {
            adicionarTexto(`E-mail: ${emailCliente}`, 20, y);
            y += 4;
          }
          if (telefoneCliente) {
            adicionarTexto(`Telefone: ${telefoneCliente}`, 20, y);
            y += 4;
          }
          if (observacoes && observacoes.trim()) {
            doc.setFont("helvetica", "italic");
            adicionarTexto(`Observações: ${observacoes}`, 20, y);
            y += 4;
            doc.setFont("helvetica", "normal");
          }

          y += 6;
          doc.line(20, y, pageWidth - 20, y);
          y += 8;
        }
      } catch (clientError) {
        console.error('Erro na seção do cliente:', clientError);
        y += 20;
      }

      // 9. Tabela de produtos
      try {
        // Checagem de página
        if (y > pageHeight - 50) {
          doc.addPage();
          currentPage++;
          adicionarCabecalhoPagina();
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.destaque);
        adicionarTexto("DETALHES DOS PRODUTOS / SERVIÇOS", 20, y);
        y += 7;

        // Cabeçalho da tabela de produtos (Estilo Retângulo Preto)
        doc.setFillColor(...cores.primaria);
        doc.rect(20, y, pageWidth - 40, 6, "F");

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("Descrição", 25, y + 4);
        doc.text("Qtd.", 125, y + 4);
        doc.text("Unitário", 145, y + 4);
        doc.text("Total", pageWidth - 25, y + 4, { align: "right" });
        y += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        produtosValidos.forEach((produto, index) => {
          
          const preco = parseFloat(produto.preco || 0);
          const totalItem = preco * produto.quantidade;

          // Quebra de texto para a descrição
          const descricao = `${produto.categoria || ''} - ${produto.descricao || ''}`.trim();
          const descricaoLinhas = doc.splitTextToSize(descricao, 95); // 95mm de largura para a descrição

          // Altura da linha: 4mm por linha de texto + 2mm de padding
          const alturaNecessaria = descricaoLinhas.length * 4 + 2;

          if (y + alturaNecessaria > pageHeight - 20) {
            doc.addPage();
            currentPage++;
            adicionarCabecalhoPagina();
            y += 10;
            
            // Repete o cabeçalho da tabela
            doc.setFillColor(...cores.primaria);
            doc.rect(20, y, pageWidth - 40, 6, "F");
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text("Descrição", 25, y + 4);
            doc.text("Qtd.", 125, y + 4);
            doc.text("Unitário", 145, y + 4);
            doc.text("Total", pageWidth - 25, y + 4, { align: "right" });
            y += 7;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
          }

          // Fundo de linha alternado
          if (index % 2 === 0) {
            doc.setFillColor(...cores.fundo);
            doc.rect(20, y - 1, pageWidth - 40, alturaNecessaria, "F");
          }

          // Descrição (Múltiplas Linhas)
          doc.setTextColor(...cores.primaria);
          let linhaY = y + 4;
          descricaoLinhas.forEach(linha => {
             adicionarTexto(linha, 25, linhaY);
             linhaY += 4;
          });

          // Qtd., Unitário e Total (Alinhados à primeira linha da descrição)
          const yBase = y + 4;
          doc.setTextColor(...cores.secundaria);
          adicionarTexto(produto.quantidade, 125, yBase);
          
          doc.setTextColor(...cores.primaria);
          adicionarTexto(`R$ ${formatarMoeda(preco)}`, 145, yBase);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(...cores.sucesso);
          adicionarTexto(`R$ ${formatarMoeda(totalItem)}`, pageWidth - 25, yBase, { align: "right" });
          doc.setFont("helvetica", "normal"); // Reset bold

          y += alturaNecessaria; // Avança o Y pela altura total da célula
        });

        y += 10;
      } catch (productsError) {
        console.error('Erro na tabela de produtos:', productsError);
        y += produtosValidos.length * 15;
      }

      // 10. Resumo financeiro (SIMPLIFICADO)
      if (y > pageHeight - 60) {
        doc.addPage();
        currentPage++;
        adicionarCabecalhoPagina();
      }

      try {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.destaque);
        adicionarTexto("RESUMO FINANCEIRO", 20, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        
        // Subtotal
        doc.setTextColor(...cores.primaria);
        adicionarTexto("Subtotal:", 25, y + 4);
        doc.setTextColor(...cores.secundaria);
        adicionarTexto(`R$ ${formatarMoeda(totalGeral)}`, pageWidth - 25, y + 4, { align: "right" });
        y += 6;

        // Linha
        doc.setDrawColor(...cores.borda);
        doc.line(20, y, pageWidth - 20, y);
        y += 6;

        // Total
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...cores.sucesso);
        adicionarTexto("TOTAL DO ORÇAMENTO:", 25, y + 5);
        adicionarTexto(`R$ ${formatarMoeda(totalGeral)}`, pageWidth - 25, y + 5, { align: "right" });
        y += 10;

        // Validade
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(...cores.alerta);
        const dataValidade = new Date();
        dataValidade.setDate(dataValidade.getDate() + 30);
        adicionarTexto(`Validade da Proposta: ${dataValidade.toLocaleDateString('pt-BR')} (30 dias)`, 20, y + 4);
        y += 10;

      } catch (summaryError) {
        console.error('Erro no resumo financeiro:', summaryError);
      }

      // Rodapé de páginas (Numeração e Impressão)
      const totalPaginas = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);

        doc.setDrawColor(...cores.borda);
        doc.setLineWidth(0.3);
        doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...cores.secundaria);
        doc.text(`Orçamento • Página ${i} de ${totalPaginas}`, pageWidth / 2, pageHeight - 10, { align: "center" });

        const dataImpressao = new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });
        doc.text(`Impresso: ${dataImpressao}`, pageWidth - 20, pageHeight - 10, { align: "right" });
      }

      // 11. Salvar o arquivo
      try {
        const dataAtual = new Date().toISOString().split('T')[0];
        const nomeClienteFormatado = nomeCliente ? `_${nomeCliente.replace(/\s+/g, '_').substring(0, 20)}` : '';
        const nomeArquivo = `orcamento${nomeClienteFormatado}_${dataAtual}.pdf`;
        
        doc.save(nomeArquivo);
        
      } catch (saveError) {
        throw new Error("Erro ao salvar arquivo PDF. Verifique as permissões do navegador.");
      }

    } catch (error) {
      console.error("Erro crítico ao gerar orçamento PDF:", error);
      setErroPDF(error.message || "Erro desconhecido ao gerar PDF");
      alert(`Não foi possível gerar o PDF:\n${error.message}\n\nVerifique o console para mais detalhes.`);
      
    } finally {
      setGerandoOrcamento(false);
    }
  };

  return {
    gerarOrcamentoPDF,
    gerandoOrcamento,
    erroPDF
  };
};