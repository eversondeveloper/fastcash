// components/ProdutosModal.jsx
import React from 'react';
import { 
    FormularioEdicao,
    GrupoFormulario,
    ContainerBotoesForm,
    BotaoAcao 
} from '../ProdutosStyled'; 

export const ProdutosModal = ({
    produtoEditando,
    exibirFormulario,
    dadosFormulario,
    manipularMudanca,
    salvarProduto,
    resetarFormulario,
    podeSalvar, 
}) => {

    if (!exibirFormulario) return null;

    const tituloModal = produtoEditando 
        ? `Editando Produto ID: ${produtoEditando.id_produto}` 
        : 'Cadastrar Novo Produto';

    const textoBotaoSalvar = produtoEditando ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR';

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '20px'
            }} 
            onClick={resetarFormulario}
        >
            <div 
                style={{
                    backgroundColor: '#2d2d2d',
                    padding: '30px',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '650px',
                    maxHeight: '95vh',
                    overflowY: 'auto',
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    border: '1px solid #444'
                }} 
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '25px',
                    borderBottom: '1px solid #444',
                    paddingBottom: '15px'
                }}>
                    <h2 style={{ margin: 0, color: '#E0E0E0', fontSize: '22px', fontWeight: '400' }}>
                        {tituloModal}
                    </h2>
                    <button 
                        type="button" 
                        onClick={resetarFormulario}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '28px',
                            cursor: 'pointer',
                            color: '#A0A0A0',
                            lineHeight: '1'
                        }}
                    >
                        ×
                    </button>
                </div>

                <FormularioEdicao onSubmit={salvarProduto} style={{ margin: 0, padding: 0, border: 'none', backgroundColor: 'transparent' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        
                        {/* Descrição */}
                        <GrupoFormulario style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="descricao">Descrição (Nome):</label>
                            <input
                                id="descricao"
                                name="descricao"
                                type="text"
                                value={dadosFormulario.descricao || ''}
                                onChange={manipularMudanca}
                                required
                                autoFocus
                                placeholder="Ex: Letreiro em Acrílico"
                            />
                        </GrupoFormulario>
                        
                        {/* Categoria */}
                        <GrupoFormulario style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="categoria">Categoria:</label>
                            <input
                                id="categoria"
                                name="categoria"
                                type="text"
                                value={dadosFormulario.categoria || ''}
                                onChange={manipularMudanca}
                                required
                                placeholder="Ex: Comunicação Visual"
                            />
                        </GrupoFormulario>
                        
                        {/* Preço */}
                        <GrupoFormulario>
                            <label htmlFor="preco">Preço de Venda (R$):</label>
                            <input
                                id="preco"
                                name="preco"
                                type="number"
                                step="0.01"
                                min="0"
                                value={dadosFormulario.preco !== undefined ? dadosFormulario.preco : 0} 
                                onChange={manipularMudanca}
                                required
                            />
                        </GrupoFormulario>

                        {/* Tipo */}
                        <GrupoFormulario>
                            <label htmlFor="tipoItem">Tipo de Item:</label>
                            <select
                                id="tipoItem"
                                name="tipoItem"
                                value={dadosFormulario.tipoItem || 'Serviço'}
                                onChange={manipularMudanca}
                                required
                            >
                                <option value="Serviço">Serviço</option>
                                <option value="Produto">Produto</option>
                            </select>
                        </GrupoFormulario>
                        
                        {/* Campos específicos de PRODUTO */}
                        {dadosFormulario.tipoItem === 'Produto' && (
                            <>
                                <GrupoFormulario>
                                    <label htmlFor="estoqueAtual">Estoque Atual:</label>
                                    <input
                                        id="estoqueAtual"
                                        name="estoqueAtual"
                                        type="number"
                                        min="0"
                                        value={dadosFormulario.estoqueAtual !== undefined ? dadosFormulario.estoqueAtual : 0}
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
                                        min="0"
                                        value={dadosFormulario.custoUnitario !== undefined ? dadosFormulario.custoUnitario : 0}
                                        onChange={manipularMudanca}
                                    />
                                </GrupoFormulario>

                                <GrupoFormulario style={{ gridColumn: 'span 2' }}>
                                    <label htmlFor="codigoBarra">Código de Barras:</label>
                                    <input
                                        id="codigoBarra"
                                        name="codigoBarra"
                                        type="text"
                                        value={dadosFormulario.codigoBarra || ''}
                                        onChange={manipularMudanca}
                                        placeholder="Código de barras opcional"
                                    />
                                </GrupoFormulario>
                            </>
                        )}
                    </div>

                    <ContainerBotoesForm style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444' }}>
                        <BotaoAcao onClick={resetarFormulario} type="button" $tipo="cancelar">
                            CANCELAR
                        </BotaoAcao>
                        <BotaoAcao 
                            type="submit" 
                            $tipo="salvar" 
                            disabled={!podeSalvar} 
                        >
                            {textoBotaoSalvar}
                        </BotaoAcao>
                    </ContainerBotoesForm>
                </FormularioEdicao>
            </div>
        </div>
    );
};