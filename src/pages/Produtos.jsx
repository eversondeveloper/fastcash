import React, { useState, useEffect, useMemo } from 'react';
import { 
    ProdutosStyled, 
    SecaoBusca, 
    InputBusca, 
    TabelaProdutos, 
    BotaoAcao, 
    FormularioEdicao,
    GrupoFormulario,
    ContainerBotoesForm,
    ContainerNovoProduto 
} from './ProdutosStyled';

const URL_API_PRODUTOS = 'http://localhost:3000/produtos';

export const Produtos = () => {
    const [produtos, setProdutos] = useState([]);
    const [filtroBusca, setFiltroBusca] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [produtoEditando, setProdutoEditando] = useState(null); 
    const [dadosFormulario, setDadosFormulario] = useState({});
    const [exibirFormulario, setExibirFormulario] = useState(false); // NOVO ESTADO

    const resetarFormulario = () => {
        setProdutoEditando(null);
        setDadosFormulario({
            categoria: '',
            descricao: '',
            preco: 0.00,
            tipoItem: 'Serviço',
            custoUnitario: 0.00,
            estoqueAtual: 0,
            codigoBarra: ''
        });
        setExibirFormulario(false); // Esconde o formulário
    };

    const iniciarNovoCadastro = () => {
        setProdutoEditando(null);
        setDadosFormulario({
            categoria: '',
            descricao: '',
            preco: 0.00,
            tipoItem: 'Serviço',
            custoUnitario: 0.00,
            estoqueAtual: 0,
            codigoBarra: ''
        });
        setExibirFormulario(true); // Exibe o formulário
    }

    const buscarProdutos = async () => {
        setCarregando(true);
        setErro(null);
        try {
            const resposta = await fetch(URL_API_PRODUTOS);
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
            
            const dados = await resposta.json();
            setProdutos(dados);
        } catch (error) {
            setErro("Erro ao carregar produtos. API fora do ar ou URL incorreta.");
        } finally {
            setCarregando(false);
        }
    };

    const salvarProduto = async (evento) => {
        evento.preventDefault();
        
        const metodo = produtoEditando ? 'PATCH' : 'POST';
        const url = produtoEditando ? `${URL_API_PRODUTOS}/${produtoEditando.id_produto}` : URL_API_PRODUTOS;

        try {
            const resposta = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFormulario),
            });

            if (!resposta.ok) throw new Error(`Falha ao salvar. Status: ${resposta.status}`);

            alert(`Produto ${produtoEditando ? 'atualizado' : 'cadastrado'} com sucesso!`);
            resetarFormulario();
            buscarProdutos();
        } catch (error) {
            alert(`Erro ao salvar produto: ${error.message}`);
        }
    };

    const desativarProduto = async (idProduto) => {
        if (!window.confirm("Tem certeza que deseja desativar este produto?")) return;

        try {
            const resposta = await fetch(`${URL_API_PRODUTOS}/${idProduto}`, {
                method: 'DELETE',
            });
            
            if (resposta.status === 200) {
                alert("Produto desativado com sucesso.");
                buscarProdutos();
            } else {
                const erroDados = await resposta.json();
                throw new Error(erroDados.mensagem || 'Falha ao desativar.');
            }
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    };

    useEffect(() => {
        buscarProdutos();
        resetarFormulario();
    }, []);
    
    const iniciarEdicao = (produto) => {
        setProdutoEditando(produto);
        setDadosFormulario({
            categoria: produto.categoria,
            descricao: produto.descricao,
            preco: parseFloat(produto.preco),
            tipoItem: produto.tipo_item,
            custoUnitario: parseFloat(produto.custo_unitario),
            estoqueAtual: produto.estoque_atual,
            codigoBarra: produto.codigo_barra
        });
        setExibirFormulario(true); // Exibe o formulário para edição
    };

    const manipularMudanca = (evento) => {
        const { name, value } = evento.target;
        setDadosFormulario(prev => ({
            ...prev,
            [name]: name === 'preco' || name === 'custoUnitario' ? parseFloat(value) || 0 : value
        }));
    };

    const produtosFiltrados = useMemo(() => {
        const termo = filtroBusca.toLowerCase().trim();
        if (!termo) return produtos;

        return produtos.filter(produto => 
            produto.descricao.toLowerCase().includes(termo) ||
            produto.categoria.toLowerCase().includes(termo) ||
            produto.id_produto.toString().includes(termo)
        );
    }, [produtos, filtroBusca]);

    return (
        <ProdutosStyled>
            <h1>Gestão de Produtos e Serviços</h1>

            <ContainerNovoProduto>
                {/* ALTERAÇÃO AQUI: Chama iniciarNovoCadastro */}
                <BotaoAcao onClick={iniciarNovoCadastro} $tipo="adicionar">
                    + NOVO PRODUTO
                </BotaoAcao>
            </ContainerNovoProduto>

            <SecaoBusca>
                <InputBusca
                    type="text"
                    placeholder="Buscar por ID, Nome ou Categoria..."
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                />
            </SecaoBusca>

            {/* ALTERAÇÃO AQUI: Condição para exibir o formulário */}
            {(produtoEditando || exibirFormulario) && (
                <FormularioEdicao onSubmit={salvarProduto}>
                    <h2>{produtoEditando ? `Editando Produto ID: ${produtoEditando.id_produto}` : 'Cadastrar Novo Produto'}</h2>
                    
                    <GrupoFormulario>
                        <label htmlFor="descricao">Descrição (Nome):</label>
                        <input
                            id="descricao"
                            name="descricao"
                            type="text"
                            value={dadosFormulario.descricao}
                            onChange={manipularMudanca}
                            required
                        />
                    </GrupoFormulario>
                    
                    <GrupoFormulario>
                        <label htmlFor="categoria">Categoria:</label>
                        <input
                            id="categoria"
                            name="categoria"
                            type="text"
                            value={dadosFormulario.categoria}
                            onChange={manipularMudanca}
                            required
                        />
                    </GrupoFormulario>
                    
                    <GrupoFormulario>
                        <label htmlFor="preco">Preço (R$):</label>
                        <input
                            id="preco"
                            name="preco"
                            type="number"
                            step="0.01"
                            value={dadosFormulario.preco}
                            onChange={manipularMudanca}
                            required
                        />
                    </GrupoFormulario>

                    <GrupoFormulario>
                        <label htmlFor="tipoItem">Tipo:</label>
                        <select
                            id="tipoItem"
                            name="tipoItem"
                            value={dadosFormulario.tipoItem}
                            onChange={manipularMudanca}
                            required
                        >
                            <option value="Serviço">Serviço</option>
                            <option value="Produto">Produto</option>
                        </select>
                    </GrupoFormulario>
                    
                    {dadosFormulario.tipoItem === 'Produto' && (
                        <>
                            <GrupoFormulario>
                                <label htmlFor="estoqueAtual">Estoque Atual:</label>
                                <input
                                    id="estoqueAtual"
                                    name="estoqueAtual"
                                    type="number"
                                    value={dadosFormulario.estoqueAtual}
                                    onChange={manipularMudanca}
                                />
                            </GrupoFormulario>

                            <GrupoFormulario>
                                <label htmlFor="custoUnitario">Custo Unitário (R$):</label>
                                <input
                                    id="custoUnitario"
                                    name="custoUnitario"
                                    type="number"
                                    step="0.01"
                                    value={dadosFormulario.custoUnitario}
                                    onChange={manipularMudanca}
                                />
                            </GrupoFormulario>
                        </>
                    )}


                    <ContainerBotoesForm>
                        <BotaoAcao onClick={resetarFormulario} type="button" $tipo="cancelar">
                            CANCELAR
                        </BotaoAcao>
                        <BotaoAcao type="submit" $tipo="salvar">
                            {produtoEditando ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR'}
                        </BotaoAcao>
                    </ContainerBotoesForm>
                </FormularioEdicao>
            )}
            
            <hr style={{ margin: '30px 0', borderTop: '1px solid #444' }} />

            
            {carregando && <p>Buscando dados...</p>}
            {erro && <p style={{ color: 'red' }}>Erro: {erro}</p>}
            
            {!carregando && produtosFiltrados.length > 0 && (
                <TabelaProdutos>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                            <th>Tipo</th>
                            <th className="coluna-acoes">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosFiltrados.map((produto) => (
                            <tr key={produto.id_produto}>
                                <td>{produto.id_produto}</td>
                                <td>{produto.descricao}</td>
                                <td>{produto.categoria}</td>
                                <td>R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}</td>
                                <td>{produto.estoque_atual}</td>
                                <td>{produto.tipo_item}</td>
                                <td className="coluna-acoes">
                                    <BotaoAcao onClick={() => iniciarEdicao(produto)} $tipo="editar">
                                        Editar
                                    </BotaoAcao>
                                    <BotaoAcao onClick={() => desativarProduto(produto.id_produto)} $tipo="desativar">
                                        Desativar
                                    </BotaoAcao>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </TabelaProdutos>
            )}
            {!carregando && produtosFiltrados.length === 0 && !erro && <p>Nenhum produto encontrado para o filtro.</p>}
        </ProdutosStyled>
    );
};