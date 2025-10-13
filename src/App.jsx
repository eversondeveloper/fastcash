import { useState, useEffect } from "react";
import { AppStyled } from "./AppStyled";
import Button from "./components/Button";
import desClick from "/sounds/desselecionar.mp3";
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
  // NOVO STATE: Para controlar a mensagem flutuante
  const [mensagemFlutuante, setMensagemFlutuante] = useState("");

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const resposta = await fetch(URL_API_PRODUTOS);
        if (!resposta.ok) throw new Error("Falha ao carregar produtos do BD.");
        const dados = await resposta.json();
        setProdutosDB(dados);
      } catch {
        alert("Erro ao carregar o catálogo de produtos da API.");
      } finally {
        setCarregandoProdutos(false);
      }
    };
    buscarProdutos();
  }, []);

  // NOVO EFFECT: Para limpar a mensagem após 3 segundos
  useEffect(() => {
    if (mensagemFlutuante) {
      const timer = setTimeout(() => {
        setMensagemFlutuante("");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [mensagemFlutuante]);

  const desClickSound = () => {
    const som = new Audio(desClick);
    som.volume = 1.0;
    som.currentTime = 0;
    som.play();
  };

  const adicionarProduto = (item) => {
    const produtoExistente = produtosSelecionados.find(
      (p) => p.id_produto === item.id_produto
    );
    const produtoOriginal = produtosDB.find(
      (p) => p.id_produto === item.id_produto
    );

    if (!produtoOriginal) return alert("Produto não encontrado no catálogo.");
    const quantidadeAtual = produtoExistente ? produtoExistente.quantidade : 0;

    if (
      produtoOriginal.tipo_item === "Produto" &&
      produtoOriginal.estoque_atual <= quantidadeAtual
    ) {
      return alert("Estoque insuficiente para adicionar mais unidades.");
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
      if (
        original.tipo_item === "Produto" &&
        original.estoque_atual < novaQtd
      ) {
        alert(`Estoque máximo: ${original.estoque_atual}`);
        return prev;
      }
      return prev.map((p) =>
        p.idUnico === idUnico ? { ...p, quantidade: novaQtd } : p
      );
    });
  };

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
      // ALTERADO: Mensagem de erro também como flutuante
      setMensagemFlutuante("Não é possível finalizar a venda. Verifique os valores informados.");
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
        // ALTERADO: Em vez de alert, usa mensagem flutuante
        setMensagemFlutuante(`✅ Venda registrada com sucesso! ID: ${res.idVenda}`);
        resetarCaixa();
        const atualizados = await (await fetch(URL_API_PRODUTOS)).json();
        setProdutosDB(atualizados);
      } else {
        // ALTERADO: Erro também como mensagem flutuante
        setMensagemFlutuante(`❌ Erro: ${res.mensagem}`);
      }
    } catch {
      // ALTERADO: Erro de comunicação também como mensagem flutuante
      setMensagemFlutuante("❌ Erro de comunicação com a API.");
    }
  };

  const cancelarVenda = () => {
    if (window.confirm("Cancelar venda?")) {
      resetarCaixa();
      // ALTERADO: Mensagem de cancelamento também flutuante
      setMensagemFlutuante("⚠️ Venda cancelada.");
    }
  };

  const precosFunc = () =>
    carregandoProdutos ? (
      <p>Carregando catálogo...</p>
    ) : (
      produtosDB.map((item, i) => (
        <Button
          key={item.id_produto}
          $index={i + 1}
          $texto={item.categoria}
          $descricao={item.descricao}
          $id={item.id_produto}
          $corTexto={corTextoBtn}
          $btnClick={() => adicionarProduto(item)}
          $produtosSelecionados={produtosSelecionados}
        />
      ))
    );

  const metodos = ["Dinheiro", "Crédito", "Débito", "PIX", "Misto"];
  const metodosSecundarios = ["Crédito", "Débito", "PIX"];

  return (
    <div className="container">
      
      {mensagemFlutuante && (
    <div 
        style={{
            position: "fixed",
            top: "20px", 
            right: "20px",
            
            
            backgroundColor: mensagemFlutuante.includes("❌") ? "#B00020" : 
                             mensagemFlutuante.includes("⚠️") ? "#FFC107" : "#00A150", 
            color: "white", 
            
            padding: "15px 20px", 
            borderRadius: "6px", 
            border: `1px solid ${mensagemFlutuante.includes("❌") ? "#700018" : 
                                 mensagemFlutuante.includes("⚠️") ? "#D39E00" : "#007038"}`,
            boxShadow: "0 4px 8px rgba(0,0,0,0.4)", 
            
            zIndex: 1000,
            fontWeight: "500",
            fontSize: "15px",
            minWidth: "250px",
            maxWidth: "350px",
            
            
            
        }}
        className={
            mensagemFlutuante.includes("❌") ? "toast-erro" :
            mensagemFlutuante.includes("⚠️") ? "toast-aviso" : "toast-sucesso"
        }
    >
        <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px" 
        }}>
            <span style={{ fontSize: "20px" }}>
                {mensagemFlutuante.includes("❌") ? "❌" : 
                 mensagemFlutuante.includes("⚠️") ? "⚠️" : "✅"}
            </span>
            <span>{mensagemFlutuante.replace(/✅|❌|⚠️/g, '').trim()}</span>
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
        `}
      </style>

      <div className="buttons">
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
            FastCash
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
          <Route path="/fastcash/gerarcupom" element={<GerarCupom/>} />
        </Routes>
      </main>
      <footer>
        <div className="footer">
          <p>Desenvolvido por Everson Silva 2025</p>
        </div>
      </footer>
    </AppStyled>
  );
}

export default App;