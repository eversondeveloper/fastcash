import styled from 'styled-components';

export const RelatoriosStyled = styled.div`
    width: 98%;
    height: 100%;
    margin: 20px auto;
    padding: 20px;
    background-color: #262626;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    bottom: solid;

    h1 {
        margin-bottom: 20px;
        color: #BACBD9;
        font-size: 28px;
    }

    p {
        color: #888;
        font-size: 18px;
    }
`;

export const TabelaVendas = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #BACBD9;
    font-size: 14px;

    th, td {
        border: 1px solid #3b3b3b;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #3b3b3b;
        color: white;
        text-transform: uppercase;
    }

    tr:nth-child(even) {
        background-color: #1e1e1e;
    }

    tr:hover {
        background-color: #333;
    }
`;

// ====================================================================
// ESTILOS DE FILTRO E AÇÕES (Novos e Ajustados)
// ====================================================================

export const SecaoFiltros = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 25px;
    padding: 15px;
    border: 1px solid #3b3b3b;
    border-radius: 8px;
    width: 100%;

    .grupo-input {
        display: flex;
        flex-direction: column;
        label {
            font-size: 14px;
            margin-bottom: 5px;
            color: #ccc;
        }
    }
`;

export const InputFiltro = styled.input`
    padding: 8px;
    border: 1px solid #555;
    border-radius: 5px;
    background-color: #1e1e1e;
    color: #BACBD9;
    font-size: 14px;
`;

export const ResumoTotal = styled.div`
    background-color: #3b3b3b;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    display: flex;
    justify-content: space-between;

    span {
        color: #64ff8a; 
        font-size: 20px;
    }
`;

export const BotaoAcaoDelecao = styled.button`
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s;
    color: white;
    
    &:disabled {
        background-color: #555;
        cursor: not-allowed;
    }

    &.deletar-periodo {
        background-color: #ff9800; /* Laranja para deletar período */
        &:hover:not(:disabled) {
            opacity: 0.8;
        }
    }

    &.deletar-tudo {
        background-color: #d32f2f; /* Vermelho escuro para deletar todas */
        &:hover:not(:disabled) {
            opacity: 0.8;
        }
    }

    &.deletar-linha {
        background-color: #dc3545; /* Vermelho padrão para linha única */
        padding: 5px 10px;
        &:hover:not(:disabled) {
            opacity: 0.8;
        }
    }
    
    &.limpar-filtro {
        background-color: #6c757d; /* Cinza para limpar filtros */
        align-self: flex-end;
        height: 38px; /* Alinha com os inputs */
    }
`;

export const ContainerAcoesTopo = styled.div`
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 20px;
`;