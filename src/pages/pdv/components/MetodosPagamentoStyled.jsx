import styled from "styled-components";

export const MetodosPagamentoStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  /* --- GRADE DE BOTÕES (TOPO) --- */
  .grade-metodos-pagamento-topo {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    width: 100%;
    flex-shrink: 0;
  }

  .botao-metodo-moderno {
    height: 55px;
    background: #1a1a1a;
    border: 1px solid #282828;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #666;

    .icone-metodo-img { width: 18px; height: 18px; opacity: 0.4; filter: grayscale(1); }
    strong { font-size: 8px; letter-spacing: 0.5px; }

    &:hover { background: #222; border-color: #444; }

    &.ativo {
      background: #646cff;
      border-color: #646cff;
      color: white;
      box-shadow: 0 4px 12px rgba(100, 108, 255, 0.2);
      .icone-metodo-img { opacity: 1; filter: grayscale(0) brightness(2); }
    }
  }

  /* --- PAINEL DE CONFIGURAÇÃO --- */
  .painel-configuracao-pagamento {
    flex: 1;
    background: #121212;
    border: 1px solid #222;
    border-radius: 16px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* --- LAYOUTS HORIZONTAIS (DINHEIRO E MISTO) --- */
  .layout-dinheiro-horizontal,
  .layout-misto-horizontal {
    display: flex;
    flex-wrap: wrap; 
    gap: 20px;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }

  .coluna-input-principal,
  .coluna-lista-mista {
    flex: 1;
    min-width: 250px;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* --- COLUNA DE VALORES RÁPIDOS --- */
  .coluna-cedulas-rapidas {
    flex: 1;
    min-width: 220px;
    max-width: 300px;
    background: #181818;
    padding: 12px;
    border-radius: 14px;
    border: 1px solid #282828;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .label-moderna { 
    font-size: 10px; 
    color: #4caf50; 
    font-weight: 800; 
    text-align: center; 
    text-transform: uppercase;
  }

  /* --- SELETOR PADRONIZADO (IGUAL AO CARRINHO) --- */
  .seletor-valor-pill {
    display: flex;
    align-items: center;
    background: #0a0a0a;
    border-radius: 20px;
    border: 1px solid #222;
    padding: 2px 5px;
    height: 50px;

    .btn-ajuste, .btn-ajuste-p { 
      background: transparent;
      border: none;
      color: #4caf50;
      font-weight: bold;
      cursor: pointer;
      width: 40px;
      height: 40px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;

      &:hover { color: #64ff8a; }
    }

    input { 
      flex: 1; 
      min-width: 0; 
      background: transparent; 
      border: none; 
      color: #fff;
      text-align: center; 
      font-size: 20px; 
      font-weight: 700; 
      outline: none; 

      -moz-appearance: textfield;
      &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    }
  }

  .acoes-sugestao-container {
    display: flex;
    gap: 8px;
    .btn-sugestao {
      flex: 1; height: 40px; border-radius: 10px; border: none; font-weight: 800; font-size: 10px; cursor: pointer;
      transition: transform 0.1s;
      &:active { transform: scale(0.95); }
      &.exato { background: #1b5e20; color: #64ff8a; }
      &.arredondar { background: #0d47a1; color: #64b5f6; }
    }
  }

  /* --- GRADE DE VALORES (MOEDAS E NOTAS) --- */
  .grade-cedulas {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    gap: 6px;
  }

  .btn-cedula-rapida {
    height: 38px;
    background: #1a1a1a;
    border: 1px solid #252525;
    border-radius: 8px;
    color: #888;
    font-weight: 800;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover { background: #333; border-color: #4caf50; color: #64ff8a; }
    &:active { transform: scale(0.92); }

    &.limpar {
      grid-column: 1 / -1;
      background: #2a1a1a;
      color: #ff5252;
      border-color: #4a2121;
      font-size: 9px;
      margin-top: 4px;
      &:hover { background: #ff5252; color: #fff; }
    }
  }

  /* --- MISTO PADRONIZADO --- */
  .card-pagamento-misto { height: 100%; width: 100%; }
  
  .cabecalho-misto-moderno { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 10px; 
    h4 { color: #888; font-size: 11px; margin: 0; } 
  }
  
  .btn-adicionar-metodo-misto { 
    background: #4caf50; 
    color: #000; 
    border: none; 
    padding: 5px 12px; 
    border-radius: 8px; 
    font-size: 10px; 
    font-weight: 900; 
    cursor: pointer; 
    &:active { transform: scale(0.95); }
  }

  .lista-itens-mistos {
    flex: 1; 
    overflow-y: auto; 
    display: flex; 
    flex-direction: column; 
    gap: 8px;
    max-height: 280px;
    padding-right: 4px;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
  }

  .item-misto-card {
    background: #1a1a1a; 
    border-radius: 12px; 
    padding: 10px; 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    border: 1px solid #282828;

    .select-moderno { 
      flex: 1; 
      background: #121212; 
      border: 1px solid #333; 
      color: #fff; 
      padding: 8px; 
      border-radius: 10px; 
      font-size: 11px; 
      outline: none;
      &:focus { border-color: #4caf50; }
    }

    .seletor-valor-pill.pequeno { 
      height: 38px; 
      width: 120px; 
      .btn-ajuste-p { width: 30px; height: 30px; font-size: 16px; } 
      input { font-size: 13px; } 
    }

    .btn-remover-misto { 
      background: transparent; 
      border: none; 
      color: #444; 
      cursor: pointer; 
      font-size: 16px; 
      transition: color 0.2s;
      &:hover { color: #ff5252; }
    }
  }

  .resumo-misto-moderno {
    padding-top: 12px; 
    border-top: 1px solid #222;
    margin-top: 10px;
    .linha-resumo-mista { 
      display: flex; 
      justify-content: space-between; 
      font-size: 12px; 
      color: #888; 
      margin-bottom: 5px;
      strong { color: #fff; }
      .completo { color: #64ff8a; font-weight: bold; }
      .pendente { color: #ff5252; font-weight: bold; }
    }
  }

  .status-metodo-simples {
    text-align: center; margin: auto;
    p { color: #888; font-size: 13px; margin-bottom: 10px; }
    h2 { font-size: 32px; font-weight: 800; color: #fff; }
  }
`;