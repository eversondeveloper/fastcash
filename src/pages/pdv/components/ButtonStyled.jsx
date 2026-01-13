import styled, { keyframes, css } from "styled-components";

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
`;

export const ButtonStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100% !important; 
  aspect-ratio: 1 / 1;
  padding: 15px 10px;
  border-radius: 16px;
  box-sizing: border-box;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  background-color: ${(props) => props.$background};
  background-image: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%);
  color: ${(props) => props.$corTexto || '#FFFFFF'};
  
  border: 1px solid rgba(255, 255, 255, 0.1);
  ${props => props.$isEstoqueBaixo && !props.$isEsgotado && css`
    border: 1px solid #FF9800;
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.2);
  `}
  ${props => props.$isEsgotado && css`
    border: 1px solid #FF5252;
    filter: grayscale(0.8);
    opacity: 0.5;
    pointer-events: none;
  `}
  ${props => props.$selecionado && css`
    border: 2px solid #64ff8a;
    box-shadow: 0 0 15px rgba(100, 255, 138, 0.3);
  `}

  cursor: ${(props) => props.$isEsgotado ? 'not-allowed' : 'pointer'};

  &:hover {
    transform: translateY(-4px);
    background-image: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    z-index: 10;
  }

  &:active {
    transform: scale(0.95);
    transition: all 0.1s;
  }

  .badge-superior {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;

    .indice {
      font-size: 11px;
      font-weight: 800;
      background: rgba(0, 0, 0, 0.3);
      padding: 2px 6px;
      border-radius: 6px;
      opacity: 0.6;
    }

    .tag-popular {
      img {
        width: 16px;
        height: 16px;
        filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
        animation: ${pulse} 2s infinite ease-in-out;
      }
    }
  }

  .conteudo-produto {
    text-align: center;
    width: 100%;
    margin-top: 10px;

    .categoria-label {
      display: block;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.7;
      margin-bottom: 4px;
    }

    .descricao-titulo {
      font-size: 13px;
      font-weight: 600;
      margin: 0;
      line-height: 1.2;
      color: #fff;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 31px; 
    }

    .preco-tag {
      margin-top: 8px;
      color: #64ff8a;
      
      small {
        font-size: 10px;
        font-weight: 600;
        margin-right: 2px;
      }
      
      strong {
        font-size: 18px;
        font-weight: 900;
      }
    }
  }

  .overlay-status.esgotado {
    position: absolute;
    inset: 0;
    background: rgba(183, 28, 28, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 1px;
    transform: rotate(-15deg) scale(1.2);
  }

  .tag-alerta-estoque {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #FF9800;
    color: #000;
    font-size: 9px;
    font-weight: 800;
    padding: 2px;
    text-align: center;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
  }
`;