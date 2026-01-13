import { useVendas } from "./hooks/useVendas";
import { useFiltros } from "./hooks/useFiltros";
import { useAtalhos } from "./hooks/useAtalhos";
import { useEmpresa } from "./hooks/useEmpresa";
import { useOrganizacao } from "./hooks/useOrganizacao";
import ToastMensagem from "./components/ToastMensagem";
import FiltrosCatalogo from "./components/FiltrosCatalogo";
import ListaProdutos from "./components/ListaProdutos";
import ProdutosSelecionados from "./components/ProdutosSelecionados";
import MetodosPagamento from "./components/MetodosPagamento";
import ResumoVenda from "./components/ResumoVenda";
import { ComponenteVendasStyled } from "./ComponenteVendasStyled";
import { useRef, useCallback } from "react"; 
import { useNavigate } from "react-router-dom";

import somMetodosPagamento from "/sounds/efeitos/metodos_pagamento.mp3";
import somClickArquivo from "/sounds/efeitos/selecionar1.mp3";
import somClickArquivoMenos from "/sounds/efeitos/selecionarmenos.mp3";

const METODOS_NAVEGACAO = ["Dinheiro", "Crédito", "Débito", "Pix", "Misto"];

export default function ComponenteVendas({ sessaoAtual, temAtendentes }) {
  const navigate = useNavigate();

  // --- ÁUDIOS ---
  const audioMetodos = useRef(new Audio(somMetodosPagamento));
  const audioClickProduto = useRef(new Audio(somClickArquivo));
  const audioClickProdutoMenos = useRef(new Audio(somClickArquivoMenos));

  const tocarSomMetodo = useCallback(() => {
    audioMetodos.current.currentTime = 0;
    audioMetodos.current.play().catch(() => {});
  }, []);

  const tocarSomProduto = useCallback(() => {
    audioClickProduto.current.currentTime = 0;
    audioClickProduto.current.play().catch(() => {});
  }, []);

  const tocarSomProdutoMenos = useCallback(() => {
    audioClickProdutoMenos.current.currentTime = 0;
    audioClickProdutoMenos.current.play().catch(() => {});
  }, []);

  // --- HOOKS DE LÓGICA ---
  const {
    produtosDB,
    produtosSelecionados,
    carregandoProdutos,
    mensagemFlutuante,
    setMensagemFlutuante,
    valorDinheiroRecebido,
    setValorDinheiroRecebido,
    metodoPagamento,
    setMetodoPagamento,
    valorOutroMetodo,
    metodoSecundario,
    setMetodoSecundario,
    pagamentosMistos,
    adicionarPagamentoMisto,
    removerPagamentoMisto,
    atualizarPagamentoMisto,
    inputFiltroBuscaRef,
    inputValorRecebidoRef,
    totalGeral,
    valorPagoTotal,
    valorFaltando,
    valorTroco,
    podeFinalizarVenda,
    adicionarProduto,
    removerProduto,
    handleQuantidadeChange,
    finalizarVenda,
    cancelarVenda,
  } = useVendas(sessaoAtual); 

  const {
    filtroCategoriasSelecionadas,
    filtroTipoItem,
    filtroBusca,
    filtrosExpandidos,
    setFiltroBusca,
    setFiltrosExpandidos,
    categoriasUnicas,
    produtosFiltrados,
    temFiltrosAtivos,
    toggleCategoriaFiltro,
    setFiltroTipoItem,
    limparFiltros
  } = useFiltros(produtosDB);

  const { empresa } = useEmpresa();
  const { modoOrganizacao, setModoOrganizacao, OPCOES_ORGANIZACAO } = useOrganizacao();

  // --- FUNÇÕES DE AÇÃO COM LIMPEZA ---
  const handleFinalizarVendaComLimpeza = useCallback(() => {
    finalizarVenda(() => {
      limparFiltros();
      setFiltrosExpandidos(false);
    });
  }, [finalizarVenda, limparFiltros, setFiltrosExpandidos]);

  const handleCancelarVendaComLimpeza = useCallback(() => {
    cancelarVenda(() => {
      limparFiltros();
      setFiltrosExpandidos(false);
    });
  }, [cancelarVenda, limparFiltros, setFiltrosExpandidos]);

  const alternarMetodoPagamento = useCallback(() => {
    const currentIndex = METODOS_NAVEGACAO.indexOf(metodoPagamento);
    const nextIndex = (currentIndex + 1) % METODOS_NAVEGACAO.length;
    const nextMetodo = METODOS_NAVEGACAO[nextIndex];

    tocarSomMetodo();
    setMetodoPagamento(nextMetodo);

    if (nextMetodo === "Dinheiro" || nextMetodo === "Misto") {
      setTimeout(() => inputValorRecebidoRef.current?.focus(), 50);
    }
  }, [metodoPagamento, setMetodoPagamento, tocarSomMetodo, inputValorRecebidoRef]);

  // --- ATALHOS ---
  useAtalhos({
    podeFinalizarVenda,
    finalizarVenda: handleFinalizarVendaComLimpeza,
    cancelarVenda: handleCancelarVendaComLimpeza,
    produtosSelecionados,
    removerProduto,
    limparFiltros,
    setMetodoPagamento,
    alternarMetodoPagamento,
    inputFiltroBuscaRef,
    inputValorRecebidoRef
  });

  // --- TELA DE BLOQUEIO (Sessão ou Atendentes) ---
  if (!temAtendentes || !sessaoAtual) {
    return (
      <ComponenteVendasStyled>
        <div className="container-bloqueio-caixa">
          <div className="card-bloqueio">
            <span className="icone-bloqueio">{!temAtendentes ? "👤" : "🔒"}</span>
            <h2>Caixa Indisponível</h2>
            <p>
              {!temAtendentes 
                ? "Nenhum atendente cadastrado no sistema." 
                : "É necessário abrir uma sessão de caixa para realizar vendas."}
            </p>
            <button 
              className="btn-ir-atendentes" 
              onClick={() => navigate("/everscash/atendentes_sessao")}
            >
              {!temAtendentes ? "Cadastrar Atendente" : "Ir para Gestão de Caixa"}
            </button>
          </div>
        </div>
      </ComponenteVendasStyled>
    );
  }

  return (
    <ComponenteVendasStyled>
      <ToastMensagem mensagem={mensagemFlutuante} onClose={() => setMensagemFlutuante("")} />

      <div className="buttons">
        <FiltrosCatalogo
          filtroBusca={filtroBusca}
          setFiltroBusca={setFiltroBusca}
          filtrosExpandidos={filtrosExpandidos}
          setFiltrosExpandidos={setFiltrosExpandidos}
          categoriasUnicas={categoriasUnicas}
          filtroCategoriasSelecionadas={filtroCategoriasSelecionadas}
          toggleCategoriaFiltro={toggleCategoriaFiltro}
          filtroTipoItem={filtroTipoItem}
          setFiltroTipoItem={setFiltroTipoItem}
          temFiltrosAtivos={temFiltrosAtivos}
          limparFiltros={limparFiltros}
          inputFiltroBuscaRef={inputFiltroBuscaRef}
        />

        <div className="buttons2">
          <ListaProdutos
            carregandoProdutos={carregandoProdutos}
            produtosFiltrados={produtosFiltrados}
            produtosSelecionados={produtosSelecionados}
            adicionarProduto={adicionarProduto}
            corTextoBtn="#cecece"
            somClick={tocarSomProduto}
            modoOrganizacao={modoOrganizacao}
            setModoOrganizacao={setModoOrganizacao}
            OPCOES_ORGANIZACAO={OPCOES_ORGANIZACAO}
          />
        </div>
      </div>

      <div className="controles">
        {produtosSelecionados.length > 0 ? (
          <>
            <ProdutosSelecionados
              produtosSelecionados={produtosSelecionados}
              removerProduto={removerProduto}
              handleQuantidadeChange={handleQuantidadeChange}
              totalGeral={totalGeral}
              dadosEmpresa={empresa}
              somClick={tocarSomProduto}
              somClickMenos={tocarSomProdutoMenos}
            />

            <div className="pagamento">
              <div className="metodos-pagamento-container">
                <MetodosPagamento
                  metodoPagamento={metodoPagamento}
                  setMetodoPagamento={setMetodoPagamento}
                  metodoSecundario={metodoSecundario}
                  setMetodoSecundario={setMetodoSecundario}
                  valorDinheiroRecebido={valorDinheiroRecebido}
                  setValorDinheiroRecebido={setValorDinheiroRecebido}
                  valorOutroMetodo={valorOutroMetodo}
                  inputValorRecebidoRef={inputValorRecebidoRef}
                  pagamentosMistos={pagamentosMistos}
                  adicionarPagamentoMisto={adicionarPagamentoMisto}
                  removerPagamentoMisto={removerPagamentoMisto}
                  atualizarPagamentoMisto={atualizarPagamentoMisto}
                  totalGeral={totalGeral}
                  somClick={tocarSomProduto}
                  somClickMenos={tocarSomProdutoMenos}
                />
              </div>

              <div className="resumo-pagamento-container">
                <ResumoVenda
                  metodoPagamento={metodoPagamento}
                  metodoSecundario={metodoSecundario}
                  totalGeral={totalGeral}
                  valorFaltando={valorFaltando}
                  valorTroco={valorTroco}
                  podeFinalizarVenda={podeFinalizarVenda}
                  finalizarVenda={handleFinalizarVendaComLimpeza}
                  cancelarVenda={handleCancelarVendaComLimpeza}
                  pagamentosMistos={pagamentosMistos}
                  valorPagoTotal={valorPagoTotal}
                  somClick={tocarSomProduto}
                  somClickMenos={tocarSomProdutoMenos}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="espera-venda">
            <div className="logo-espera">{empresa?.nome_fantasia?.toUpperCase() || "EVERSCASH"}</div>
            <div className="letreiro-container">
              <h2 className="letreiro-status">CAIXA LIVRE</h2>
            </div>
            <div className="instrucoes-venda">
              <p>Selecione produtos no catálogo para iniciar uma venda</p>
              <div className="atalhos-dica">
                <span><strong>[MOUSE]</strong> Selecionar Produtos</span>
                <span><strong>[BACKSPACE]</strong> Excluir Produtos</span>
                <span><strong>[F2]</strong> Métodos de Pagamento</span>
                <span><strong>[ESC]</strong> Cancelar Venda</span>
                <span><strong>[ENTER]</strong> Finalizar Venda</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ComponenteVendasStyled>
  );
}