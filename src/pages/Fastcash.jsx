import { useState } from "react";
import Button from "../components/Button";
import precos from "../components/precos.json";
import desClick from "/sounds/desselecionar.mp3";

const URL_API = "http://localhost:3000/vendas";

export const Fastcash = () => {
    const [produtosSelecionados, setProdutosSelecionados] = useState([]);
    const [valorDinheiroRecebido, setValorDinheiroRecebido] = useState(0);
    const [metodoPagamento, setMetodoPagamento] = useState("Dinheiro");
    const [valorOutroMetodo, setValorOutroMetodo] = useState(0);
    const [metodoSecundario, setMetodoSecundario] = useState("Crédito");

    const [corTextoBtn] = useState("#cecece");

    const desClickSound = () => {
        const desselecionarSom = new Audio(desClick);
        desselecionarSom.volume = 1.0;
        desselecionarSom.currentTime = 0;
        desselecionarSom.play();
    };

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
        desClickSound();
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

    const valorPagoTotal = valorDinheiroRecebido + valorOutroMetodo;
    const valorFaltando =
        totalGeral > valorPagoTotal ? totalGeral - valorPagoTotal : 0;

    let valorTroco = 0;
    if (metodoPagamento === "Dinheiro" && valorDinheiroRecebido > totalGeral) {
        valorTroco = valorDinheiroRecebido - totalGeral;
    } else if (metodoPagamento === "Misto" && valorPagoTotal > totalGeral) {
        valorTroco = valorPagoTotal - totalGeral;
    }

    const resetarCaixa = () => {
        setProdutosSelecionados([]);
        setValorDinheiroRecebido(0);
        setMetodoPagamento("Dinheiro");
        setValorOutroMetodo(0);
        setMetodoSecundario("Crédito");
    };

    const finalizarVenda = async () => {
        if (valorFaltando > 0) {
            alert(
                `Venda incompleta! Faltam R$ ${valorFaltando
                    .toFixed(2)
                    .replace(".", ",")}.`
            );
            return;
        }

        const itensParaRegistro = produtosSelecionados.map((item) => ({
            categoria: item.categoria,
            descricaoItem: item.tipo,
            precoUnitario: item.valor || item.preco || 0,
            quantidade: item.quantidade,
            subtotal: (item.valor || item.preco || 0) * item.quantidade,
        }));

        const pagamentosParaRegistro = [];

        if (metodoPagamento === "Dinheiro") {
            pagamentosParaRegistro.push({
                metodo: "Dinheiro",
                valorPago: totalGeral - valorTroco,
                referenciaMetodo: null,
            });
        } else if (metodoPagamento === "Misto") {
            if (valorDinheiroRecebido > 0) {
                pagamentosParaRegistro.push({
                    metodo: "Dinheiro",
                    valorPago: valorDinheiroRecebido - valorTroco,
                    referenciaMetodo: null,
                });
            }
            if (valorOutroMetodo > 0) {
                pagamentosParaRegistro.push({
                    metodo: metodoSecundario,
                    valorPago: valorOutroMetodo,
                    referenciaMetodo: null,
                });
            }
        } else {
            pagamentosParaRegistro.push({
                metodo: metodoPagamento,
                valorPago: totalGeral,
                referenciaMetodo: null,
            });
        }

        const dadosVenda = {
            valorTotalBruto: totalGeral,
            valorPagoTotal: valorPagoTotal,
            valorTroco: valorTroco,
            statusVenda: "Finalizada",
            itens: itensParaRegistro,
            pagamentos: pagamentosParaRegistro,
        };

        try {
            const resposta = await fetch(URL_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosVenda),
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(
                    `Venda registrada com sucesso! ID: ${resultado.idVenda}. Caixa resetado.`
                );
                resetarCaixa();
            } else {
                alert(
                    `Erro ao registrar venda: ${
                        resultado.mensagem || "Erro desconhecido."
                    }`
                );
            }
        } catch (erro) {
            alert("Erro de conexão com o servidor. Verifique se a API está rodando.");
            console.error("Erro na comunicação com a API:", erro);
        }
    };

    const cancelarVenda = () => {
        const confirmacao = window.confirm(
            "Tem certeza que deseja cancelar esta venda? Todos os itens serão removidos."
        );
        if (confirmacao) {
            resetarCaixa();
            alert("Venda cancelada. Caixa resetado.");
        }
    };

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

    const metodos = ["Dinheiro", "Crédito", "Débito", "PIX", "Misto"];
    const metodosSecundarios = ["Crédito", "Débito", "PIX"];

    return (
        <div className="container">
            <div className="buttons">
                <div className="buttons2">{precosFunc()}</div>
            </div>

            <div className="controles">
                <h1>Selecionados:</h1>
                <div className="prods">
                    {produtosSelecionados.map((produto) => {
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
                        <div className="metodos-pagamento-container">
                            {metodos.map((metodo) => (
                                <button
                                    key={metodo}
                                    className={`metodo-btn ${
                                        metodoPagamento === metodo ? "selecionado" : ""
                                    }`}
                                    onClick={() => setMetodoPagamento(metodo)}
                                >
                                    {metodo}
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
                                        {metodosSecundarios.map((metodo) => (
                                            <option key={metodo} value={metodo}>
                                                {metodo}
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
                            {metodoPagamento === "Misto" ? (
                                <>
                                    Valor Pago: R$ {valorPagoTotal.toFixed(2).replace(".", ",")}{" "}
                                    <br />
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
                                </>
                            ) : (
                                metodoPagamento === "Dinheiro" && (
                                    <>Troco: R$ {valorTroco.toFixed(2).replace(".", ",")}</>
                                )
                            )}
                        </div>

                        <div className="container-botoes-acao">
                            <button onClick={cancelarVenda} className="botao-cancelar-venda">
                                CANCELAR
                            </button>

                            <button
                                onClick={finalizarVenda}
                                className="botao-finalizar-venda"
                                disabled={valorFaltando > 0}
                            >
                                FINALIZAR VENDA
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};