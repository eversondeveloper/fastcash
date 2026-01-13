/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import somCancelar from "/sounds/efeitos/cancelar1.mp3";
import somFinalizar from "/sounds/efeitos/printer2.mp3";

const URL_API_VENDAS = "http://localhost:3000/vendas";
const URL_API_PRODUTOS = "http://localhost:3000/produtos";

export const useVendas = (sessaoAtual) => {
  const [produtosDB, setProdutosDB] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [valorDinheiroRecebido, setValorDinheiroRecebido] = useState(0);
  const [metodoPagamento, setMetodoPagamento] = useState("Dinheiro");
  const [valorOutroMetodo, setValorOutroMetodo] = useState(0);
  const [metodoSecundario, setMetodoSecundario] = useState("Crédito");
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [mensagemFlutuante, setMensagemFlutuante] = useState("");

  const [pagamentosMistos, setPagamentosMistos] = useState([
    { id: 1, metodo: "Dinheiro", valor: 0 },
    { id: 2, metodo: "Crédito", valor: 0 },
  ]);

  const audioFinalizar = useRef(new Audio(somFinalizar));
  const audioCancelar = useRef(new Audio(somCancelar));

  const somFinalizarVenda = () => {
    audioFinalizar.current.currentTime = 0;
    audioFinalizar.current.play().catch(() => {});
  };

  const somCancelarVenda = () => {
    audioCancelar.current.currentTime = 0;
    audioCancelar.current.play().catch(() => {});
  };

  const inputFiltroBuscaRef = useRef(null);
  const inputValorRecebidoRef = useRef(null);
  const botaoFinalizarRef = useRef(null);
  
  const buscarProdutos = useCallback(async () => {
    try {
      setCarregandoProdutos(true);
      const resposta = await fetch(URL_API_PRODUTOS);
      if (!resposta.ok) throw new Error("Erro na API");
      const dados = await resposta.json();
      setProdutosDB(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setMensagemFlutuante("❌ Erro ao carregar catálogo.");
    } finally {
      setCarregandoProdutos(false);
    }
  }, []);

  useEffect(() => {
    buscarProdutos();
  }, [buscarProdutos]);

  useEffect(() => {
    if (mensagemFlutuante) {
      const timer = setTimeout(() => setMensagemFlutuante(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagemFlutuante]);

  useEffect(() => {
    const metodosFechados = ["Crédito", "Débito", "Pix"];
    if (metodosFechados.includes(metodoPagamento)) {
      setValorDinheiroRecebido(0);
      setPagamentosMistos([
        { id: 1, metodo: "Dinheiro", valor: 0 },
        { id: 2, metodo: "Crédito", valor: 0 },
      ]);
    } else if (metodoPagamento !== "Misto") {
      setValorDinheiroRecebido(0);
    }
  }, [metodoPagamento]);

  const totalGeral = useMemo(
    () => produtosSelecionados.reduce((acc, p) => acc + parseFloat(p.preco || 0) * p.quantidade, 0),
    [produtosSelecionados]
  );

  useEffect(() => {
    if (metodoPagamento === "Misto") {
      const valorRestante = totalGeral - valorDinheiroRecebido;
      setValorOutroMetodo(Math.max(0, valorRestante));
      setPagamentosMistos((prev) => {
        if (totalGeral === 0) return [{ id: 1, metodo: "Dinheiro", valor: 0 }, { id: 2, metodo: "Crédito", valor: 0 }];
        const novos = [...prev];
        if (novos.length > 0 && novos[0].metodo === "Dinheiro") {
          novos[0] = { ...novos[0], valor: valorDinheiroRecebido };
        }
        return novos;
      });
    }
  }, [metodoPagamento, valorDinheiroRecebido, totalGeral]);

  const valorPagoTotal = useMemo(() => {
    if (totalGeral === 0) return 0;
    if (metodoPagamento === "Misto") return pagamentosMistos.reduce((acc, p) => acc + p.valor, 0);
    if (["Crédito", "Débito", "Pix"].includes(metodoPagamento)) return totalGeral;
    return valorDinheiroRecebido;
  }, [metodoPagamento, valorDinheiroRecebido, pagamentosMistos, totalGeral]);

  // --- CORREÇÃO: VALOR FALTANDO AGORA CONSIDERA SE A VENDA FOI INICIADA ---
  const valorFaltando = useMemo(() => {
    if (totalGeral <= 0) return 0;
    return Math.max(0, totalGeral - valorPagoTotal);
  }, [totalGeral, valorPagoTotal]);

  const valorTroco = useMemo(() => {
    if (["Crédito", "Débito", "Pix"].includes(metodoPagamento)) return 0;
    if (totalGeral <= 0 || valorPagoTotal <= totalGeral) return 0;
    return valorPagoTotal - totalGeral;
  }, [valorPagoTotal, totalGeral, metodoPagamento]);

  // --- CORREÇÃO: PODE FINALIZAR EXIGE TOTAL > 0 ---
  const podeFinalizarVenda = useMemo(() => {
    if (!sessaoAtual || totalGeral <= 0) return false; // Trava aqui
    if (["Crédito", "Débito", "Pix"].includes(metodoPagamento)) return true;
    return valorPagoTotal >= (totalGeral - 0.01);
  }, [produtosSelecionados.length, totalGeral, metodoPagamento, valorPagoTotal, sessaoAtual]);

  const adicionarProduto = useCallback((item) => {
    if (!sessaoAtual) return setMensagemFlutuante("⚠️ Abra o caixa para vender.");
    const produtoExistente = produtosSelecionados.find(p => p.id_produto === item.id_produto);
    const produtoOriginal = produtosDB.find(p => p.id_produto === item.id_produto);
    if (!produtoOriginal) return;

    const quantidadeAtual = produtoExistente ? produtoExistente.quantidade : 0;
    if (produtoOriginal.tipo_item === "Produto" && produtoOriginal.estoque_atual <= quantidadeAtual) {
      return setMensagemFlutuante("⚠️ Estoque insuficiente.");
    }

    if (produtoExistente) {
      setProdutosSelecionados(prev => prev.map(p => p.id_produto === item.id_produto ? { ...p, quantidade: p.quantidade + 1 } : p));
    } else {
      setProdutosSelecionados(prev => [...prev, { ...item, idUnico: Date.now() + Math.random(), quantidade: 1 }]);
    }
  }, [produtosDB, produtosSelecionados, sessaoAtual]);

  const removerProduto = useCallback((idUnico) => setProdutosSelecionados(prev => prev.filter(p => p.idUnico !== idUnico)), []);

  const handleQuantidadeChange = useCallback((idUnico, novaQtdStr) => {
    const novaQtd = Math.max(1, parseFloat(novaQtdStr) || 1);
    setProdutosSelecionados(prev => prev.map(p => p.idUnico === idUnico ? { ...p, quantidade: novaQtd } : p));
  }, []);

  const adicionarPagamentoMisto = useCallback((metodo = "Crédito") => {
    const novoId = Date.now();
    setPagamentosMistos((prev) => [...prev, { id: novoId, metodo, valor: 0 }]);
  }, []);

  const removerPagamentoMisto = useCallback((id) => {
    if (pagamentosMistos.length <= 2) return setMensagemFlutuante("⚠️ Mínimo 2 métodos.");
    setPagamentosMistos((prev) => prev.filter((p) => p.id !== id));
  }, [pagamentosMistos.length]);

  const atualizarPagamentoMisto = useCallback((id, updates) => {
    setPagamentosMistos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const resetarCaixa = useCallback(() => {
    setProdutosSelecionados([]);
    setValorDinheiroRecebido(0);
    setMetodoPagamento("Dinheiro");
    setPagamentosMistos([{ id: 1, metodo: "Dinheiro", valor: 0 }, { id: 2, metodo: "Crédito", valor: 0 }]);
    inputFiltroBuscaRef.current?.focus();
  }, []);

  const finalizarVenda = useCallback(async (limparFiltrosCallback) => {
    if (!sessaoAtual) return setMensagemFlutuante("❌ Erro: Abra o caixa.");

    const pagamentosFinal = [];
    if (metodoPagamento === "Misto") {
      pagamentosMistos.forEach(p => { if (p.valor > 0) pagamentosFinal.push({ metodo: p.metodo, valor_pago: p.valor }); });
    } else {
      const valorParaRegistrar = ["Crédito", "Débito", "Pix"].includes(metodoPagamento) ? totalGeral : valorDinheiroRecebido;
      pagamentosFinal.push({ metodo: metodoPagamento, valor_pago: valorParaRegistrar || 0 });
    }

    const venda = {
      id_sessao: sessaoAtual.id_sessao,
      id_atendente: sessaoAtual.id_atendente,
      id_empresa: sessaoAtual.id_empresa,
      valor_total_bruto: totalGeral,
      valor_pago_total: valorPagoTotal,
      valor_troco: valorTroco,
      status_venda: 'Finalizada',
      itens: produtosSelecionados.map(i => ({
        id_produto: i.id_produto,
        categoria: i.categoria || "Geral",
        descricao_item: i.descricao || i.descricao_item, 
        preco_unitario: i.preco || 0,
        quantidade: i.quantidade || 0,
        subtotal: (parseFloat(i.preco) * i.quantidade) || 0,
      })),
      pagamentos: pagamentosFinal
    };

    try {
      const r = await fetch(URL_API_VENDAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });
      const resJson = await r.json();
      if (r.ok) {
        somFinalizarVenda();
        setMensagemFlutuante(`✅ Venda registrada!`);
        if (limparFiltrosCallback) limparFiltrosCallback();
        resetarCaixa();
        buscarProdutos(); 
      } else {
        setMensagemFlutuante(`❌ Erro: ${resJson.erro || "Falha"}`);
      }
    } catch (error) {
      setMensagemFlutuante("❌ Erro de conexão.");
    }
  }, [totalGeral, sessaoAtual, produtosSelecionados, pagamentosMistos, valorPagoTotal, valorTroco, metodoPagamento, resetarCaixa, buscarProdutos, valorDinheiroRecebido]);

  const cancelarVenda = useCallback((limparFiltrosCallback) => {
    if (window.confirm("Cancelar venda?")) {
      somCancelarVenda();
      resetarCaixa();
      if (limparFiltrosCallback) limparFiltrosCallback();
    }
  }, [resetarCaixa]);

  return {
    produtosDB, produtosSelecionados, carregandoProdutos,
    mensagemFlutuante, setMensagemFlutuante, valorDinheiroRecebido, setValorDinheiroRecebido,
    metodoPagamento, setMetodoPagamento, valorOutroMetodo, setValorOutroMetodo,
    metodoSecundario, setMetodoSecundario, pagamentosMistos, 
    inputFiltroBuscaRef, inputValorRecebidoRef, botaoFinalizarRef, 
    totalGeral, valorPagoTotal, valorTroco, valorFaltando, // EXPORTADO valorFaltando
    podeFinalizarVenda, adicionarProduto, removerProduto, handleQuantidadeChange,
    adicionarPagamentoMisto, removerPagamentoMisto, atualizarPagamentoMisto,
    finalizarVenda, cancelarVenda, resetarCaixa,
  };
};