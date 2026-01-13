import styled from "styled-components";

// Paleta Minimalista:
// Fundo Principal: #1e1e1e
// Fundo Secundário/Card: #2d2d2d
// Texto Principal: #E0E0E0
// Destaque (Sucesso/Ativo): #64ff8a
// Destaque (Perigo/Erro): #E53935
// Destaque (Ação/Primário): #FF9800

export const CadastroAtendentesStyled = styled.div`
  width: 98%;
  height: 100%;
  margin: 20px auto;
  padding: 25px;
  background-color: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow-y: auto;
  color: #e0e0e0;

  /* ====================================================================
       CABEÇALHO
    ==================================================================== */

  .cabecalho {
    padding-bottom: 25px;
    border-bottom: 1px dashed #333;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    justify-content: center;
    height: 20%;

    h1 {
      color: #e0e0e0;
      font-size: 32px;
      font-weight: 300;
    }
  }

  /* ====================================================================
       SEÇÕES E LAYOUT
    ==================================================================== */
  .secao-filtros,
  .secao-acoes {
    padding: 20px;
    background-color: #2d2d2d;
    border-radius: 8px;
    border: 1px solid #333;
  }

  .secao-filtros {
    .filtros-linha {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 20px;
      align-items: end;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }

    .grupo-filtro {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .titulo-secao {
      color: #ff9800;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .secao-acoes {
    .linha-superior {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 30px;
      align-items: start;
      margin-bottom: 20px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 15px;
      }
    }

    .info-resumo {
      h3 {
        margin: 0 0 15px 0;
        color: #e0e0e0;
        font-size: 16px;
        font-weight: 500;
      }

      .itens-resumo {
        display: flex;
        gap: 25px;
        flex-wrap: wrap;
      }

      .item-resumo {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #a0a0a0;
        font-size: 14px;
      }
    }

    .botoes-acoes {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        justify-content: stretch;
      }
    }

    /* ESTILOS PARA INFO SESSÃO ATIVA/INATIVA */
    .info-sessao {
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 0.9rem;
      margin-top: 10px;

      &.ativa {
        background-color: #304e30;
        border: 1px solid #64ff8a;
      }

      &.inativa {
        background-color: #443020;
        border: 1px solid #ff9800;
      }
    }
  }

  /* ====================================================================
       TABELAS
    ==================================================================== */
  .tabela-container {
    border: 1px solid #333;
    border-radius: 8px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    height: 100%;
  }

  .tabela-atendentes {
    width: 100%;
    border-collapse: collapse;
    color: #e0e0e0;
    font-size: 14px;
    table-layout: auto;

    th,
    td {
      border-bottom: 1px solid #333;
      padding: 12px 15px;
      text-align: left;
      word-wrap: break-word;
    }

    th {
      background-color: #2d2d2d;
      color: #a0a0a0;
      font-weight: 500;
      font-size: 13px;
      text-transform: uppercase;
      border-top: 1px solid #333;
      letter-spacing: 0.5px;
    }

    tr:nth-child(even) {
      background-color: #232323;
    }

    tr:nth-child(odd) {
      background-color: #1e1e1e;
    }

    tr:hover {
      background-color: #383838;
    }

    .celula-acao {
      text-align: center;
      width: 200px;
    }
  }

  /* ====================================================================
       MODAL E COMPONENTES AUXILIARES
    ==================================================================== */
  .modal-content {
    background-color: #2d2d2d;
    border: 1px solid #333;
    padding: 30px;
    width: 90%;
    max-width: 600px;
    border-radius: 10px;
  }

  .modal-header {
    border-bottom: 1px solid #3b3b3b;
    padding-bottom: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 { color: #e0e0e0; }

    .fechar-modal {
      background: none;
      border: none;
      color: #a0a0a0;
      font-size: 1.5rem;
      cursor: pointer;
      &:hover { color: #e0e0e0; }
    }
  }

  .modal-footer {
    border-top: 1px solid #3b3b3b;
    padding-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 15px;
  }
`;

export const Card = styled.div`
  background-color: #2d2d2d;
  border: 1px solid #3b3b3b;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
`;

export const BotaoPrimario = styled.button`
  padding: 10px 16px;
  background-color: #ff9800;
  color: #1e1e1e;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  &:hover:not(:disabled) { background-color: #e68900; }
`;

export const BotaoSecundario = styled.button`
  padding: 10px 16px;
  background-color: #444;
  color: #e0e0e0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  &:hover:not(:disabled) { background-color: #555; }
`;

export const BotaoSucesso = styled.button`
  padding: 10px 16px;
  background-color: #64ff8a;
  color: #1e1e1e;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  &:hover:not(:disabled) { background-color: #4caf50; }
`;

export const BotaoPerigo = styled.button`
  padding: 10px 16px;
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  &:hover:not(:disabled) { background-color: #c62828; }
`;

export const Input = styled.input`
  padding: 10px 12px;
  background-color: #262626;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  &:focus { border-color: #ff9800; outline: none; }
`;

export const Select = styled.select`
  padding: 10px 12px;
  background-color: #262626;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
  &:focus { border-color: #ff9800; outline: none; }
`;

export const Label = styled.label`
  color: #e0e0e0;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  display: block;
`;

/**
 * COMPONENTE FLEX CORRIGIDO
 * Usando transient props ($) para evitar erros no console do navegador.
 */
export const Flex = styled.div`
  display: flex;
  align-items: ${(props) => props.$align || "center"};
  gap: ${(props) => props.$gap || "10px"};
  justify-content: ${(props) => props.$justify || "flex-start"};
  flex-wrap: ${(props) => props.$wrap || "nowrap"};
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  color: #1e1e1e;

  &.sucesso { background-color: #64ff8a; }
  &.aviso { background-color: #ff9800; }
  &.perigo { background-color: #e53935; color: white; }
  &.info { background-color: #2196f3; }
`;

export const TabelaContainer = styled.div`
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #2d2d2d;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;