import React, { useState, useEffect } from "react";
import { CupomStyled, ControlesSelecao, CupomVisualizacaoContainer, CupomFiscal } from "./CupomStyled";
import clickSound from "/sounds/selecionar.mp3";


const URL_API_VENDAS = "http://localhost:3000/vendas";
const URL_API_EMPRESAS = "http://localhost:3000/empresas";

export const GerarCupom = () => {
  const [empresas, setEmpresas] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [detalhesVenda, setDetalhesVenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [formEmpresa, setFormEmpresa] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    inscricaoEstadual: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    email: "",
  });
  const [exibirForm, setExibirForm] = useState(false);

  const click = () => {
      const clickSom = new Audio(clickSound);
      clickSom.currentTime = 0;
      clickSom.volume = 1.0;
      clickSom.play();
    };

  const buscarDadosIniciais = async () => {
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

      if (dadosEmpresas.length > 0) {
        setEmpresaSelecionada(dadosEmpresas[0]);
      } else {
        setEmpresaSelecionada(null);
      }

      if (dadosVendas.length > 0) {
        setVendaSelecionada(dadosVendas[0]);
      } else {
        setVendaSelecionada(null);
      }
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setErro(
        "Erro ao carregar dados. Verifique as APIs de Vendas e Empresas."
      );
      setCarregando(false);
    }
  };

  const buscarDetalhesVenda = async (idVenda) => {
    setDetalhesVenda(null);
    try {
      const resposta = await fetch(`${URL_API_VENDAS}/${idVenda}`);
      if (!resposta.ok) throw new Error("Falha ao buscar detalhes da venda.");

      const dados = await resposta.json();
      setDetalhesVenda(dados);
    } catch (error) {
      console.error("Erro ao buscar detalhes da venda:", error);
      alert("Não foi possível carregar os detalhes da venda.");
    }
  };

  useEffect(() => {
    buscarDadosIniciais();
  }, []);

  useEffect(() => {
    if (vendaSelecionada) {
      buscarDetalhesVenda(vendaSelecionada.id_venda);
    } else {
      setDetalhesVenda(null);
    }
  }, [vendaSelecionada]);

  const formatarMoeda = (valor) => {
    return parseFloat(valor || 0)
      .toFixed(2)
      .replace(".", ",");
  };

  const handleEmpresaChange = (id) => {
    const empresa = empresas.find((e) => e.id_empresa === parseInt(id));
    setEmpresaSelecionada(empresa || null);
  };

  const handleVendaChange = (id) => {
    const venda = vendas.find((v) => v.id_venda === parseInt(id));
    setVendaSelecionada(venda || null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormEmpresa({ ...formEmpresa, [name]: value });
  };

  const resetarFormEmpresa = () => {
    setFormEmpresa({
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      inscricaoEstadual: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
      email: "",
    });
    setExibirForm(false);
  };

  const cadastrarEmpresa = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch(URL_API_EMPRESAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formEmpresa),
      });

      if (!resposta.ok) throw new Error("Falha ao cadastrar empresa.");

      alert("Empresa cadastrada com sucesso!");
      resetarFormEmpresa();
      buscarDadosIniciais(); // Recarrega listas
    } catch (error) {
      alert(`Erro ao cadastrar: ${error.message}`);
    }
  };

  const deletarEmpresa = async (idEmpresa) => {
    if (!window.confirm("Tem certeza que deseja deletar esta empresa?")) return;

    try {
      const resposta = await fetch(`${URL_API_EMPRESAS}/${idEmpresa}`, {
        method: "DELETE", // DELETE logic on the server must remove the company
      });

      if (!resposta.ok) throw new Error("Falha ao deletar empresa.");

      alert("Empresa deletada com sucesso!");
      buscarDadosIniciais();
    } catch (error) {
      alert(`Erro ao deletar: ${error.message}`);
    }
  };

  if (carregando) {
    return (
      <div>
        <h1>Carregando dados da empresa e vendas...</h1>
      </div>
    );
  }

  if (erro) {
    return (
      <div>
        <h1 style={{ color: "red" }}>{erro}</h1>
      </div>
    );
  }

  const CupomVisualizacao = () => {
    if (!empresaSelecionada || !detalhesVenda) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Selecione uma **Empresa** e uma **Venda** para gerar o cupom.
        </div>
      );
    }

    const empresa = empresaSelecionada;
    const venda = detalhesVenda;

    return (
      <div
        className="cupom-container"
        style={{
          border: "1px dashed #666",
          padding: "20px",
          backgroundColor: "#fff",
          color: "#000",
          width: "300px",
          margin: "20px auto",
        }}
      >
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
            CUPOM FISCAL - VENDA ID: {venda.id_venda}
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
                <td style={{ textAlign: "left" }}>{item.descricao_item}</td>
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
    );
  };

  return (
    <CupomStyled>
      <h1
        style={{ color: "#BACBD9", textAlign: "center", marginBottom: "20px"
         }}
      >
        Geração de Cupom Fiscal
      </h1>

      <div
        className="controles-selecao-e-acao"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "20px",
          backgroundColor: "#333",
          borderRadius: "8px",
          marginBottom: "40px"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "#BACBD9", fontSize: "18px" }}>
            Gerenciar Empresas
          </h2>
          <button
            onClick={() => {
              setExibirForm(true)
              
            }}
            style={{
              padding: "8px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            + Cadastrar Nova
          </button>
        </div>

        {exibirForm && (
          <form
            onSubmit={cadastrarEmpresa}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              padding: "15px",
              border: "1px solid #555",
              borderRadius: "5px",
            }}
          >
            <input
              name="razaoSocial"
              value={formEmpresa.razaoSocial}
              onChange={handleFormChange}
              placeholder="Razão Social"
              required
              style={{ gridColumn: "span 2" }}
            />
            <input
              name="cnpj"
              value={formEmpresa.cnpj}
              onChange={handleFormChange}
              placeholder="CNPJ"
              required
            />
            <input
              name="inscricaoEstadual"
              value={formEmpresa.inscricaoEstadual}
              onChange={handleFormChange}
              placeholder="Inscrição Estadual"
            />
            <input
              name="endereco"
              value={formEmpresa.endereco}
              onChange={handleFormChange}
              placeholder="Endereço"
              style={{ gridColumn: "span 2" }}
            />
            <input
              name="cidade"
              value={formEmpresa.cidade}
              onChange={handleFormChange}
              placeholder="Cidade"
            />
            <input
              name="estado"
              value={formEmpresa.estado}
              onChange={handleFormChange}
              placeholder="Estado (Ex: RJ)"
            />
            <div
              style={{
                gridColumn: "span 2",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={resetarFormEmpresa}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Cadastrar
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "flex", gap: "30px", justifyContent: "center" }}>
          <div
            className="select-grupo"
            style={{
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label style={{ color: "#BACBD9", marginBottom: "5px" }}>
              Selecionar Empresa:
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={empresaSelecionada?.id_empresa || ""}
                onChange={(e) => handleEmpresaChange(e.target.value)}
                style={{
                  padding: "8px",
                  backgroundColor: "#1e1e1e",
                  color: "#BACBD9",
                  border: "1px solid #555",
                  flexGrow: 1,
                }}
                disabled={empresas.length === 0}
              >
                {empresas.map((emp) => (
                  <option key={emp.id_empresa} value={emp.id_empresa}>
                    {emp.nome_fantasia || emp.razao_social}
                  </option>
                ))}
              </select>
              <button
                onClick={() => deletarEmpresa(empresaSelecionada.id_empresa)}
                disabled={!empresaSelecionada}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Deletar
              </button>
            </div>
          </div>

          <div
            className="select-grupo"
            style={{
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label style={{ color: "#BACBD9", marginBottom: "5px" }}>
              Selecionar Venda:
            </label>
            <select
              value={vendaSelecionada?.id_venda || ""}
              onChange={(e) => handleVendaChange(e.target.value)}
              style={{
                padding: "8px",
                backgroundColor: "#1e1e1e",
                color: "#BACBD9",
                border: "1px solid #555",
              }}
              disabled={vendas.length === 0}
            >
              {vendas.map((venda) => (
                <option key={venda.id_venda} value={venda.id_venda}>
                  ID: {venda.id_venda} - R${" "}
                  {formatarMoeda(venda.valor_total_bruto)} -{" "}
                  {new Date(venda.data_hora).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {CupomVisualizacao()}
    </CupomStyled>
  );
};
