// components/GerarCupom/CupomVisualizacao.jsx
import React from 'react';
import { CupomVisualizacaoContainer } from "../GerarCupomStyled"; // Importação do styled-component

const CupomVisualizacao = ({
  empresaSelecionada,
  detalhesVenda,
  formatarMoeda,
  gerarPDFCupom,
  gerandoPDF
}) => {
  if (!empresaSelecionada || !detalhesVenda) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Selecione uma <strong>Empresa</strong> e uma <strong>Venda</strong> para gerar o cupom.
      </div>
    );
  }

  const empresa = empresaSelecionada;
  const venda = detalhesVenda;

  return (
    <CupomVisualizacaoContainer>
      <div
        className="cupom-container"
        style={{
          border: "1px dashed #666",
          padding: "20px",
          backgroundColor: "#fff",
          color: "#000",
          width: "300px",
          margin: "20px auto",
          position: "relative",
        }}
      >
        {/* Botão de exportar PDF */}
        <button
          onClick={gerarPDFCupom}
          disabled={gerandoPDF}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "5px 10px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "3px",
            fontSize: "10px",
            cursor: "pointer",
            opacity: gerandoPDF ? 0.6 : 1
          }}
        >
          {gerandoPDF ? "Gerando..." : "📄 PDF"}
        </button>

        <h3 style={{ textAlign: "center", marginBottom: "5px" }}>
          {empresa.nome_fantasia || empresa.razao_social}
        </h3>
        <p
          style={{
            fontSize: "10px",
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          CNPJ: {empresa.cnpj} | IE: {empresa.inscricao_estadual}
        </p>
        <p style={{ fontSize: "10px" }}>
          Endereço: {empresa.endereco}, {empresa.cidade}/{empresa.estado}
        </p>
        <p style={{ fontSize: "10px", marginBottom: "15px" }}>
          Telefone: {empresa.telefone}
        </p>

        <div
          className="cupom-detalhes"
          style={{
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000",
            padding: "10px 0",
            marginBottom: "15px",
          }}
        >
          <p style={{ fontSize: "12px" }}>
            COMPROVANTE - VENDA ID: {venda.id_venda}
          </p>
          <p style={{ fontSize: "12px" }}>
            Data: {new Date(venda.data_hora).toLocaleString("pt-BR")}
          </p>
        </div>

        <table style={{ width: "100%", fontSize: "10px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Item</th>
              <th style={{ textAlign: "right" }}>Qtd. x Preço</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {venda.itens?.map((item, index) => (
              <tr key={index}>
                {/* CORREÇÃO APLICADA: Combina descricao_item e categoria para visualização completa */}
                <td style={{ textAlign: "left" }}>
                  {item.descricao_item || 'N/D'} ({item.categoria || "Item"})
                </td> 
                <td style={{ textAlign: "right" }}>
                  {item.quantidade} x {formatarMoeda(item.preco_unitario)}
                </td>
                <td style={{ textAlign: "right" }}>
                  {formatarMoeda(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className="cupom-totais"
          style={{
            borderTop: "1px solid #000",
            marginTop: "15px",
            paddingTop: "10px",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            TOTAL BRUTO:{" "}
            <span>R$ {formatarMoeda(venda.valor_total_bruto)}</span>
          </p>
          {venda.pagamentos?.map((pag, index) => (
            <p
              key={index}
              style={{
                fontSize: "12px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {pag.metodo}: <span>R$ {formatarMoeda(pag.valor_pago)}</span>
            </p>
          ))}
          <p
            style={{
              fontSize: "12px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            TROCO: <span>R$ {formatarMoeda(venda.valor_troco)}</span>
          </p>
        </div>
      </div>
    </CupomVisualizacaoContainer>
  );
};

export default CupomVisualizacao;