import { ResumoVendaStyled } from "./ResumoVendaStyled";

const ResumoVenda = ({
  metodoPagamento,
  totalGeral,
  valorFaltando,
  valorTroco,
  podeFinalizarVenda,
  finalizarVenda,
  cancelarVenda,
  pagamentosMistos,
  valorPagoTotal,
}) => {
  const metodosUsadosMisto = pagamentosMistos?.filter((p) => p.valor > 0) || [];

  // --- Lógica de Arredondamento Seguro para Exibição ---
  const formatarMoeda = (valor) => {
    const limpo = Math.round((valor + Number.EPSILON) * 100) / 100;
    return limpo.toFixed(2).replace(".", ",");
  };

  const formatarMetodosMistos = () => {
    if (metodoPagamento !== "Misto" || !metodosUsadosMisto.length) {
      return metodoPagamento;
    }
    if (metodosUsadosMisto.length === 1) {
      return metodosUsadosMisto[0].metodo;
    }
    return metodosUsadosMisto.map((p) => p.metodo).join(" + ");
  };

  // --- Lógica de Status Corrigida ---
  // Uma venda só pode ser considerada "Paga" se houver itens no carrinho (total > 0)
  const vendaIniciada = totalGeral > 0.001;
  const temPendencia = valorFaltando > 0.001;
  const temTroco = valorTroco > 0.001;

  return (
    <ResumoVendaStyled>
      <div className="painel-status-pagamento">
        <div className="secao-metodo">
          <label>FORMA DE PAGAMENTO</label>
          <div className="metodo-valor">{formatarMetodosMistos().toUpperCase()}</div>
        </div>

        <div className="secao-total-venda">
          <label>TOTAL A PAGAR</label>
          <div className="total-valor">
            R$ {formatarMoeda(totalGeral)}
          </div>
        </div>

        {metodoPagamento === "Misto" && metodosUsadosMisto.length > 0 && (
          <div className="detalhes-mistos-container">
            {metodosUsadosMisto.map((pagamento, index) => (
              <div key={index} className="linha-detalhe">
                <span>{pagamento.metodo}</span>
                <strong>R$ {formatarMoeda(pagamento.valor)}</strong>
              </div>
            ))}
            <div className="total-pago-row">
              <span>TOTAL RECEBIDO</span>
              <strong>R$ {formatarMoeda(valorPagoTotal)}</strong>
            </div>
          </div>
        )}

        <div className="painel-resultado">
          {!vendaIniciada ? (
            /* Caso 1: Carrinho Vazio */
            <div className="status-box aguardando">
              <div className="resultado-texto" style={{ color: "#aaa" }}>AGUARDANDO ITENS...</div>
            </div>
          ) : temPendencia ? (
            /* Caso 2: Falta dinheiro */
            <div className="status-box pendente">
              <label>VALOR RESTANTE</label>
              <div className="resultado-valor">R$ {formatarMoeda(valorFaltando)}</div>
            </div>
          ) : temTroco ? (
            /* Caso 3: Tem troco */
            <div className="status-box troco">
              <label>TROCO</label>
              <div className="resultado-valor">R$ {formatarMoeda(valorTroco)}</div>
            </div>
          ) : (
            /* Caso 4: Valor exato e carrinho com itens */
            <div className="status-box pago">
              <div className="resultado-texto">PAGO INTEGRALMENTE</div>
            </div>
          )}
        </div>
      </div>

      <div className="container-botoes-rodape">
        <button
          type="button"
          onClick={cancelarVenda}
          className="btn-cancelar"
          title="ESC"
        >
          CANCELAR [ESC]
        </button>

        <button
          type="button"
          onClick={finalizarVenda}
          className={`btn-finalizar ${podeFinalizarVenda ? "disponivel" : ""}`}
          disabled={!podeFinalizarVenda}
          title="ENTER"
        >
          FINALIZAR [ENTER]
        </button>
      </div>
    </ResumoVendaStyled>
  );
};

export default ResumoVenda;