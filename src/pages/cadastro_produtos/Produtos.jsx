// pages/Produtos.jsx
import React from 'react';
// Importa os hooks que fornecem lógica e estado
import { useProdutos } from './hooks/useProdutos';
import { useArrastaSolta } from './hooks/useArrastaSolta'; 
// Importa o componente do Modal
import { ProdutosModal } from './components/ProdutosModal';
// Importa os styled-components
import { 
    ProdutosStyled, 
    SecaoBusca, 
    InputBusca, 
    TabelaProdutos, 
    BotaoAcao, 
    ContainerNovoProduto 
} from './ProdutosStyled'; 

export const Produtos = () => {
    // 1. Hook de Lógica Central (Estados e CRUD)
    const {
        produtos, setProdutos,
        filtroBusca, setFiltroBusca,
        carregando, erro,
        produtoEditando,
        dadosFormulario,
        exibirFormulario,
        
        resetarFormulario,
        iniciarNovoCadastro,
        salvarProduto,
        desativarProduto,
        iniciarEdicao,
        manipularMudanca,
        produtosFiltrados,
        
        // NOVO: Importa a variável de validação do hook
        podeSalvar, 

    } = useProdutos();

    // 2. Hook de Drag-and-Drop (Reordenação)
    const {
        arrastandoId,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    } = useArrastaSolta(produtos, setProdutos);


    return (
        <ProdutosStyled>
            <h1>Gestão de Produtos e Serviços</h1>

            {/* Seção de Cadastro */}
            <ContainerNovoProduto>
                <BotaoAcao onClick={iniciarNovoCadastro} $tipo="adicionar">
                    + NOVO PRODUTO
                </BotaoAcao>
            </ContainerNovoProduto>

            {/* Seção de Busca */}
            <SecaoBusca>
                <InputBusca
                    type="text"
                    placeholder="Buscar por ID, Nome ou Categoria..."
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                />
            </SecaoBusca>

            <hr style={{ margin: '30px 0', borderTop: '1px solid #444' }} />

            {/* Mensagens de Status */}
            {carregando && <p>Buscando dados...</p>}
            {erro && <p style={{ color: 'red' }}>Erro: {erro}</p>}
            
            {/* Tabela de Produtos */}
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
                                    backgroundColor: produtoEditando?.id_produto === produto.id_produto ? '#2a4d69' : 'transparent',
                                    transition: 'background-color 0.2s, opacity 0.2s'
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
                                    {/* CORREÇÃO: Envolvendo botões no novo container flexível */}
                                    <div className="container-botoes-acoes">
                                        <BotaoAcao onClick={() => iniciarEdicao(produto)} $tipo="editar">
                                            Editar
                                        </BotaoAcao>
                                        <BotaoAcao onClick={() => desativarProduto(produto.id_produto)} $tipo="desativar">
                                            Desativar
                                        </BotaoAcao>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </TabelaProdutos>
            )}
            
            {/* Mensagem de Sem Resultados */}
            {!carregando && produtosFiltrados.length === 0 && !erro && <p>Nenhum produto encontrado para o filtro.</p>}

            {/* Modal de Edição/Cadastro */}
            <ProdutosModal
                produtoEditando={produtoEditando}
                exibirFormulario={exibirFormulario}
                dadosFormulario={dadosFormulario}
                manipularMudanca={manipularMudanca}
                salvarProduto={salvarProduto}
                resetarFormulario={resetarFormulario}
                podeSalvar={podeSalvar} 
            />
        </ProdutosStyled>
    );
};