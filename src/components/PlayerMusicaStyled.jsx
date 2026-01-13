import styled from 'styled-components';

export const PlayerMusicaStyled = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.5vmin;
  padding: 0 10px;
  background-color: #333;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  --altura-base: 3.5vh;
  --tamanho-icone: calc(var(--altura-base) * 0.55);
  --tamanho-icone-principal: calc(var(--altura-base) * 0.75);
  --tamanho-fonte-principal: calc(var(--altura-base) * 0.35);
  --tamanho-fonte-secundaria: calc(var(--altura-base) * 0.25);

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 3px;
    display: flex;
    align-items: center;
    transition: transform 0.1s ease;
    
    &:hover {
      transform: scale(1.1);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }

    img {
      width: var(--tamanho-icone);
      height: var(--tamanho-icone);
    }
  }

  .tocar-parar img,
  .pausar-continuar img {
    width: var(--tamanho-icone-principal);
    height: var(--tamanho-icone-principal);
  }

  .current-track-info {
    display: flex;
    flex-direction: column;
    color: white;
    font-size: var(--tamanho-fonte-principal);
    min-width: 100px;
    max-width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 1.2;

    .tempo-musica {
      font-size: var(--tamanho-fonte-secundaria);
      color: #aaa;
    }
  }

  .volume-control {
    display: flex;
    align-items: center;

    input[type="range"] {
      -webkit-appearance: none;
      width: 80px;
      height: 4px;
      background: #555;
      border-radius: 2px;
      cursor: pointer;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      margin-top: -3px;
    }
  }
`;