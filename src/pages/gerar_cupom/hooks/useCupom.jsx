import { useState, useEffect, useCallback, useRef } from "react";
import clickSound from "/sounds/selecionar.mp3";

const URL_API_VENDAS = "http://localhost:3000/vendas";
const URL_API_EMPRESAS = "http://localhost:3000/empresas";

export const useCupom = () => {
  const [empresas, setEmpresas] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [detalhesVenda, setDetalhesVenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [gerandoPDF, setGerandoPDF] = useState(false);

  const audioClick = useRef(new Audio(clickSound));
  
  const click = useCallback(() => {
    audioClick.current.currentTime = 0;
    audioClick.current.volume = 1.0;
    audioClick.current.play();
  }, []);

  const formatarMoeda = useCallback((valor) => {
    return parseFloat(valor || 0)
      .toFixed(2)
      .replace(".", ",");
  }, []);
  
  const buscarDadosIniciais = useCallback(async () => {
    setCarregando(true);
    try {
      const [resVendas, resEmpresas] = await Promise.all([
        fetch(URL_API_VENDAS),
        fetch(URL_API_EMPRESAS),
      ]);

      const dadosVendas = await resVendas.json();
      const dadosEmpresas = await resEmpresas.json();

      setVendas(dadosVendas);
      setEmpresas(dadosEmpresas);

      // Define a empresa única automaticamente
      if (dadosEmpresas.length > 0) {
        setEmpresaSelecionada(dadosEmpresas[0]);
      }

      // Seleciona a primeira venda disponível
      if (dadosVendas.length > 0) {
        const primeiraVenda = dadosVendas.find(v => v.status_venda === 'Finalizada') || dadosVendas[0];
        setVendaSelecionada(primeiraVenda);
      }
      
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setErro("Erro ao carregar dados das APIs.");
      setCarregando(false);
    }
  }, []);

  const buscarDetalhesVenda = useCallback(async (idVenda) => {
    setDetalhesVenda(null);
    try {
      const resposta = await fetch(`${URL_API_VENDAS}/${idVenda}`);
      if (!resposta.ok) throw new Error("Falha ao buscar detalhes da venda.");
      const dados = await resposta.json();
      setDetalhesVenda(dados);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    }
  }, []);

  useEffect(() => {
    buscarDadosIniciais();
  }, [buscarDadosIniciais]);

  useEffect(() => {
    if (vendaSelecionada) {
      buscarDetalhesVenda(vendaSelecionada.id_venda);
    }
  }, [vendaSelecionada, buscarDetalhesVenda]);

  const handleVendaChange = useCallback((id) => {
    const venda = vendas.find((v) => v.id_venda === parseInt(id));
    setVendaSelecionada(venda || null);
    click();
  }, [vendas, click]);

  const gerarPDFCupom = useCallback(async () => {
    if (!empresaSelecionada || !detalhesVenda) {
        alert("Dados incompletos para gerar o cupom.");
        return;
    }

    setGerandoPDF(true);

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200]
      });

      const empresa = empresaSelecionada;
      const venda = detalhesVenda;
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 10;
      
      const LINHA_SPACE = 4.5;
      const ITEM_LINE_SPACE = 4;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(empresa.nome_fantasia || empresa.razao_social, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 5;

      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text(`CNPJ: ${empresa.cnpj} | IE: ${empresa.inscricao_estadual}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += LINHA_SPACE; 
      doc.text(empresa.endereco || '', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += LINHA_SPACE; 
      doc.text(`${empresa.cidade || ''}/${empresa.estado || ''}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += LINHA_SPACE; 
      doc.text(`Tel: ${empresa.telefone || ''}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8; 

      doc.line(5, yPosition, pageWidth - 5, yPosition);
      yPosition += LINHA_SPACE + 1; 

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Comprovante de Vendas', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += LINHA_SPACE + 1; 

      doc.setFont('helvetica', 'normal');
      doc.text(`Venda ID: ${venda.id_venda}`, 10, yPosition);
      yPosition += LINHA_SPACE; 
      doc.text(`Data: ${new Date(venda.data_hora).toLocaleString('pt-BR')}`, 10, yPosition);
      yPosition += 8;

      doc.line(5, yPosition, pageWidth - 5, yPosition);
      yPosition += LINHA_SPACE;

      doc.setFont('helvetica', 'bold');
      doc.text('ITEM', 10, yPosition);
      doc.text('QTD', 45, yPosition);
      doc.text('TOTAL', 65, yPosition);
      yPosition += 4;

      doc.line(5, yPosition, pageWidth - 5, yPosition);
      yPosition += 3;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);

      venda.itens?.forEach((item) => {
        const itemDescricaoCompleta = `${item.descricao_item.toUpperCase()} (${item.categoria})`; 
        const descricaoLinhas = doc.splitTextToSize(itemDescricaoCompleta, 50); 
        const initialY = yPosition; 
        
        descricaoLinhas.forEach((linha) => {
          doc.text(linha, 10, yPosition);
          yPosition += ITEM_LINE_SPACE; 
        });
        
        doc.text(item.quantidade.toString(), 45, initialY);
        doc.text(`R$ ${formatarMoeda(item.subtotal)}`, 65, initialY);
        yPosition += 1; 
      });

      yPosition += 3;
      doc.line(5, yPosition, pageWidth - 5, yPosition);
      yPosition += LINHA_SPACE + 2; 

      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL BRUTO: R$ ${formatarMoeda(venda.valor_total_bruto)}`, 10, yPosition);
      yPosition += LINHA_SPACE + 1; 

      doc.setFontSize(7);
      venda.pagamentos?.forEach((pag) => {
        doc.text(`${pag.metodo}: R$ ${formatarMoeda(pag.valor_pago)}`, 10, yPosition);
        yPosition += 3;
      });

      yPosition += 5;
      doc.line(5, yPosition, pageWidth - 5, yPosition);
      yPosition += 8;

      doc.setFontSize(6);
      doc.text('*** OBRIGADO PELA PREFERÊNCIA ***', pageWidth / 2, yPosition, { align: 'center' });

      doc.save(`cupom_venda_${venda.id_venda}.pdf`);
    } catch (error) {
      console.error('Erro PDF:', error);
    } finally {
      setGerandoPDF(false);
    }
  }, [empresaSelecionada, detalhesVenda, formatarMoeda]);

  return {
    empresas,
    vendas, 
    vendaSelecionada,
    empresaSelecionada,
    detalhesVenda,
    carregando,
    erro,
    gerandoPDF,
    click,
    formatarMoeda,
    handleVendaChange,
    gerarPDFCupom,
  };
};