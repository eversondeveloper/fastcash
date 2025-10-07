import styled from "styled-components";

export const AppStyled = styled.div`
  width: 100vw;
  height: 100vh;

  header {
    width: 100%;
    height: 10%;
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

  .logomenu a {
    text-decoration: none;
    color: white;
    font-weight: bold;
    font-size: 24px;
    text-transform: uppercase;
  }

  main {
    width: 100vw;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    width: 90%;
    height: 100%;
    display: flex;
  }

  .buttons {
    width: 68%;
    height: 100%;
    display: flex;
    gap: 2px;
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
    gap: 2px;
    padding: 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    overflow: visible;
    border-radius: 10px;
    width: 100%;
  }

  .controles {
    width: 30%;
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
    height: 60%;
    padding: 5px;
    box-sizing: border-box;
    border-bottom: solid 1px #3b3b3b;
    overflow: auto;
  }

  .relacaoprodutos {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px #3b3b3b;
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
    height: 35%;
    width: 100%;
    bottom: 10px;
    left: 0;
    padding: 10px;
  }

  footer {
    width: 100%;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
