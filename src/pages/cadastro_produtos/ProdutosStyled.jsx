import styled from 'styled-components';

// Paleta Minimalista:
// Fundo Principal: #1e1e1e
// Fundo Secundário/Card: #2d2d2d
// Borda/Separador: #333
// Texto Principal: #E0E0E0
// Destaque (Ação/Primário): #FF9800
// Destaque (Sucesso/Salvar): #64ff8a
// Destaque (Erro/Desativar): #E53935
// Destaque (Info/Editar): #2196F3

export const ProdutosStyled = styled.div`
    width: 98%;
    height: 100%;
    margin: 20px auto;
    padding: 25px;
    background-color: #1e1e1e;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
    min-height: 80vh;
    color: #E0E0E0;
    overflow-y: auto;
    
    h1 {
        color: #E0E0E0;
        font-size: 32px;
        font-weight: 300;
        margin-bottom: 30px;
        text-align: center;
    }
`;

export const ContainerNovoProduto = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 25px;
`;

export const SecaoBusca = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 30px;
    padding: 15px;
    background-color: #2d2d2d;
    border-radius: 8px;
    border: 1px solid #333;
`;

export const InputBusca = styled.input`
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #1e1e1e;
    color: #E0E0E0;
    font-size: 14px;
    width: 100%;
    
    &:focus {
        outline: none;
        border-color: #FF9800;
    }
`;

export const TabelaProdutos = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #E0E0E0;
    font-size: 14px;
    margin-top: 20px;
    table-layout: auto; /* Permite ajuste fluido das colunas */

    th, td {
        border-bottom: 1px solid #333;
        padding: 12px 10px;
        text-align: left;
        white-space: nowrap; /* Evita quebra de linha em dados curtos */
    }

    /* Coluna Descrição: Única que pode quebrar linha para ganhar espaço */
    th:nth-child(3), td:nth-child(3) {
        white-space: normal;
        width: 100%; /* Empurra as outras colunas para o tamanho mínimo necessário */
        min-width: 200px;
    }
    
    th {
        background-color: #2d2d2d;
        color: #A0A0A0;
        font-weight: 500;
        text-transform: uppercase;
        border-top: 1px solid #333;
    }

    tbody tr:nth-child(even) {
        background-color: #232323;
    }
    
    tbody tr:hover {
        background-color: #383838;
    }

    tbody tr {
        cursor: grab;
        transition: background-color 0.2s;
    }

    tbody tr.arrastando-sobre {
        border-bottom: 2px solid #FF9800;
        background-color: #444 !important;
    }
    
    /* CORREÇÃO: Largura aumentada e flexbox para os botões não apertarem */
    .coluna-acoes {
        width: 200px; 
        text-align: right;
    }

    .container-botoes-acoes {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
    }
`;

export const BotaoAcao = styled.button`
    padding: 8px 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    font-size: 12px;
    transition: all 0.2s;
    white-space: nowrap; /* Garante que o texto do botão não quebre */
    
    background-color: ${(props) => {
        if (props.$tipo === 'editar') return '#2196F3';
        if (props.$tipo === 'desativar') return '#E53935';
        if (props.$tipo === 'adicionar') return '#FF9800';
        if (props.$tipo === 'cancelar') return '#6c757d';
        
        const childrenText = String(props.children).toUpperCase();
        if (childrenText.includes('SALVAR') || childrenText.includes('CADASTRAR')) {
             return '#64ff8a';
        }
        return '#444';
    }};
    
    color: ${(props) => {
        if (props.$tipo === 'desativar' || props.$tipo === 'cancelar') return 'white';
        return '#1e1e1e';
    }};

    &:hover:not(:disabled) {
        filter: brightness(1.1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); 
    }

    &:disabled {
        background-color: #444;
        cursor: not-allowed;
        opacity: 0.5;
        color: #888;
    }
`;

export const FormularioEdicao = styled.form`
    background-color: #2d2d2d;
    padding: 25px;
    border-radius: 8px;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid #333;
`;

export const GrupoFormulario = styled.div`
    display: flex;
    flex-direction: column;
    
    label {
        margin-bottom: 8px;
        font-weight: 500;
        color: #E0E0E0;
    }

    input, select {
        padding: 10px;
        border: 1px solid #444;
        border-radius: 5px;
        background-color: #1e1e1e;
        color: #E0E0E0;
        font-size: 14px;
        
        &:focus {
            outline: none;
            border-color: #FF9800;
        }
    }
`;

export const ContainerBotoesForm = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 10px;
`;