import { useState } from "react";
import { AppStyled } from "./AppStyled";
import Button from "./components/Button";
import precos from "./components/precos.json";

function App() {
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [valorPago, setValorPago] = useState(0);

  const [corTextoBtn] = useState("#242424");

  const adicionarProduto = (item) => {
    const itemChave = `${item.categoria}_${item.tipo}`;

    const produtoExistente = produtosSelecionados.find(
      (p) => `${p.categoria}_${p.tipo}` === itemChave
    );

    if (produtoExistente) {
      setProdutosSelecionados((prevItems) =>
        prevItems.map((produto) =>
          `${produto.categoria}_${produto.tipo}` === itemChave
            ? { ...produto, quantidade: produto.quantidade + 1 }
            : produto
        )
      );
    } else {
      const novoProduto = {
        ...item,
        idUnico: Date.now() + Math.random(),
        quantidade: 1,
      };
      setProdutosSelecionados((prevItems) => [...prevItems, novoProduto]);
    }
  };

  const removerProduto = (idUnicoParaRemover) => {
    setProdutosSelecionados((prevItems) =>
      prevItems.filter((produto) => produto.idUnico !== idUnicoParaRemover)
    );
  };

  const handleQuantidadeChange = (idUnico, novaQuantidadeStr) => {
    const novaQuantidade = Math.max(1, parseFloat(novaQuantidadeStr) || 1);

    setProdutosSelecionados((prevItems) =>
      prevItems.map((produto) =>
        produto.idUnico === idUnico
          ? { ...produto, quantidade: novaQuantidade }
          : produto
      )
    );
  };

  const totalGeral = produtosSelecionados.reduce((acc, produto) => {
    const valorItem = produto.valor || produto.preco || 0;
    return acc + valorItem * produto.quantidade;
  }, 0);

  const valorTroco = valorPago > totalGeral ? valorPago - totalGeral : 0;

  const precosFunc = () => {
    return precos.map((item, index) => (
      <Button
        key={index}
        $index={index + 1}
        $texto={item.categoria}
        $tipo={item.tipo}
        $corTexto={corTextoBtn}
        $btnClick={() => adicionarProduto(item)}
        $produtosSelecionados={produtosSelecionados}
      />
    ));
  };

  return (
    <AppStyled>
      <header>
        <div className="logomenu">
          <a href="#">FastCash</a>
        </div>
      </header>
      <main>
        <div className="container">
          <div className="buttons">
            <div className="buttons2">{precosFunc()}</div>
          </div>

          <div className="controles">
            <h1>Selecionados:</h1>
            <div className="prods">
              {produtosSelecionados.map((produto, index) => {
                const valorItem = produto.valor || produto.preco || 0;
                const totalDoItem = valorItem * produto.quantidade;

                return (
                  <div className="relacaoprodutos" key={produto.idUnico}>
                    <button
                      onClick={() => removerProduto(produto.idUnico)}
                      className="relacaoprodutos"
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        marginRight: "10px",
                        fontWeight: "bold",
                        width: "20px",
                        height: "20px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0",
                      }}
                    >
                      X
                    </button>
                    {produto.categoria} {produto.tipo.toUpperCase()} R${" "}
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
                <label>Valor Recebido:</label>
                <input
                  type="number"
                  value={valorPago || ""}
                  onChange={(e) =>
                    setValorPago(parseFloat(e.target.value) || 0)
                  }
                  style={{
                    padding: "8px",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  className="valorrecebido"
                />

                <div style={{ fontWeight: "bold" }}>
                  Total Geral: R$ {totalGeral.toFixed(2).replace(".", ",")}{" "}
                  <br />
                  Troco: R$ {valorTroco.toFixed(2).replace(".", ",")}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer>
        <div className="footer">
          <p>Desenvolvido por Everson Silva</p>
        </div>
      </footer>
    </AppStyled>
  );
}

export default App;
