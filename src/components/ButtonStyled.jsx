import styled from "styled-components";

export const ButtonStyled = styled.div`
  padding: 10px 20px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) => props.$background};
  color: ${(props) => props.$corTexto};
  font-weight: bold;
  text-align: center;
  width: 24.7%;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;

  &:hover {
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.4);
    transform: scale(1.05);
    transition: all 0.3s ease-in-out;
  }

  .numbutton {
    color: ${(props) => props.$corTexto};
    position: absolute;
    top: 10px;
    left: 10px;
  }

  p {
    color: ${(props) => props.$corTexto};
  }
`;
