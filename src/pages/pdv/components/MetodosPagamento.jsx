/* eslint-disable no-unused-vars */
// ADICIONADO useMemo NO IMPORT ABAIXO
import { useRef, useCallback, useEffect, useMemo } from "react";
import IconeDinheiroSrc from "/dinheiro.svg";
import IconeCreditoSrc from "/card.svg";
import IconePixSrc from "/pix.svg";
import IconeMistoSrc from "/misto.svg";
import somMetodosPagamento from "/sounds/efeitos/metodos_pagamento.mp3";
import { MetodosPagamentoStyled } from "./MetodosPagamentoStyled";

const MetodosPagamento = ({
  metodoPagamento,
  setMetodoPagamento,
  valorDinheiroRecebido,
  setValorDinheiroRecebido,
  inputValorRecebidoRef,
  pagamentosMistos,
  adicionarPagamentoMisto,
  removerPagamentoMisto,
  atualizarPagamentoMisto,
  totalGeral,
  somClick,
  somClickMenos
}) => {
  const metodos = ["Dinheiro", "Crédito", "Débito", "Pix", "Misto"];
  const iconesMetodos = [
    IconeDinheiroSrc, IconeCreditoSrc, IconeCreditoSrc, IconePixSrc, IconeMistoSrc,
  ];
  const opcoesMetodos = ["Dinheiro", "Crédito", "Débito", "Pix"];
  
  const valoresBrasileiros = [0.05, 0.10, 0.50, 1, 2, 5, 10, 20, 50, 100];

  const totalPagoMisto = pagamentosMistos.reduce((acc, p) => acc + p.valor, 0);
  
  // LOGICA RIGOROSA DE VERIFICAÇÃO DE PAGAMENTO
  const isPagoIntegralmente = useMemo(() => {
    if (totalGeral <= 0) return false;
    // Métodos eletrônicos assumem o valor total automaticamente
    if (["Crédito", "Débito", "Pix"].includes(metodoPagamento)) return true;
    // Dinheiro verifica se o recebido cobre o total
    if (metodoPagamento === "Dinheiro") return valorDinheiroRecebido >= totalGeral;
    // Misto verifica a soma com margem de erro para centavos
    if (metodoPagamento === "Misto") return totalPagoMisto >= (totalGeral - 0.01);
    return false;
  }, [metodoPagamento, totalGeral, valorDinheiroRecebido, totalPagoMisto]);

  const faltaPagarMisto = totalGeral > 0 ? Math.max(0, totalGeral - totalPagoMisto) : totalGeral;

  const somMetodos = useRef(new Audio(somMetodosPagamento)).current;

  useEffect(() => {
    if (metodoPagamento === "Dinheiro") {
      setTimeout(() => {
        inputValorRecebidoRef.current?.focus();
        inputValorRecebidoRef.current?.select();
      }, 50);
    } else if (metodoPagamento === "Misto") {
      setTimeout(() => {
        const primeiroInputMisto = document.querySelector(".input-misto-valor");
        primeiroInputMisto?.focus();
        primeiroInputMisto?.select();
      }, 50);
    }
  }, [metodoPagamento, inputValorRecebidoRef]);

  const tocarSomMetodo = () => {
    somMetodos.volume = 1;
    somMetodos.currentTime = 0;
    somMetodos.play().catch(() => {});
  };

  const formatarMoedaInput = (valor) => {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  };

  const adicionarValorRapido = (valorAdicional) => {
    const elementoAtivo = document.activeElement;

    if (metodoPagamento === "Dinheiro") {
      const atual = parseFloat(valorDinheiroRecebido) || 0;
      setValorDinheiroRecebido(formatarMoedaInput(atual + valorAdicional));
      somClick();
    } 
    else if (metodoPagamento === "Misto") {
      if (elementoAtivo && elementoAtivo.className.includes("input-misto-valor")) {
        const todosInputs = Array.from(document.querySelectorAll(".input-misto-valor"));
        const index = todosInputs.indexOf(elementoAtivo);
        
        if (index !== -1) {
          const pagamentoAlvo = pagamentosMistos[index];
          const valorAtual = parseFloat(pagamentoAlvo.valor) || 0;
          atualizarPagamentoMisto(pagamentoAlvo.id, { 
            valor: formatarMoedaInput(valorAtual + valorAdicional) 
          });
          somClick();
        }
      } else if (pagamentosMistos.length > 0) {
        const primeiro = pagamentosMistos[0];
        atualizarPagamentoMisto(primeiro.id, { 
          valor: formatarMoedaInput(primeiro.valor + valorAdicional) 
        });
        somClick();
      }
    }
  };

  const limparValorAlvo = () => {
    const elementoAtivo = document.activeElement;
    somClickMenos();

    if (metodoPagamento === "Dinheiro") {
      setValorDinheiroRecebido(0);
      inputValorRecebidoRef.current?.focus();
    } 
    else if (metodoPagamento === "Misto" && elementoAtivo?.className.includes("input-misto-valor")) {
      const todosInputs = Array.from(document.querySelectorAll(".input-misto-valor"));
      const index = todosInputs.indexOf(elementoAtivo);
      if (index !== -1) {
        atualizarPagamentoMisto(pagamentosMistos[index].id, { valor: 0 });
        elementoAtivo.focus();
      }
    }
  };

  const preencherValorExato = () => {
    setValorDinheiroRecebido(formatarMoedaInput(totalGeral));
    tocarSomMetodo();
    setTimeout(() => inputValorRecebidoRef.current?.focus(), 10);
  };

  const aplicarArredondamento = () => {
    const calcularArredondamentoDinamico = (valorAtualNoInput) => {
      const sugestoes = [1, 2, 5, 10, 20, 50, 100];
      const baseParaSugestao = valorAtualNoInput > 0 ? valorAtualNoInput : totalGeral;
      let sugestao = sugestoes.find(s => s > (baseParaSugestao + 0.01));
      if (!sugestao) sugestao = Math.ceil((baseParaSugestao + 0.01) / 50) * 50;
      return sugestao;
    };

    const valorSugerido = calcularArredondamentoDinamico(valorDinheiroRecebido);
    setValorDinheiroRecebido(formatarMoedaInput(valorSugerido));
    somClick();
    setTimeout(() => inputValorRecebidoRef.current?.focus(), 10);
  };

  const handleAjusteValorDinheiro = useCallback((delta) => {
    const valorAtual = parseFloat(valorDinheiroRecebido) || 0;
    const novoValor = Math.max(0, valorAtual + delta);
    setValorDinheiroRecebido(formatarMoedaInput(novoValor));
  }, [valorDinheiroRecebido, setValorDinheiroRecebido]);

  const handleAjusteValorMisto = (id, valorAtual, delta) => {
    const novoValor = Math.max(0, (parseFloat(valorAtual) || 0) + delta);
    atualizarPagamentoMisto(id, { valor: formatarMoedaInput(novoValor) });
  };

  const GradeValoresRapidos = () => (
    <div className="coluna-cedulas-rapidas">
      <label className="label-moderna">ADICIONAR VALORES</label>
      <div className="grade-cedulas">
        {valoresBrasileiros.map(valor => (
          <button 
            key={valor} 
            type="button" 
            className="btn-cedula-rapida" 
            onMouseDown={(e) => e.preventDefault()} 
            onClick={() => adicionarValorRapido(valor)}
          >
            +{valor < 1 ? valor.toFixed(2).replace('.', ',') : valor}
          </button>
        ))}
        <button 
          type="button" 
          className="btn-cedula-rapida limpar" 
          onMouseDown={(e) => e.preventDefault()} 
          onClick={limparValorAlvo}
        >
          LIMPAR
        </button>
      </div>
    </div>
  );

  return (
    <MetodosPagamentoStyled>
      <div className="grade-metodos-pagamento-topo">
        {metodos.map((m, index) => (
          <button
            type="button"
            key={m}
            className={`botao-metodo-moderno ${metodoPagamento === m ? "ativo" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setMetodoPagamento(m);
              tocarSomMetodo();
            }}
          >
            <img src={iconesMetodos[index]} alt={m} className="icone-metodo-img" />
            <strong>{m.toUpperCase()}</strong>
          </button>
        ))}
      </div>

      <div className="painel-configuracao-pagamento">
        {metodoPagamento === "Dinheiro" && (
          <div className="card-config-dinheiro">
            <div className="layout-dinheiro-horizontal">
              <div className="coluna-input-principal">
                <label className="label-moderna">VALOR RECEBIDO</label>
                <div className="seletor-valor-pill">
                  <button type="button" className="btn-ajuste" onMouseDown={(e) => e.preventDefault()} onClick={() => { handleAjusteValorDinheiro(-1); somClickMenos(); }}>-</button>
                  <input
                    ref={inputValorRecebidoRef}
                    type="number"
                    value={valorDinheiroRecebido || ""}
                    onChange={(e) => setValorDinheiroRecebido(parseFloat(e.target.value) || 0)}
                    className="input-valor-principal valorrecebido"
                  />
                  <button type="button" className="btn-ajuste" onMouseDown={(e) => e.preventDefault()} onClick={() => { handleAjusteValorDinheiro(1); somClick(); }}>+</button>
                </div>
                
                <div className="status-pagamento-notificacao">
                    {isPagoIntegralmente ? (
                        <span className="pago-integral" style={{color: '#64ff8a', fontWeight: 'bold'}}>✅ PAGO INTEGRALMENTE</span>
                    ) : (
                        <span className="aguardando" style={{color: '#ffc107'}}>⚠️ AGUARDANDO VALOR...</span>
                    )}
                </div>

                <div className="acoes-sugestao-container">
                  <button type="button" className="btn-sugestao exato" onMouseDown={(e) => e.preventDefault()} onClick={preencherValorExato}>VALOR EXATO</button>
                  <button type="button" className="btn-sugestao arredondar" onMouseDown={(e) => e.preventDefault()} onClick={aplicarArredondamento}>ARREDONDAR</button>
                </div>
              </div>
              <GradeValoresRapidos />
            </div>
          </div>
        )}

        {metodoPagamento === "Misto" && (
          <div className="card-pagamento-misto">
            <div className="layout-misto-horizontal">
              <div className="coluna-lista-mista">
                <div className="cabecalho-misto-moderno">
                  <h4>PAGAMENTOS MÚLTIPLOS</h4>
                  <button type="button" className="btn-adicionar-metodo-misto" onMouseDown={(e) => e.preventDefault()} onClick={() => { adicionarPagamentoMisto("Crédito"); somClick(); }}>+ ADICIONAR</button>
                </div>
                <div className="lista-itens-mistos">
                  {pagamentosMistos.map((pagamento) => (
                    <div key={pagamento.id} className="item-misto-card">
                      <select className="select-moderno" value={pagamento.metodo} onChange={(e) => { atualizarPagamentoMisto(pagamento.id, { metodo: e.target.value }); somClick(); }}>
                        {opcoesMetodos.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <div className="seletor-valor-pill pequeno">
                        <button type="button" className="btn-ajuste-p" onMouseDown={(e) => e.preventDefault()} onClick={() => { handleAjusteValorMisto(pagamento.id, pagamento.valor, -1); somClickMenos(); }}>-</button>
                        <input 
                          type="number" 
                          className="input-misto-valor" 
                          value={pagamento.valor || ""} 
                          onChange={(e) => atualizarPagamentoMisto(pagamento.id, { valor: parseFloat(e.target.value) || 0 })} 
                        />
                        <button type="button" className="btn-ajuste-p" onMouseDown={(e) => e.preventDefault()} onClick={() => { handleAjusteValorMisto(pagamento.id, pagamento.valor, 1); somClick(); }}>+</button>
                      </div>
                      <button type="button" className="btn-remover-misto" onMouseDown={(e) => e.preventDefault()} onClick={() => { removerPagamentoMisto(pagamento.id); somClickMenos(); }}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="resumo-misto-moderno">
                  <div className="linha-resumo-mista">
                      <span>TOTAL PAGO:</span>
                      <strong style={{color: isPagoIntegralmente ? '#64ff8a' : 'white'}}>R$ {totalPagoMisto.toFixed(2)}</strong>
                  </div>
                  {!isPagoIntegralmente && (
                      <div className="linha-resumo-mista">
                          <span>FALTANDO:</span>
                          <strong className="pendente" style={{color: '#ff4b4b'}}>R$ {faltaPagarMisto.toFixed(2)}</strong>
                      </div>
                  )}
                  {isPagoIntegralmente && <div className="pago-integral-misto" style={{color: '#64ff8a', fontWeight: 'bold', marginTop: '10px'}}>✅ PAGO INTEGRALMENTE</div>}
                </div>
              </div>
              <GradeValoresRapidos />
            </div>
          </div>
        )}
        
        {["Crédito", "Débito", "Pix"].includes(metodoPagamento) && (
          <div className="status-metodo-simples" style={{textAlign: 'center', padding: '40px'}}>
             <p>Aguardando confirmação no terminal de {metodoPagamento}...</p>
             <h2 style={{color: '#64ff8a', fontSize: '2.5rem'}}>R$ {totalGeral.toFixed(2).replace('.', ',')}</h2>
             <div className="pago-integral-badge" style={{background: '#1b5e20', color: '#64ff8a', padding: '10px', borderRadius: '8px', display: 'inline-block', marginTop: '20px'}}>✅ PAGO INTEGRALMENTE</div>
          </div>
        )}
      </div>
    </MetodosPagamentoStyled>
  );
};

export default MetodosPagamento;