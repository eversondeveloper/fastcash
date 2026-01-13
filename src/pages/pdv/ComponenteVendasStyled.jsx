import styled, { keyframes } from "styled-components";

const pulsarStatus = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const ComponenteVendasStyled = styled.div`
  width: 98%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;

  /* --- NOVOS ESTILOS: BLOQUEIO DE CAIXA --- */
  .container-bloqueio-caixa {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1e1e1e;
    border-radius: 10px;
  }

  .card-bloqueio {
    background-color: #2d2d2d;
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #3b3b3b;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

    .icone-bloqueio {
      font-size: 60px;
      display: block;
      margin-bottom: 20px;
    }

    h2 {
      color: #E0E0E0;
      margin-bottom: 10px;
      font-weight: 300;
      font-size: 24px;
    }

    p {
      color: #A0A0A0;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    .btn-ir-atendentes {
      background-color: #ff9500;
      color: #1e1e1e;
      border: none;
      padding: 12px 25px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer; /* Adicionado cursor pointer */
      font-size: 16px;
      transition: all 0.2s ease;

      &:hover {
        background-color: #e68600;
        transform: translateY(-2px);
      }
    }
  }

  /* --- ESTILOS ORIGINAIS MANTIDOS --- */
  & *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  & *::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 10px;
  }

  & *::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 10px;
  }

  & *::-webkit-scrollbar-thumb:hover {
    background: #777;
  }

  /* --- TOAST MENSAGEM --- */
  .toast-mensagem {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 6px;
    border: 1px solid;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    font-weight: 500;
    font-size: 15px;
    min-width: 250px;
    max-width: 350px;
    animation: ${slideInRight} 0.3s ease-out;
    transition: filter 0.2s ease, transform 0.2s ease;

    /* Estilo para Toast clicável de Venda */
    &.clicavel {
      cursor: pointer; /* Adicionado cursor pointer */
      &:hover {
        filter: brightness(1.15);
        transform: translateY(-2px);
      }
      &:active {
        transform: translateY(0);
      }
    }

    &.toast-erro {
      background-color: #b00020;
      border-color: #700018;
      color: white;
    }

    &.toast-aviso {
      background-color: #ffc107;
      border-color: #d39e00;
      color: #000;
    }

    &.toast-sucesso {
      background-color: #00a150;
      border-color: #007038;
      color: white;
    }
  }

  .toast-conteudo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
  }

  .toast-icone {
    font-size: 20px;
  }

  .buttons {
    width: 35%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: solid 1px #3b3b3b;
    box-shadow: inset 0 0 10px #0000004e;
    padding: 10px;
    border-radius: 10px;
    overflow: hidden;
  }

  .buttons2 {
    overflow-y: auto;
    flex-grow: 1;
    height: 80%;
  }

  .buttons-catalogo {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
    padding: 10px;
  }

  .mensagem-carregando,
  .mensagem-sem-produtos {
    color: #bacbd9;
    text-align: center;
    padding: 20px;
    font-size: 16px;
  }

  .controles {
    width: 65%;
    height: 100%;
    border: solid 1px #3b3b3b;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    gap: 10px;
  }

  .pagamento {
    height: 100%;
    width: 67%;
    display: flex;
    justify-content: space-between;
  }

  .metodos-pagamento-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 49%;
    justify-content: space-between;
    overflow-y: auto;
  }

  .resumo-pagamento-container {
    margin-top: auto;
    background-color: #2a2a2a;
    padding: 15px;
    border-radius: 8px;
    border: solid #3b3b3b;
    width: 49%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .espera-venda {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-align: center;
    gap: 20px;
  }

  .logo-espera {
    font-size: 32px;
    font-weight: 800;
    color: #bacbd9;
    letter-spacing: 2px;
    opacity: 0.5;
  }

  .letreiro-status {
    background: #1b5e20;
    color: #fff;
    padding: 15px 50px;
    border-radius: 50px;
    font-size: 24px;
    font-weight: bold;
    box-shadow: 0 0 20px rgba(27, 94, 32, 0.4);
    animation: ${pulsarStatus} 2s infinite ease-in-out;
  }

  .instrucoes-venda {
    color: #888;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 60%;
  }

  .atalhos-dica {
    display: flex;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    color: #bacbd9;
    flex-wrap: wrap;

    strong {
      color: #ff9500;
      margin-right: 5px;
    }
  }
`;