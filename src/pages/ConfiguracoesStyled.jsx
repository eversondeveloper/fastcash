import styled from 'styled-components';

export const ConfiguracoesStyled = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    color: #BACBD9;
    text-align: center;
    margin-bottom: 30px;
  }

  .abas {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    border-bottom: 1px solid #444;
    padding-bottom: 10px;

    .aba {
      padding: 10px 20px;
      background: transparent;
      border: 1px solid #555;
      color: #BACBD9;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #333;
      }

      &.ativa {
        background: #007bff;
        border-color: #007bff;
        color: white;
      }
    }
  }

  .conteudo-aba {
    background: #2d2d2d;
    border-radius: 8px;
    padding: 20px;
  }

  h2 {
    color: #BACBD9;
    margin-bottom: 20px;
    border-bottom: 2px solid #444;
    padding-bottom: 10px;
  }

  h3 {
    color: #BACBD9;
    margin-bottom: 15px;
  }

  .formulario-cadastro {
    background: #333;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;

    .grid-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;

      .span-2 {
        grid-column: span 2;
      }
    }

    .form-simples {
      display: flex;
      gap: 15px;
      align-items: center;
      margin-bottom: 20px;
    }
  }

  input, select {
    padding: 10px;
    background: #1e1e1e;
    border: 1px solid #555;
    border-radius: 4px;
    color: #BACBD9;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #BACBD9;
    cursor: pointer;

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }
  }

  .botao-cadastrar {
    padding: 10px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;

    &:hover {
      background: #218838;
    }
  }

  .sem-dados {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 20px;
  }

  .tabela-empresas,
  .tabela-vendedores {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .item-empresa,
  .item-vendedor {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #333;
    border-radius: 4px;
    border: 1px solid #444;
  }

  .info-empresa,
  .info-vendedor {
    display: flex;
    flex-direction: column;
    gap: 5px;

    strong {
      color: #BACBD9;
      font-size: 16px;
    }

    span {
      color: #888;
      font-size: 14px;
    }
  }

  .status {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;

    &.ativo {
      background: #28a745;
      color: white;
    }

    &.inativo {
      background: #6c757d;
      color: white;
    }
  }

  .botao-deletar {
    padding: 8px 15px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      background: #c82333;
    }
  }
`;