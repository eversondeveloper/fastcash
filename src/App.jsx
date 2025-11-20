import { useState, useEffect, useMemo } from "react";
import { AppStyled } from "./AppStyled";
import Button from "./components/Button";
// Importações de som comentadas para evitar erros de compilação em ambientes restritos.
// import desClick from "/sounds/desselecionar.mp3"; 
// import clickSound from "/sounds/selecionar.mp3";
// import somHover from "/sounds/hover.mp3"

import { Routes, Route, Link } from "react-router-dom";
import { PaginaRelatorios } from "./pages/PaginaRelatorios";
import { Produtos } from "./pages/Produtos";
import { GerarCupom } from "./pages/GerarCupom";

const URL_API_VENDAS = "http://localhost:3000/vendas";
const URL_API_PRODUTOS = "http://localhost:3000/produtos";

const ComponenteConfiguracoes = () => (
  <h1>Página de Configurações do Sistema</h1>
);

function ComponenteVendas() {
  const [produtosDB, setProdutosDB] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [valorDinheiroRecebido, setValorDinheiroRecebido] = useState(0);
  const [metodoPagamento, setMetodoPagamento] = useState("Dinheiro");
  const [valorOutroMetodo, setValorOutroMetodo] = useState(0);
  const [metodoSecundario, setMetodoSecundario] = useState("Crédito");
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [corTextoBtn] = useState("#cecece");
  const [mensagemFlutuante, setMensagemFlutuante] = useState("");

  // Novos Estados para Filtragem
  const [filtroCategoriasSelecionadas, setFiltroCategoriasSelecionadas] = useState([]);
  const [filtroTipoItem, setFiltroTipoItem] = useState('Todos'); // 'Todos', 'Produto', 'Serviço'
  const [filtroBusca, setFiltroBusca] = useState('');

  // --- Funções de Áudio (uso desabilitado para garantir compilação) ---
  const click = () => { /* Implementação de áudio desabilitada temporariamente */ };
  const desClickSound = () => { /* Implementação de áudio desabilitada temporariamente */ };
  
  // --- Lógica de Inicialização e Efeitos ---
  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const resposta = await fetch(URL_API_PRODUTOS);
        if (!resposta.ok) throw new Error("Falha ao carregar produtos do BD.");
        const dados = await resposta.json();
        setProdutosDB(dados);
      } catch {
        setMensagemFlutuante("❌ Erro ao carregar o catálogo de produtos da API.");
      } finally {
        setCarregandoProdutos(false);
      }
    };
    buscarProdutos();
  }, []);

  useEffect(() => {
    if (mensagemFlutuante) {
      const timer = setTimeout(() => {
        setMensagemFlutuante("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [mensagemFlutuante]);

  // --- Lógica de Filtragem e Listas Derivadas ---

  // 1. Categorias Únicas para os botões de filtro
  const categoriasUnicas = useMemo(() => {
    if (!produtosDB || produtosDB.length === 0) return [];
    // Filtra apenas categorias e retorna uma lista única e ordenada
    return [...new Set(produtosDB.map(p => p.categoria))].sort();
  }, [produtosDB]);

  // 2. Lógica de Filtragem Múltipla
  const produtosFiltrados = useMemo(() => {
    let lista = produtosDB;
    const termoBusca = filtroBusca.toLowerCase().trim();

    // 1. Filtrar por Categoria (OR logic: se 1 ou mais categorias selecionadas, filtra)
    if (filtroCategoriasSelecionadas.length > 0) {
      lista = lista.filter(p => filtroCategoriasSelecionadas.includes(p.categoria));
    }

    // 2. Filtrar por Tipo de Item (Produto ou Serviço)
    if (filtroTipoItem !== 'Todos') {
      lista = lista.filter(p => p.tipo_item === filtroTipoItem);
    }

    // 3. Filtrar por Busca (Descricao, Categoria, ID)
    if (termoBusca) {
      lista = lista.filter(p => 
        p.descricao.toLowerCase().includes(termoBusca) ||
        p.categoria.toLowerCase().includes(termoBusca) ||
        p.id_produto.toString().includes(termoBusca)
      );
    }

    return lista;
  }, [produtosDB, filtroCategoriasSelecionadas, filtroTipoItem, filtroBusca]);

  // Função para alternar a seleção de categorias
  const toggleCategoriaFiltro = (categoria) => {
    setFiltroCategoriasSelecionadas(prev => {
      if (prev.includes(categoria)) {
        return prev.filter(c => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };
  
  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setFiltroCategoriasSelecionadas([]);
    setFiltroTipoItem('Todos');
    setFiltroBusca('');
  };

  // --- Lógica de Vendas ---

  const adicionarProduto = (item) => {
    const produtoExistente = produtosSelecionados.find(
      (p) => p.id_produto === item.id_produto
    );
    const produtoOriginal = produtosDB.find(
      (p) => p.id_produto === item.id_produto
    );

    if (!produtoOriginal) {
      return setMensagemFlutuante("❌ Produto não encontrado no catálogo.");
    }
    const quantidadeAtual = produtoExistente ? produtoExistente.quantidade : 0;

    if (
      produtoOriginal.tipo_item === "Produto" &&
      produtoOriginal.estoque_atual <= quantidadeAtual
    ) {
      return setMensagemFlutuante("⚠️ Estoque insuficiente para adicionar mais unidades.");
    }

    if (produtoExistente) {
      setProdutosSelecionados((prev) =>
        prev.map((p) =>
          p.id_produto === item.id_produto
            ? { ...p, quantidade: p.quantidade + 1 }
            : p
        )
      );
    } else {
      const novo = {
        id_produto: item.id_produto,
        categoria: item.categoria,
        descricao: item.descricao,
        preco: item.preco,
        tipo_item: item.tipo_item,
        idUnico: Date.now() + Math.random(),
        quantidade: 1,
      };
      setProdutosSelecionados((prev) => [...prev, novo]);
    }
  };

  const removerProduto = (idUnico) => {
    desClickSound();
    setProdutosSelecionados((prev) =>
      prev.filter((p) => p.idUnico !== idUnico)
    );
  };

  const handleQuantidadeChange = (idUnico, novaQtdStr) => {
    const novaQtd = Math.max(1, parseFloat(novaQtdStr) || 1);
    setProdutosSelecionados((prev) => {
      const item = prev.find((p) => p.idUnico === idUnico);
      const original = produtosDB.find((p) => p.id_produto === item.id_produto);
      
      if (!item || !original) return prev; // Proteção contra dados inconsistentes

      if (
        original.tipo_item === "Produto" &&
        original.estoque_atual < novaQtd
      ) {
        setMensagemFlutuante(`⚠️ Estoque máximo: ${original.estoque_atual}`);
        return prev;
      }
      return prev.map((p) =>
        p.idUnico === idUnico ? { ...p, quantidade: novaQtd } : p
      );
    });
  };

  // --- Cálculos Derivados ---
  const totalGeral = produtosSelecionados.reduce(
    (acc, p) => acc + parseFloat(p.preco || 0) * p.quantidade,
    0
  );
  const valorPagoTotal = valorDinheiroRecebido + valorOutroMetodo;
  const valorFaltando =
    totalGeral > valorPagoTotal ? totalGeral - valorPagoTotal : 0;
  let valorTroco = 0;
  if (metodoPagamento === "Dinheiro" && valorDinheiroRecebido > totalGeral)
    valorTroco = valorDinheiroRecebido - totalGeral;
  else if (metodoPagamento === "Misto" && valorPagoTotal > totalGeral)
    valorTroco = valorPagoTotal - totalGeral;
  // --- Fim Cálculos ---

  const podeFinalizarVenda = () => {
    if (produtosSelecionados.length === 0) return false;

    if (["Crédito", "Débito", "PIX"].includes(metodoPagamento)) {
      return true;
    }

    if (metodoPagamento === "Dinheiro") {
      return valorDinheiroRecebido >= totalGeral;
    }

    if (metodoPagamento === "Misto") {
      return valorPagoTotal >= totalGeral;
    }

    return false;
  };

  const resetarCaixa = () => {
    setProdutosSelecionados([]);
    setValorDinheiroRecebido(0);
    setMetodoPagamento("Dinheiro");
    setValorOutroMetodo(0);
    setMetodoSecundario("Crédito");
  };

  const reduzirEstoque = async () => {
    const reducoes = produtosSelecionados
      .filter((i) => i.tipo_item === "Produto")
      .map((i) => {
        const p = produtosDB.find((x) => x.id_produto === i.id_produto);
        if (!p) return null;
        const novoEstoque = p.estoque_atual - i.quantidade;
        return fetch(`${URL_API_PRODUTOS}/${i.id_produto}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estoqueAtual: novoEstoque }),
        });
      })
      .filter(Boolean);
    await Promise.all(reducoes);
  };

  const finalizarVenda = async () => {
    if (!podeFinalizarVenda()) {
      setMensagemFlutuante(
        "❌ Não é possível finalizar a venda. Verifique os valores informados."
      );
      return;
    }

    const itens = produtosSelecionados.map((i) => ({
      categoria: i.categoria,
      descricaoItem: i.descricao,
      precoUnitario: i.preco,
      quantidade: i.quantidade,
      subtotal: parseFloat(i.preco) * i.quantidade,
    }));
    const pagamentos = [];
    if (metodoPagamento === "Dinheiro")
      pagamentos.push({
        metodo: "Dinheiro",
        valorPago: totalGeral - valorTroco,
      });
    else if (metodoPagamento === "Misto") {
      if (valorDinheiroRecebido > 0)
        pagamentos.push({
          metodo: "Dinheiro",
          valorPago: valorDinheiroRecebido - valorTroco,
        });
      if (valorOutroMetodo > 0)
        pagamentos.push({
          metodo: metodoSecundario,
          valorPago: valorOutroMetodo,
        });
    } else pagamentos.push({ metodo: metodoPagamento, valorPago: totalGeral });

    const venda = {
      valorTotalBruto: totalGeral,
      valorPagoTotal,
      valorTroco,
      statusVenda: "Finalizada",
      itens,
      pagamentos,
    };
    try {
      const r = await fetch(URL_API_VENDAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });
      const res = await r.json();
      if (r.ok) {
        await reduzirEstoque();
        setMensagemFlutuante(
          `✅ Venda registrada com sucesso! ID: ${res.idVenda}`
        );
        resetarCaixa();
        const atualizados = await (await fetch(URL_API_PRODUTOS)).json();
        setProdutosDB(atualizados);
      } else {
        setMensagemFlutuante(`❌ Erro: ${res.mensagem}`);
      }
    } catch {
      setMensagemFlutuante("❌ Erro de comunicação com a API.");
    }
  };

  const cancelarVenda = () => {
    if (window.confirm("Cancelar venda?")) {
      resetarCaixa();
      setMensagemFlutuante("⚠️ Venda cancelada.");
    }
  };

  // --- Renderização dos Botões de Produto (agora usa produtosFiltrados) ---
  const precosFunc = () =>
    carregandoProdutos ? (
      <p className="mensagem-carregando">Carregando catálogo...</p>
    ) : produtosFiltrados.length === 0 ? (
      <p className="mensagem-sem-produtos">Nenhum produto encontrado com os filtros aplicados.</p>
    ) : (
      <div className="buttons-catalogo">
        {produtosFiltrados.map((item, i) => (
          <Button
            key={item.id_produto}
            $index={i + 1}
            $texto={item.categoria}
            $descricao={item.descricao}
            $id={item.id_produto}
            $corTexto={corTextoBtn}
            $btnClick={() => (adicionarProduto(item), click())}
            $produtosSelecionados={produtosSelecionados}
          />
        ))}
      </div>
    );

  const metodos = ["Dinheiro", "Crédito", "Débito", "PIX", "Misto"];
  const metodosSecundarios = ["Crédito", "Débito", "PIX"];

  return (
    <div className="container">
      {mensagemFlutuante && (
        // Conteúdo do Toast Flutuante (mantido o estilo inline por ser auxiliar)
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",

            backgroundColor: mensagemFlutuante.includes("❌")
              ? "#B00020"
              : mensagemFlutuante.includes("⚠️")
              ? "#FFC107"
              : "#00A150",
            color: "white",

            padding: "15px 20px",
            borderRadius: "6px",
            border: `1px solid ${
              mensagemFlutuante.includes("❌")
                ? "#700018"
                : mensagemFlutuante.includes("⚠️")
                ? "#D39E00"
                : "#007038"
            }`,
            boxShadow: "0 4px 8px rgba(0,0,0,0.4)",

            zIndex: 1000,
            fontWeight: "500",
            fontSize: "15px",
            minWidth: "250px",
            maxWidth: "350px",
          }}
          className={
            mensagemFlutuante.includes("❌")
              ? "toast-erro"
              : mensagemFlutuante.includes("⚠️")
              ? "toast-aviso"
              : "toast-sucesso"
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "20px" }}>
              {mensagemFlutuante.includes("❌")
                ? "❌"
                : mensagemFlutuante.includes("⚠️")
                ? "⚠️"
                : "✅"}
            </span>
            <span>{mensagemFlutuante.replace(/✅|❌|⚠️/g, "").trim()}</span>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
          
          /* Estilos básicos para os filtros (placeholder) */
          .container-filtros-pdv {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            margin-bottom: 15px;
            background-color: #212121; 
            border-radius: 8px;
          }
          .filtros-categoria, .filtros-tipo-item {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            align-items: center; 
          }
          .botao-filtro-categoria, .botao-filtro-tipo, .botao-limpar-filtros {
            padding: 5px 10px;
            border: 1px solid #444;
            background-color: #333;
            color: #BACBD9;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.2s;
            white-space: nowrap; /* Evita quebra de linha nos botões de filtro */
          }
          .botao-filtro-categoria.selecionado, .botao-filtro-tipo.selecionado {
            background-color: #4CAF50; /* Verde de seleção */
            border-color: #388E3C;
            color: white;
          }
          .input-filtro-busca {
            padding: 8px;
            border: 1px solid #444;
            background-color: #333;
            color: #BACBD9;
            border-radius: 4px;
          }
          .botao-limpar-filtros {
            background-color: #555;
            margin-left: auto;
          }

          /* O container onde os botões de produto são renderizados */
          .buttons2 {
            overflow-y: auto;
            flex-grow: 1; /* Permite que ocupe o espaço disponível */
            padding: 10px 0;
          }
          .buttons-catalogo {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
            gap: 10px;
            padding-right: 15px; /* Espaço para a barra de rolagem */
          }
        `}
      </style>

      <div className="buttons">
        {/* --- Container de Filtros --- */}
        <div className="container-filtros-pdv">
            
            <h3 style={{ color: '#BACBD9', fontSize: '16px', margin: 0 }}>Filtrar Catálogo</h3>
            
            <input
              type="text"
              placeholder="Buscar por nome, categoria ou código..."
              className="input-filtro-busca"
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
            />

            <div className="filtros-categoria">
                <label style={{ color: '#BACBD9', marginRight: '5px', fontWeight: 'bold' }}>Categorias:</label>
              {categoriasUnicas.map(cat => (
                <button
                  key={cat}
                  className={`botao-filtro-categoria ${filtroCategoriasSelecionadas.includes(cat) ? 'selecionado' : ''}`}
                  onClick={() => toggleCategoriaFiltro(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="filtros-tipo-item">
              <label style={{ color: '#BACBD9', marginRight: '5px', fontWeight: 'bold' }}>Tipo:</label>
              {['Todos', 'Produto', 'Serviço'].map(tipo => (
                <button
                  key={tipo}
                  className={`botao-filtro-tipo ${filtroTipoItem === tipo ? 'selecionado' : ''}`}
                  onClick={() => setFiltroTipoItem(tipo)}
                >
                  {tipo}
                </button>
              ))}
              
              {(filtroCategoriasSelecionadas.length > 0 || filtroTipoItem !== 'Todos' || filtroBusca) && (
                <button 
                  className="botao-limpar-filtros"
                  onClick={limparFiltros}
                >
                  Limpar Filtros
                </button>
              )}
            </div>
        </div>
        {/* --- Fim Container de Filtros --- */}

        <div className="buttons2">{precosFunc()}</div>
      </div>

      <div className="controles">
        <h1>Selecionados:</h1>
        <div className="prods">
          {produtosSelecionados.map((produto) => {
            const valorItem = parseFloat(produto.preco) || 0;
            const totalDoItem = valorItem * produto.quantidade;
            return (
              <div className="relacaoprodutos" key={produto.idUnico}>
                <button
                  type="button"
                  onClick={() => removerProduto(produto.idUnico)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    marginRight: "10px",
                    fontWeight: "bold",
                    width: "20px",
                    height: "20px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  X
                </button>
                {produto.categoria} {produto.descricao.toUpperCase()} R${" "}
                {valorItem.toFixed(2).replace(".", ",")} x{" "}
                <input
                  value={produto.quantidade}
                  type="number"
                  min="1"
                  onChange={(n) =>
                    handleQuantidadeChange(produto.idUnico, n.target.value)
                  }
                  className="quantidade"
                />
                : R$ {totalDoItem.toFixed(2).replace(".", ",")}
              </div>
            );
          })}
        </div>

        {produtosSelecionados.length > 0 && (
          <div className="pagamento">
            <div className="metodos-pagamento-container">
              {metodos.map((m) => (
                <button
                  type="button"
                  key={m}
                  className={`metodo-btn ${
                    metodoPagamento === m ? "selecionado" : ""
                  }`}
                  onClick={() => setMetodoPagamento(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            {metodoPagamento === "Misto" && (
              <div className="pagamento-misto-container">
                <div className="input-grupo">
                  <label>Dinheiro Recebido:</label>
                  <input
                    type="number"
                    value={valorDinheiroRecebido || ""}
                    onChange={(e) =>
                      setValorDinheiroRecebido(parseFloat(e.target.value) || 0)
                    }
                    className="valorrecebido"
                  />
                </div>

                <div className="input-grupo">
                  <label>2º Método:</label>
                  <select
                    value={metodoSecundario}
                    onChange={(e) => setMetodoSecundario(e.target.value)}
                    className="metodo-secundario-select"
                  >
                    {metodosSecundarios.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-grupo">
                  <label>{metodoSecundario} Pago:</label>
                  <input
                    type="number"
                    value={valorOutroMetodo || ""}
                    onChange={(e) =>
                      setValorOutroMetodo(parseFloat(e.target.value) || 0)
                    }
                    className="valorrecebido"
                  />
                </div>
              </div>
            )}

            {metodoPagamento === "Dinheiro" && (
              <>
                <label>Valor Recebido:</label>
                <input
                  type="number"
                  value={valorDinheiroRecebido || ""}
                  onChange={(e) =>
                    setValorDinheiroRecebido(parseFloat(e.target.value) || 0)
                  }
                  style={{
                    padding: "8px",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  className="valorrecebido"
                />
              </>
            )}

            {metodoPagamento !== "Misto" && metodoPagamento !== "Dinheiro" && (
              <div
                style={{ fontWeight: "bold", color: "green", margin: "10px 0" }}
              >
                Pagamento em {metodoPagamento}
              </div>
            )}

            <div style={{ fontWeight: "bold" }}>
              Método: {metodoPagamento}{" "}
              {metodoPagamento === "Misto" && `+ ${metodoSecundario}`} <br />
              Total Geral: R$ {totalGeral.toFixed(2).replace(".", ",")} <br />
              {valorFaltando > 0 ? (
                <span style={{ color: "red" }}>
                  Faltando: R$ {valorFaltando.toFixed(2).replace(".", ",")}
                </span>
              ) : valorTroco > 0 ? (
                <span style={{ color: "green" }}>
                  Troco: R$ {valorTroco.toFixed(2).replace(".", ",")}
                </span>
              ) : (
                <span style={{ color: "green" }}>Pago Integralmente</span>
              )}
            </div>

            <div className="container-botoes-acao">
              <button
                type="button"
                onClick={cancelarVenda}
                className="botao-cancelar-venda"
              >
                CANCELAR
              </button>

              <button
                type="button"
                onClick={finalizarVenda}
                className="botao-finalizar-venda"
                disabled={!podeFinalizarVenda()}
              >
                FINALIZAR VENDA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppStyled>
      <header>
        <div className="logomenu">
          <Link to="/fastcash/" className="logo">
            EversCash
          </Link>
          <div className="menu-links">
            <Link to="/fastcash/">Ponto de Vendas</Link>
            <Link to="/fastcash/relatorios">Relatório de Vendas</Link>
            <Link to="/fastcash/produtos">Produtos Cadastrados</Link>
            <Link to="/fastcash/gerarcupom">Gerar Cupom</Link>
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/fastcash/" element={<ComponenteVendas />} />
          <Route path="/fastcash/relatorios" element={<PaginaRelatorios />} />
          <Route path="/fastcash/produtos" element={<Produtos />} />
          <Route path="/fastcash/gerarcupom" element={<GerarCupom />} />
        </Routes>
      </main>
      <footer>
        <div className="footer">
          <p>Desenvolvido por Everscript 2025</p>
        </div>
      </footer>
    </AppStyled>
  );
}

export default App;