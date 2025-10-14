import styled, { keyframes } from "styled-components";

const brilho = keyframes`
    0% {
        box-shadow: inset 0 0 0 rgba(255, 255, 255, 0.0), 
                    3px 3px 6px #1a1a1a;
    }
    50% {
        box-shadow: inset 5px 5px 20px rgba(255, 255, 255, 0.15), 
                    3px 3px 8px #1a1a1a;
    }
    100% {
        box-shadow: inset 0 0 0 rgba(255, 255, 255, 0.0), 
                    3px 3px 6px #1a1a1a;
    }
`;

export const ButtonStyled = styled.div`
  padding: 18px 10px;
  box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.6),
    -3px -3px 8px rgba(50, 50, 50, 0.3);
  border-radius: 12px;
  cursor: pointer;
  background-color: ${(props) => props.$background};
  color: ${(props) => props.$corTexto};
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
  text-transform: uppercase;
  border: solid 2px #2a2a2a;

  width: 24.7%;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
  transition: all 0.2s ease-out;

  &:hover {
    transform: scale(1.02);
    opacity: 0.95;
    animation: ${brilho} 2s ease-in-out;
    box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.7),
      -5px -5px 10px rgba(50, 50, 50, 0.4);
  }

  &:active {
    transform: scale(0.97);
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.4),
      inset 0 0 5px rgba(0, 0, 0, 0.8), 2px 2px 5px rgba(0, 0, 0, 0.4);
    animation: none;
  }

  .numbutton {
    color: ${(props) => props.$corTexto};
    position: absolute;
    top: 10px;
    left: 12px;
    font-size: 14px;
    opacity: 0.5;
    font-weight: 700;
  }

  p {
    color: ${(props) => props.$corTexto};
    line-height: 1.2;
    font-size: 14px;
    margin: 0;
  }
`;
