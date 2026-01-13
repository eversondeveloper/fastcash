// components/ModalEdicaoVenda.jsx
import React, { useState, useEffect, useRef } from "react";

const METODOS_PAGAMENTO = ["Dinheiro", "Pix", "Crédito", "Débito"];

export const ModalEdicaoVenda = ({
  mostrar,
  onClose,
  vendaEditando,
  onAtualizar,
}) => {
  const [pagamentos, setPagamentos] = useState([]);
  const [valorTemp, setValorTemp] = useState("");
  const inputValorRef = useRef(null); // Referência para focar o input automaticamente

  const [novoPagamento, setNovoPagamento] = useState({
    metodo: "Dinheiro",
    valor_pago: "",
    referencia_metodo: "",
  });

  // Sincroniza dados ao abrir
  useEffect(() => {
    if (mostrar && vendaEditando) {
      const inicial = (vendaEditando.pagamentos || []).map((p) => ({
        metodo: p.metodo || "Dinheiro",
        valor_pago: parseFloat(p.valor_pago || p.valorPago || 0) || 0,
        referencia_metodo: p.referencia_metodo || p.referenciaMetodo || "",
      }));
      setPagamentos(inicial);

      // Sugere o valor restante automaticamente ao abrir
      sugerirValorRestante(inicial);
    }
  }, [mostrar, vendaEditando]);

  // Função para sugerir o que falta pagar
  const sugerirValorRestante = (listaPagamentos) => {
    const totalBruto = parseFloat(vendaEditando?.valor_total_bruto || 0);
    const totalPago = listaPagamentos.reduce((acc, p) => acc + p.valor_pago, 0);
    const falta = Math.max(0, totalBruto - totalPago);

    if (falta > 0) {
      setNovoPagamento((prev) => ({ ...prev, valor_pago: falta.toFixed(2) }));
    }
  };

  if (!mostrar || !vendaEditando) return null;

  const adicionarPagamento = () => {
    const valorNum = parseFloat(novoPagamento.valor_pago);
    if (!novoPagamento.metodo || isNaN(valorNum) || valorNum <= 0) {
      return; // Evita adicionar valores vazios ou zero
    }

    const novaLista = [
      ...pagamentos,
      {
        metodo: novoPagamento.metodo,
        valor_pago: valorNum,
        referencia_metodo: novoPagamento.referencia_metodo,
      },
    ];

    setPagamentos(novaLista);

    // Reseta e sugere o próximo valor (se houver)
    const totalBruto = parseFloat(vendaEditando.valor_total_bruto || 0);
    const totalPago = novaLista.reduce((acc, p) => acc + p.valor_pago, 0);
    const falta = Math.max(0, totalBruto - totalPago);

    setNovoPagamento({
      metodo: "Dinheiro",
      valor_pago: falta > 0 ? falta.toFixed(2) : "",
      referencia_metodo: "",
    });
    setValorTemp("");

    // Devolve o foco para o input de valor para próxima digitação
    setTimeout(() => inputValorRef.current?.focus(), 10);
  };

  const carregarParaEditar = (index) => {
    const pag = pagamentos[index];
    setNovoPagamento({
      metodo: pag.metodo,
      valor_pago: pag.valor_pago.toString(),
      referencia_metodo: pag.referencia_metodo || "",
    });
    setPagamentos(pagamentos.filter((_, i) => i !== index));
    inputValorRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionarPagamento();
    }
  };

  const calcularTotalPago = () => {
    return pagamentos.reduce(
      (total, p) => total + parseFloat(p.valor_pago || 0),
      0
    );
  };

  const handleAtualizar = () => {
    const totalPago = calcularTotalPago();
    const totalBruto = parseFloat(vendaEditando.valor_total_bruto || 0);

    if (totalPago < totalBruto - 0.01) {
      alert(
        `Valor insuficiente. Falta R$ ${(totalBruto - totalPago).toFixed(2)}`
      );
      return;
    }

    const dadosParaBanco = pagamentos.map((p) => ({
      metodo: String(p.metodo || "Dinheiro"),
      valor_pago: parseFloat(p.valor_pago) || 0,
      referencia_metodo: p.referencia_metodo || "",
    }));

    onAtualizar(vendaEditando.id_venda, dadosParaBanco);
  };

  const inputStyle = {
    padding: "12px",
    backgroundColor: "#1e1e1e",
    color: "#64ff8a", // Cor de destaque no valor
    border: "1px solid #444",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    flex: 1,
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: "500px", borderRadius: "12px" }}
      >
        <header
          style={{
            borderBottom: "1px solid #333",
            marginBottom: "20px",
            paddingBottom: "10px",
          }}
        >
          <h3 style={{ margin: 0 }}>Venda #{vendaEditando.id_venda}</h3>
        </header>

        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#888",
            }}
          >
            <span>Total da Venda:</span>
            <span>Total Pago:</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            <span style={{ color: "#E0E0E0" }}>
              R${" "}
              {parseFloat(vendaEditando.valor_total_bruto)
                .toFixed(2)
                .replace(".", ",")}
            </span>
            <span
              style={{
                color:
                  calcularTotalPago() >=
                  parseFloat(vendaEditando.valor_total_bruto)
                    ? "#64ff8a"
                    : "#ff5252",
              }}
            >
              R$ {calcularTotalPago().toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "12px",
              color: "#aaa",
            }}
          >
            MÉTODO E VALOR (ENTER PARA ADICIONAR)
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={novoPagamento.metodo}
              onChange={(e) =>
                setNovoPagamento({ ...novoPagamento, metodo: e.target.value })
              }
              style={{ ...inputStyle, flex: "0.6", color: "#BACBD9" }}
            >
              {METODOS_PAGAMENTO.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              ref={inputValorRef}
              type="text"
              autoFocus
              value={valorTemp !== "" ? valorTemp : novoPagamento.valor_pago}
              onFocus={() => setValorTemp("")}
              onBlur={() => setValorTemp("")}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                const val = e.target.value.replace(",", ".");
                setValorTemp(e.target.value);
                setNovoPagamento({ ...novoPagamento, valor_pago: val });
              }}
              placeholder="0,00"
              style={inputStyle}
            />
            <button
              onClick={adicionarPagamento}
              className="btn-primary"
              style={{ padding: "0 20px", borderRadius: "6px" }}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: "10px", fontSize: "14px", color: "#888" }}>
            Pagamentos Lançados:
          </h4>
          <div
            style={{
              maxHeight: "180px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {pagamentos.map((pag, index) => (
              <div
                key={index}
                onClick={() => carregarParaEditar(index)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 15px",
                  backgroundColor: "#2a2a2a",
                  borderRadius: "6px",
                  borderLeft: "4px solid #64ff8a",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                className="item-pagamento-lista"
              >
                <span>
                  <strong>{pag.metodo}</strong>
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    R$ {pag.valor_pago.toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPagamentos(pagamentos.filter((_, i) => i !== index));
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff5252",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="modal-actions"
          style={{ marginTop: "30px", display: "flex", gap: "10px" }}
        >
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1 }}
          >
            Cancelar
          </button>
          <button
            onClick={handleAtualizar}
            className="btn-primary"
            style={{
              flex: 1,
              opacity:
                calcularTotalPago() <
                parseFloat(vendaEditando.valor_total_bruto) - 0.01
                  ? 0.5
                  : 1,
              backgroundColor: "#64ff8a",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Finalizar Edição
          </button>
        </div>
      </div>
    </div>
  );
};
