import styled from "styled-components";

export const ResumoVendaStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 15px; /* Alinhado ao gap padrão do sistema */
  box-sizing: border-box;

  /* --- PAINEL SUPERIOR DE STATUS --- */
  .painel-status-pagamento {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
    overflow-y: auto;

    /* Custom Scrollbar para manter o padrão */
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
  }

  label {
    display: block;
    font-size: 10px; /* Padronizado com Filtros e Carrinho */
    font-weight: 800;
    color: #4caf50; /* Verde padrão para labels de seção */
    letter-spacing: 1px;
    margin-bottom: 5px;
    text-transform: uppercase;
  }

  /* FORMA DE PAGAMENTO */
  .secao-metodo {
    .metodo-valor {
      font-size: 18px;
      color: #eee; /* Removido azulado para manter o cinza neutro do sistema */
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  }

  /* VALOR TOTAL (DESTAQUE) */
  .secao-total-venda {
    .total-valor {
      font-size: 44px;
      color: #fff; /* Removido Amarelo; branco para clareza ou verde para sucesso */
      font-weight: 900;
      line-height: 1;
    }
  }

  /* DETALHAMENTO MISTO */
  .detalhes-mistos-container {
    background: #1a1a1a;
    border-radius: 12px;
    padding: 15px;
    border: 1px solid #282828;

    .linha-detalhe {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #222;
      font-size: 12px;
      span { color: #888; }
      strong { color: #fff; }
      &:last-of-type { border-bottom: none; }
    }

    .total-pago-row {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #333; /* Mudado de dashed para solid para limpeza */
      display: flex;
      justify-content: space-between;
      span { color: #888; font-weight: 800; font-size: 10px; }
      strong { color: #64ff8a; font-size: 18px; font-weight: 900; }
    }
  }

  /* PAINEL DE RESULTADO (PENDENTE / TROCO / PAGO) */
  .painel-resultado {
    margin-top: auto;

    .status-box {
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      transition: 0.3s;

      &.pendente {
        background: #2a1a1a; /* Tom de vermelho escuro padrão Carrinho */
        border: 1px solid #4a2121;
        .resultado-valor { color: #ff5252; font-size: 32px; font-weight: 900; }
        label { color: #ff5252; }
      }

      &.troco {
        background: #121212;
        border: 2px solid #4caf50; /* Destaque maior no troco */
        .resultado-valor { color: #64ff8a; font-size: 32px; font-weight: 900; }
        label { color: #4caf50; }
      }

      &.pago {
        background: #1b5e20;
        border: 1px solid #2e7d32;
        padding: 25px;
        .resultado-texto {
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 1.5px;
          animation: pulsar 2s infinite;
        }
      }
    }
  }

  /* --- BOTÕES DE RODAPÉ PADRONIZADOS --- */
  .container-botoes-rodape {
    display: flex;
    gap: 12px;
    padding-top: 10px;

    button {
      flex: 1;
      height: 55px;
      border-radius: 12px;
      border: none;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
      
      &:active { transform: scale(0.96); } /* Efeito de clique padrão */
    }

    .btn-cancelar {
      background: #2a1a1a;
      color: #ff5252;
      border: 1px solid #4a2121;
      &:hover { background: #ff5252; color: #fff; }
    }

    .btn-finalizar {
      background: #1a1a1a;
      color: #444;
      border: 1px solid #282828;
      cursor: not-allowed;

      &.disponivel {
        background: #4caf50;
        color: #000;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
        &:hover { background: #64ff8a; box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3); }
      }
    }
  }

  @keyframes pulsar {
    0% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.03); }
    100% { opacity: 0.8; transform: scale(1); }
  }
`;