import styled from "styled-components";

export const ListaProdutosStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .barra-ferramentas-catalogo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #1a1a1a;
    border-bottom: 1px solid #282828;
    flex-shrink: 0;
  }

  .seletor-organizacao-container {
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      font-size: 10px;
      font-weight: 800;
      color: #555;
      letter-spacing: 1px;
    }
  }

  .select-organizacao {
    background-color: #252525;
    color: #fff;
    border: 1px solid #333;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;

    &:focus {
      border-color: #646cff;
    }
  }

  .badge-contagem {
    font-size: 10px;
    font-weight: 800;
    color: #888;
    background: #121212;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid #282828;
  }

  .grid-produtos-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 10px; /* Reduzido levemente para ganhar espaço */

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 10px;
    }
  }

  .buttons-catalogo {
    display: grid !important;
    /* FORÇA 3 COLUNAS INDEPENDENTE DO CONTEÚDO */
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 8px !important; /* Gap levemente menor para caber em telas menores */
    width: 100% !important;
    justify-items: stretch !important;
    align-items: start !important;
  }

  .mensagem-carregando,
  .mensagem-sem-produtos {
    color: #666;
    text-align: center;
    margin-top: 50px;
    font-size: 14px;
    font-style: italic;
  }
`;