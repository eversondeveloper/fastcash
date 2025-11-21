import styled from "styled-components";

export const AppStyled = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  header {
    width: 100%;
    height: 6%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logomenu {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo{
    text-transform: uppercase;
    font-size: 17px;
    text-transform: uppercase;
    font-weight: bold;
    text-decoration: none;
    color: #ff9500;
  }

  .menu-links{
    display: flex;
    gap: 20px;
    color: white;
  }
  
  .menu-links a {
    font-size: 15px;
    text-decoration: none;
  }

  main {
    width: 100vw;
    height: 88%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .container {
    border: solid;
    width: 90%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }

  .buttons {
    width: 58%;
    height: 100%;
    display: flex;
    gap: 2%;
    border: solid 1px #3b3b3b;
    box-shadow: inset 0 0 10px #0000004e;
    padding: 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;
    overflow: auto;
  }
  .buttons2 {
    display: flex;
    gap: 2%;
    padding: 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    overflow: visible;
    border-radius: 10px;
    width: 100%;
  }
  
  .buttons-catalogo{
    width: 100%;
    display: flex;
    gap: 2%; 
    padding: 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: start;
  }

  .controles {
    width: 40%;
    height: 100%;
    border: solid 1px #3b3b3b;
    margin-left: 10px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }

  h1 {
    color: white;
    font-size: 20px;
    width: 100%;
    text-align: center;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .prods {
    width: 100%;
    height: 25%;
    padding: 5px;
    box-sizing: border-box;
    border-bottom: solid 1px #3b3b3b;
    overflow-y: auto;
  }

  .relacaoprodutos {
    width: 100%;
    height: 40px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 5px;
  }

  .quantidade {
    width: 40px;
    margin-left: 10px;
    color: #3b3b3b;
    font-weight: bold;
    text-align: center;
  }

  .valorrecebido {
    color: #3b3b3b;
    font-weight: bold;
    text-align: center;
  }

  .pagamento {
    height: 75%;
    width: 100%;
    padding-top: 10px;
    }

  .metodos-pagamento-container {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    margin-bottom: 15px;
  }

  .metodo-btn {
    flex-grow: 1;
    padding: 5px 5px;
    background-color: #3b3b3b; /* Cor de fundo padrão (não selecionado) */
    color: #bacbd9;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s, color 0.2s;
  }

  .metodo-btn:hover {
    background-color: #555555;
  }

  .metodo-btn.selecionado {
    background-color: #646cff; /* Cor de destaque (selecionado) */
    color: white;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(100, 108, 255, 0.5);
  }

  .pagamento-misto-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }

  .input-grupo {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .input-grupo label {
    margin-bottom: 5px;
    font-size: 14px;
  }

  .metodo-secundario-select {
    padding: 8px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid #3b3b3b;
    background-color: #262626;
    color: #bacbd9;
    font-weight: bold;
  }

  .pagamento-misto-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }

  .input-grupo {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .input-grupo label {
    margin-bottom: 5px;
    font-size: 14px;
  }

  .metodo-secundario-select {
    padding: 8px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid #3b3b3b;
    background-color: #262626;
    color: #bacbd9;
    font-weight: bold;
  }

  .botao-finalizar-venda {
    width: 100%;
    padding: 15px;
    margin-top: 15px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #1b5e20;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .botao-finalizar-venda:hover:not(:disabled) {
    background-color: #2e7d32;
  }

  .botao-finalizar-venda:disabled {
    background-color: #555555;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .container-botoes-acao {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }

  .botao-finalizar-venda {
    flex-grow: 1;
    padding: 15px 10px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #1b5e20;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .botao-finalizar-venda:hover:not(:disabled) {
    background-color: #2e7d32;
  }

  .botao-finalizar-venda:disabled {
    background-color: #555555;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .botao-cancelar-venda {
    flex-grow: 1;
    padding: 15px 10px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #d32f2f;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .botao-cancelar-venda:hover {
    background-color: #c62828;
  }

  footer {
    width: 100%;
    height: 6%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
