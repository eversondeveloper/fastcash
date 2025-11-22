import React, { useState, useEffect } from 'react';
import { ConfiguracoesStyled } from './ConfiguracoesStyled';

const URL_API_EMPRESAS = "http://localhost:3000/empresas";
const URL_API_VENDEDORES = "http://localhost:3000/vendedores";

export const Configuracoes = () => {
  const [empresas, setEmpresas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('empresas');

  // Estados para formulário de empresa
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
    email: ""
  });

  // Estados para formulário de vendedor
  const [formVendedor, setFormVendedor] = useState({
    nome: "",
    ativo: true
  });

  // Buscar dados iniciais
  const buscarDados = async () => {
    setCarregando(true);
    try {
      const [resEmpresas, resVendedores] = await Promise.all([
        fetch(URL_API_EMPRESAS),
        fetch(URL_API_VENDEDORES)
      ]);
      
      const dadosEmpresas = await resEmpresas.json();
      const dadosVendedores = await resVendedores.json();
      
      setEmpresas(dadosEmpresas);
      setVendedores(dadosVendedores);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados. Verifique se o servidor está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  // Handlers para empresa
  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setFormEmpresa(prev => ({ ...prev, [name]: value }));
  };

  const cadastrarEmpresa = async (e) => {
    e.preventDefault();
    if (!formEmpresa.razaoSocial.trim() || !formEmpresa.cnpj.trim()) {
      alert("Razão Social e CNPJ são obrigatórios.");
      return;
    }

    try {
      const resposta = await fetch(URL_API_EMPRESAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formEmpresa),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Falha ao cadastrar empresa.");
      }

      alert("Empresa cadastrada com sucesso!");
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
        email: ""
      });
      buscarDados();
    } catch (error) {
      alert(`Erro ao cadastrar: ${error.message}`);
    }
  };

  const deletarEmpresa = async (idEmpresa) => {
    if (!window.confirm("Tem certeza que deseja deletar esta empresa?")) return;

    try {
      const resposta = await fetch(`${URL_API_EMPRESAS}/${idEmpresa}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.mensagem || "Falha ao deletar empresa.");
      }

      alert("Empresa deletada com sucesso!");
      buscarDados();
    } catch (error) {
      alert(`Erro ao deletar: ${error.message}`);
    }
  };

  // Handlers para vendedor
  const handleVendedorChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormVendedor(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const cadastrarVendedor = async (e) => {
    e.preventDefault();
    if (!formVendedor.nome.trim()) {
      alert("Nome do vendedor é obrigatório.");
      return;
    }

    try {
      const resposta = await fetch(URL_API_VENDEDORES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formVendedor),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Falha ao cadastrar vendedor.");
      }

      alert("Vendedor cadastrado com sucesso!");
      setFormVendedor({ nome: "", ativo: true });
      buscarDados();
    } catch (error) {
      alert(`Erro ao cadastrar: ${error.message}`);
    }
  };

  const deletarVendedor = async (idVendedor) => {
    if (!window.confirm("Tem certeza que deseja deletar este vendedor?")) return;

    try {
      const resposta = await fetch(`${URL_API_VENDEDORES}/${idVendedor}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.mensagem || "Falha ao deletar vendedor.");
      }

      alert("Vendedor deletado com sucesso!");
      buscarDados();
    } catch (error) {
      alert(`Erro ao deletar: ${error.message}`);
    }
  };

  if (carregando) {
    return (
      <ConfiguracoesStyled>
        <h1>Configurações do Sistema</h1>
        <p>Carregando dados...</p>
      </ConfiguracoesStyled>
    );
  }

  return (
    <ConfiguracoesStyled>
      <h1>Configurações do Sistema</h1>
      
      {/* Abas */}
      <div className="abas">
        <button 
          className={`aba ${abaAtiva === 'empresas' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('empresas')}
        >
          Empresas
        </button>
        <button 
          className={`aba ${abaAtiva === 'vendedores' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('vendedores')}
        >
          Vendedores
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="conteudo-aba">
        {abaAtiva === 'empresas' && (
          <div className="secao-empresas">
            <h2>Gerenciar Empresas</h2>
            
            {/* Formulário de Cadastro */}
            <form onSubmit={cadastrarEmpresa} className="formulario-cadastro">
              <h3>Cadastrar Nova Empresa</h3>
              <div className="grid-form">
                <input
                  type="text"
                  name="razaoSocial"
                  value={formEmpresa.razaoSocial}
                  onChange={handleEmpresaChange}
                  placeholder="Razão Social *"
                  required
                />
                <input
                  type="text"
                  name="nomeFantasia"
                  value={formEmpresa.nomeFantasia}
                  onChange={handleEmpresaChange}
                  placeholder="Nome Fantasia"
                />
                <input
                  type="text"
                  name="cnpj"
                  value={formEmpresa.cnpj}
                  onChange={handleEmpresaChange}
                  placeholder="CNPJ *"
                  required
                />
                <input
                  type="text"
                  name="inscricaoEstadual"
                  value={formEmpresa.inscricaoEstadual}
                  onChange={handleEmpresaChange}
                  placeholder="Inscrição Estadual"
                />
                <input
                  type="text"
                  name="endereco"
                  value={formEmpresa.endereco}
                  onChange={handleEmpresaChange}
                  placeholder="Endereço"
                  className="span-2"
                />
                <input
                  type="text"
                  name="cidade"
                  value={formEmpresa.cidade}
                  onChange={handleEmpresaChange}
                  placeholder="Cidade"
                />
                <input
                  type="text"
                  name="estado"
                  value={formEmpresa.estado}
                  onChange={handleEmpresaChange}
                  placeholder="Estado (UF)"
                />
                <input
                  type="text"
                  name="cep"
                  value={formEmpresa.cep}
                  onChange={handleEmpresaChange}
                  placeholder="CEP"
                />
                <input
                  type="text"
                  name="telefone"
                  value={formEmpresa.telefone}
                  onChange={handleEmpresaChange}
                  placeholder="Telefone"
                />
                <input
                  type="email"
                  name="email"
                  value={formEmpresa.email}
                  onChange={handleEmpresaChange}
                  placeholder="E-mail"
                  className="span-2"
                />
              </div>
              <button type="submit" className="botao-cadastrar">
                Cadastrar Empresa
              </button>
            </form>

            {/* Lista de Empresas */}
            <div className="lista-empresas">
              <h3>Empresas Cadastradas</h3>
              {empresas.length === 0 ? (
                <p className="sem-dados">Nenhuma empresa cadastrada.</p>
              ) : (
                <div className="tabela-empresas">
                  {empresas.map(empresa => (
                    <div key={empresa.id_empresa} className="item-empresa">
                      <div className="info-empresa">
                        <strong>{empresa.nome_fantasia || empresa.razao_social}</strong>
                        <span>CNPJ: {empresa.cnpj}</span>
                        <span>{empresa.cidade && `${empresa.cidade}/${empresa.estado}`}</span>
                      </div>
                      <button
                        onClick={() => deletarEmpresa(empresa.id_empresa)}
                        className="botao-deletar"
                      >
                        Deletar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {abaAtiva === 'vendedores' && (
          <div className="secao-vendedores">
            <h2>Gerenciar Vendedores</h2>
            
            {/* Formulário de Cadastro */}
            <form onSubmit={cadastrarVendedor} className="formulario-cadastro">
              <h3>Cadastrar Novo Vendedor</h3>
              <div className="form-simples">
                <input
                  type="text"
                  name="nome"
                  value={formVendedor.nome}
                  onChange={handleVendedorChange}
                  placeholder="Nome do Vendedor *"
                  required
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="ativo"
                    checked={formVendedor.ativo}
                    onChange={handleVendedorChange}
                  />
                  Vendedor Ativo
                </label>
              </div>
              <button type="submit" className="botao-cadastrar">
                Cadastrar Vendedor
              </button>
            </form>

            {/* Lista de Vendedores */}
            <div className="lista-vendedores">
              <h3>Vendedores Cadastrados</h3>
              {vendedores.length === 0 ? (
                <p className="sem-dados">Nenhum vendedor cadastrado.</p>
              ) : (
                <div className="tabela-vendedores">
                  {vendedores.map(vendedor => (
                    <div key={vendedor.id_vendedor} className="item-vendedor">
                      <div className="info-vendedor">
                        <strong>{vendedor.nome}</strong>
                        <span className={`status ${vendedor.ativo ? 'ativo' : 'inativo'}`}>
                          {vendedor.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <button
                        onClick={() => deletarVendedor(vendedor.id_vendedor)}
                        className="botao-deletar"
                      >
                        Deletar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ConfiguracoesStyled>
  );
};