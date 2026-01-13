import styled from "styled-components";

export const ProdutosSelecionadosStyled = styled.div`
  width: 32%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  border: 1px solid #222;
  border-radius: 16px;
  overflow: hidden;

  /* --- CABEÇALHO --- */
  .cabecalho-carrinho {
    padding: 15px;
    background: #1a1a1a;
    border-bottom: 1px solid #222;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .titulo-grupo {
      display: flex;
      align-items: center;
      gap: 12px;

      h2 {
        font-size: 14px;
        color: #888;
        letter-spacing: 1px;
        margin: 0;
        font-weight: 700;
      }
    }
  }

  .btn-limpar-carrinho {
    background: #2a1a1a;
    border: 1px solid #4a2121;
    color: #ff5252;
    font-size: 9px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { background: #ff5252; color: #fff; }
  }

  .contador-itens {
    background: #4caf50;
    color: #000;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 20px;
  }

  /* --- LISTA DE PRODUTOS --- */
  .lista-produtos-carrinho {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scroll-behavior: smooth;

    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
  }

  .carrinho-vazio-mensagem {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #444;
    padding: 40px 20px;
    
    .icone-vazio { font-size: 40px; margin-bottom: 10px; opacity: 0.2; }
    p { font-style: italic; margin: 0; }
  }

  /* --- CARD DO PRODUTO --- */
  .card-produto-selecionado {
    background-color: #1a1a1a;
    border: 1px solid #282828;
    border-radius: 12px;
    padding: 12px;
    transition: border-color 0.2s;
    &:hover { border-color: #333; }
  }

  .info-produto-topo {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .categoria-label {
    font-size: 9px;
    color: #4caf50;
    font-weight: 700;
    text-transform: uppercase;
  }

  .descricao-titulo {
    font-size: 13px;
    color: #eee;
    margin: 2px 0 0 0;
    font-weight: 500;
  }

  .btn-remover-item {
    background: transparent;
    border: none;
    color: #444;
    cursor: pointer;
    font-size: 16px;
    &:hover { color: #ff5252; }
  }

  /* --- CONTROLES (SEÇÃO BAIXA) --- */
  .controles-produto-baixo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #121212;
    padding: 10px;
    border-radius: 10px;
    gap: 10px;
  }

  .secao-quantidade-completa {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }

  .pill-seletor-quantidade {
    display: flex;
    align-items: center;
    background: #0a0a0a;
    border-radius: 20px;
    border: 1px solid #222;
    padding: 2px;
    max-width: 100px;

    button {
      background: transparent;
      border: none;
      color: #4caf50;
      font-weight: bold;
      cursor: pointer;
      width: 28px;
      height: 28px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover { color: #64ff8a; }
    }

    input {
      width: 100%;
      flex: 1;
      min-width: 0;
      background: transparent;
      border: none;
      color: #fff;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      outline: none;
    }
  }

  .atalhos-quantidade {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;

    button {
      background: #1a1a1a;
      border: 1px solid #252525;
      color: #888;
      font-size: 9px;
      font-weight: 800;
      padding: 5px 2px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.1s;
      
      &:hover { 
        background: #333; 
        color: #64ff8a; 
        border-color: #4caf50; 
      }
      
      &:active {
        transform: scale(0.92);
        background: #4caf50;
        color: #000;
        border-color: #64ff8a;
      }
    }
  }

  .precos-item-container { 
    text-align: right; 
    min-width: fit-content;
  }
  
  .unitario-label { font-size: 10px; color: #555; display: block; }
  .subtotal-item { font-size: 14px; color: #64ff8a; font-weight: bold; }

  /* --- RODAPÉ --- */
  .rodape-carrinho {
    padding: 15px;
    background: #1a1a1a;
    border-top: 1px solid #222;
  }

  .linha-total-geral {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    span { color: #888; font-size: 12px; font-weight: bold; }
    strong { color: #fff; font-size: 20px; font-weight: 800; }
  }

  .btn-acao-orcamento {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: #4caf50;
    color: #000;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { background: #64ff8a; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2); }
    &:active { transform: scale(0.98); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  /* --- MODAL --- */
  .modal-overlay-moderno {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
  }

  .modal-conteudo-moderno {
    background: #121212;
    border: 1px solid #333;
    border-radius: 24px;
    width: 90%;
    max-width: 450px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }

  .modal-cabecalho-moderno {
    padding: 20px;
    background: #1a1a1a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #222;
    
    .titulo-modal {
      display: flex;
      align-items: center;
      gap: 10px;
      .icone-modal { font-size: 20px; }
      h3 { margin: 0; font-size: 16px; color: #fff; letter-spacing: 0.5px; }
    }
  }

  .btn-fechar-x { background: transparent; border: none; color: #555; cursor: pointer; font-size: 20px; &:hover { color: #ff5252; } }

  .modal-corpo-moderno {
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .grid-campos {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .campo-entrada {
    display: flex;
    flex-direction: column;
    gap: 8px;
    label { font-size: 10px; color: #4caf50; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    input {
      padding: 14px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 12px;
      color: #fff;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      &:focus { border-color: #4caf50; background: #222; }
    }
  }

  .resumo-total-modal {
    padding: 20px;
    background: #1a1a1a;
    border-radius: 16px;
    border: 1px solid #222;
    text-align: center;
    
    .info-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      span { color: #888; font-size: 12px; font-weight: 600; }
      strong { color: #64ff8a; font-size: 24px; font-weight: 800; }
    }
    
    .dica-validade { font-size: 10px; color: #444; margin: 0; }
  }

  .modal-rodape-moderno {
    padding: 20px;
    background: #1a1a1a;
    display: flex;
    gap: 12px;
    button {
      flex: 1;
      padding: 14px;
      border-radius: 12px;
      border: none;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
  }

  .btn-voltar-modal { background: #2a2a2a; color: #888; &:hover { background: #333; color: #fff; } }
  .btn-confirmar-pdf { background: #4caf50; color: #000; &:hover { background: #64ff8a; } }
`;