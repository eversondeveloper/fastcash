import styled from "styled-components";

export const CupomStyled = styled.div`
  margin: 30px auto;
  padding: 30px;
  background-color: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.8);
  color: #f0f0f0;
  width: 98%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;

  h1 {
    color: #282a5f;
    font-size: 32px;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 600;
  }
`;

export const ControlesSelecao = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 25px;
  background-color: #262626;
  border-radius: 10px;
  margin-bottom: 40px;
  border: 1px solid #333;

  .linha-selecao {
    display: flex;
    gap: 30px;
    justify-content: center;
    align-items: flex-start;
    padding-top: 10px;
  }

  .select-grupo {
    display: flex;
    flex-direction: column;
    min-width: 320px;
  }

  label {
    color: #f0f0f0;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 15px;
  }

  select {
    padding: 12px;
    background-color: #1a1a1a;
    color: #ffffff;
    border: 1px solid #444;
    border-radius: 6px;
    font-size: 16px;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23ccc' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 8px 10px;
  }

  .formulario-empresa {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    padding: 15px;
    border: 1px solid #555;
    border-radius: 5px;
    background-color: #1a1a1a;
  }

  .input-form {
    padding: 10px;
    background-color: #262626;
    color: #f0f0f0;
    border: 1px solid #444;
    border-radius: 5px;
    font-size: 14px;

    &::placeholder {
      color: #888;
    }
  }

  .container-botoes-form {
    grid-column: span 2;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 5px;
  }

  .botao-form {
    padding: 8px 15px;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .enviar-form {
    background-color: #007bff;
    &:hover {
      background-color: #0056b3;
    }
  }

  .cancelar-form {
    background-color: #6c757d;
    &:hover {
      background-color: #5a6268;
    }
  }
`;

export const CupomVisualizacaoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
`;

export const CupomFiscal = styled.div`
  border: 1px solid #eee;
  padding: 30px 20px;
  background-color: #f8f8f8;
  color: #000;
  width: 320px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  font-family: "Courier New", Courier, monospace;
  font-size: 11px;
  line-height: 1.4;

  h3 {
    text-align: center;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
  }

  p {
    margin: 4px 0;
  }

  .cupom-info-cabecalho {
    text-align: center;
    margin-bottom: 20px;
    font-size: 10px;
    border-bottom: 1px dashed #000;
    padding-bottom: 10px;
  }

  .cupom-detalhes {
    border-top: 1px dashed #000;
    border-bottom: 1px dashed #000;
    padding: 10px 0;
    margin-bottom: 15px;
  }

  .cupom-tabela {
    width: 100%;
    border-collapse: collapse;
    font-size: 10px;

    th,
    td {
      padding: 2px 0;
    }

    th {
      text-align: left;
      border-bottom: 1px solid #000;
    }

    .coluna-total {
      text-align: right;
      width: 70px;
    }
  }

  .cupom-totais {
    border-top: 1px dashed #000;
    margin-top: 20px;
    padding-top: 10px;

    p {
      display: flex;
      justify-content: space-between;
    }

    .total-bruto {
      font-weight: bold;
      font-size: 16px;
    }

    .valor-troco {
      font-weight: bold;
      color: #d32f2f;
    }
  }
`;
