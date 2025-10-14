import styled from 'styled-components';

export const ProdutosStyled = styled.div`
    width: 95%;
    height: 100%;
    margin: 20px auto;
    padding: 20px;
    background-color: #262626;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    min-height: 80vh;
    color: #BACBD9;
    overflow-y: auto;
    
    h1 {
        color: #BACBD9;
        font-size: 28px;
        margin-bottom: 20px;
        text-align: center;
    }
`;


export const ContainerNovoProduto = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
`;

export const SecaoBusca = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #333;
    border-radius: 5px;
`;

export const InputBusca = styled.input`
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #555;
    border-radius: 5px;
    background-color: #1e1e1e;
    color: #BACBD9;
    font-size: 16px;
    width: 100%;
`;

export const TabelaProdutos = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #BACBD9;
    font-size: 14px;
    margin-top: 20px;

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

    tbody tr:nth-child(even) {
        background-color: #1e1e1e;
    }
    
    /* ESTILOS PARA DRAG & DROP */
    tbody tr {
        cursor: grab;
        transition: background-color 0.2s;
    }

    /* Feedback visual ao arrastar sobre */
    tbody tr.arrastando-sobre {
        border-bottom: 2px solid #646cff; 
        background-color: #383838 !important;
    }
    
    /* Garante que o hover padrão volte ao normal */
    tbody tr:hover {
        background-color: #333;
    }

    .coluna-acoes {
        width: 150px;
        text-align: center;
    }
`;

export const BotaoAcao = styled.button`
    padding: 5px 10px;
    margin: 0 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    color: white;
    background-color: ${(props) => {
        if (props.$tipo === 'editar') return '#ffc107'; 
        if (props.$tipo === 'desativar') return '#dc3545'; 
        if (props.$tipo === 'adicionar') return '#007bff'; 
        if (props.$tipo === 'cancelar') return '#6c757d'; 
        if (props.$tipo === 'salvar') return '#28a745'; 
        return '#007bff'; 
    }};

    &:hover {
        opacity: 0.9;
    }
`;

export const FormularioEdicao = styled.form`
    background-color: #333;
    padding: 20px;
    border-radius: 8px;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const GrupoFormulario = styled.div`
    display: flex;
    flex-direction: column;
    
    label {
        margin-bottom: 5px;
        font-weight: bold;
        color: #BACBD9;
    }

    input, select {
        padding: 10px;
        border: 1px solid #555;
        border-radius: 5px;
        background-color: #1e1e1e;
        color: #BACBD9;
    }
`;

export const ContainerBotoesForm = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
`;