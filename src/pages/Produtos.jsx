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
    const [exibirFormulario, setExibirFormulario] = useState(false);
    
    const [arrastandoId, setArrastandoId] = useState(null); 

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
        setExibirFormulario(false);
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
        setExibirFormulario(true);
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
        setExibirFormulario(true);
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

    
    const handleDragStart = (e, id) => {
        setArrastandoId(id);
        e.dataTransfer.setData("text/plain", id); 
    };

    const handleDragOver = (e) => {
        e.preventDefault(); 
        if (arrastandoId) {
            e.currentTarget.classList.add('arrastando-sobre');
        }
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('arrastando-sobre');
    }

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        e.currentTarget.classList.remove('arrastando-sobre');
        
        const sourceId = arrastandoId; 
        
        if (sourceId === targetId) return;

        const produtosCopy = [...produtos];
        const arrastadoIndex = produtosCopy.findIndex(p => p.id_produto === sourceId);
        const alvoIndex = produtosCopy.findIndex(p => p.id_produto === targetId);

        if (arrastadoIndex === -1 || alvoIndex === -1) return;

        const [produtoArrastado] = produtosCopy.splice(arrastadoIndex, 1);
        produtosCopy.splice(alvoIndex, 0, produtoArrastado);

        setProdutos(produtosCopy);
        setArrastandoId(null);
    };

    // Fechar modal ao pressionar ESC
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.keyCode === 27 && exibirFormulario) {
                resetarFormulario();
            }
        };
        
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [exibirFormulario]);

    // Prevenir scroll do body quando modal estiver aberto
    useEffect(() => {
        if (exibirFormulario) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [exibirFormulario]);

    return (
        <ProdutosStyled>
            <h1>Gestão de Produtos e Serviços</h1>

            <ContainerNovoProduto>
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

            {/* Modal Fixo que fica sobre tudo */}
            {(produtoEditando || exibirFormulario) && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    overflow: 'auto'
                }} onClick={resetarFormulario}>
                    <div style={{
                        backgroundColor: '#333',
                        padding: '30px',
                        borderRadius: '10px',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        <FormularioEdicao onSubmit={salvarProduto} style={{ margin: 0 }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                marginBottom: '20px',
                                borderBottom: '1px solid #555',
                                paddingBottom: '10px'
                            }}>
                                <h2 style={{ margin: 0, color: '#BACBD9' }}>
                                    {produtoEditando ? `Editando Produto ID: ${produtoEditando.id_produto}` : 'Cadastrar Novo Produto'}
                                </h2>
                                <button 
                                    type="button" 
                                    onClick={resetarFormulario}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '24px',
                                        cursor: 'pointer',
                                        color: '#BACBD9',
                                        padding: '5px',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <GrupoFormulario style={{ gridColumn: 'span 2' }}>
                                    <label htmlFor="descricao">Descrição (Nome):</label>
                                    <input
                                        id="descricao"
                                        name="descricao"
                                        type="text"
                                        value={dadosFormulario.descricao}
                                        onChange={manipularMudanca}
                                        required
                                        autoFocus
                                        style={{ width: '100%' }}
                                    />
                                </GrupoFormulario>
                                
                                <GrupoFormulario style={{ gridColumn: 'span 2' }}>
                                    <label htmlFor="categoria">Categoria:</label>
                                    <input
                                        id="categoria"
                                        name="categoria"
                                        type="text"
                                        value={dadosFormulario.categoria}
                                        onChange={manipularMudanca}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                </GrupoFormulario>
                                
                                <GrupoFormulario>
                                    <label htmlFor="preco">Preço (R$):</label>
                                    <input
                                        id="preco"
                                        name="preco"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={dadosFormulario.preco}
                                        onChange={manipularMudanca}
                                        required
                                        style={{ width: '100%' }}
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
                                        style={{ width: '100%' }}
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
                                                min="0"
                                                value={dadosFormulario.estoqueAtual}
                                                onChange={manipularMudanca}
                                                style={{ width: '100%' }}
                                            />
                                        </GrupoFormulario>

                                        <GrupoFormulario>
                                            <label htmlFor="custoUnitario">Custo Unitário (R$):</label>
                                            <input
                                                id="custoUnitario"
                                                name="custoUnitario"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={dadosFormulario.custoUnitario}
                                                onChange={manipularMudanca}
                                                style={{ width: '100%' }}
                                            />
                                        </GrupoFormulario>

                                        <GrupoFormulario style={{ gridColumn: 'span 2' }}>
                                            <label htmlFor="codigoBarra">Código de Barras:</label>
                                            <input
                                                id="codigoBarra"
                                                name="codigoBarra"
                                                type="text"
                                                value={dadosFormulario.codigoBarra}
                                                onChange={manipularMudanca}
                                                style={{ width: '100%' }}
                                            />
                                        </GrupoFormulario>
                                    </>
                                )}
                            </div>

                            <ContainerBotoesForm style={{ marginTop: '20px' }}>
                                <BotaoAcao onClick={resetarFormulario} type="button" $tipo="cancelar">
                                    CANCELAR
                                </BotaoAcao>
                                <BotaoAcao type="submit" $tipo="salvar">
                                    {produtoEditando ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR'}
                                </BotaoAcao>
                            </ContainerBotoesForm>
                        </FormularioEdicao>
                    </div>
                </div>
            )}
            
            <hr style={{ margin: '30px 0', borderTop: '1px solid #444' }} />

            
            {carregando && <p>Buscando dados...</p>}
            {erro && <p style={{ color: 'red' }}>Erro: {erro}</p>}
            
            {!carregando && produtosFiltrados.length > 0 && (
                <TabelaProdutos>
                    <thead>
                        <tr>
                            <th style={{ width: '30px' }}>#</th>
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
                        {produtosFiltrados.map((produto, index) => (
                            <tr 
                                key={produto.id_produto}
                                draggable
                                onDragStart={(e) => handleDragStart(e, produto.id_produto)}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, produto.id_produto)}
                                style={{ 
                                    opacity: arrastandoId === produto.id_produto ? 0.5 : 1, 
                                    cursor: 'grab',
                                    backgroundColor: produtoEditando?.id_produto === produto.id_produto ? '#2a4d69' : 'transparent'
                                }}
                            >
                                <td>{index + 1}</td>
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