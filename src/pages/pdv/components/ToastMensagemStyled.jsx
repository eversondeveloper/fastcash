import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from { transform: translateX(100%) scale(0.9); opacity: 0; }
  to { transform: translateX(0) scale(1); opacity: 1; }
`;

const progress = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

export const ToastMensagemStyled = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 280px;
  max-width: 400px;
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  overflow: hidden;
  
  /* Animação de Entrada e Saída */
  transform: translateX(120%);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  opacity: 0;

  &.visible {
    transform: translateX(0);
    opacity: 1;
  }

  /* ESTILO PARA TOAST CLICÁVEL (Sucesso de Venda) */
  &.clicavel {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(25, 25, 25, 0.9);
      border-color: rgba(76, 175, 80, 0.4);
      filter: brightness(1.2);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0) scale(0.98);
    }
  }

  .toast-corpo {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
  }

  /* ÍCONE ESTILIZADO */
  .toast-icone-wrapper {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 16px;
    flex-shrink: 0;
  }

  /* TEXTO E HIERARQUIA */
  .toast-texto {
    display: flex;
    flex-direction: column;
    flex: 1;

    label {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 1px;
      margin-bottom: 2px;
      opacity: 0.6;
    }

    span {
      font-size: 13px;
      color: #eee;
      font-weight: 500;
      line-height: 1.4;
    }

    small {
      color: #4caf50;
      font-weight: bold;
    }
  }

  .btn-fechar-toast {
    background: transparent;
    border: none;
    color: #555;
    cursor: pointer;
    font-size: 14px;
    padding: 5px;
    transition: color 0.2s;
    &:hover { color: #fff; }
  }

  /* BARRA DE TEMPO */
  .barra-progresso {
    height: 3px;
    width: 0%;
    background: #646cff;
  }

  &.visible .barra-progresso {
    animation: ${progress} 4.5s linear forwards; /* Sincronizado com os 4500ms do componente */
  }

  /* VARIANTES DE CORES */
  &.toast-sucesso {
    border-left: 4px solid #4caf50;
    .toast-icone-wrapper { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
    .barra-progresso { background: #4caf50; }
  }

  &.toast-erro {
    border-left: 4px solid #ff5252;
    .toast-icone-wrapper { background: rgba(255, 82, 82, 0.2); color: #ff5252; }
    .barra-progresso { background: #ff5252; }
  }

  &.toast-aviso {
    border-left: 4px solid #ffc107;
    .toast-icone-wrapper { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
    .barra-progresso { background: #ffc107; }
  }

  &.toast-info {
    border-left: 4px solid #2196f3;
    .toast-icone-wrapper { background: rgba(33, 150, 243, 0.2); color: #2196f3; }
    .barra-progresso { background: #2196f3; }
  }
`;