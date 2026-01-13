import styled from 'styled-components';

// Paleta Minimalista:
// Primário/Fundo: #1e1e1e
// Secundário/Card: #2d2d2d
// Texto Principal: #E0E0E0
// Destaque (Sucesso/Total): #64ff8a
// Destaque (Ação/Primário): #FF9800
// Destaque (Info/PDF): #2196F3

export const GerarCupomStyled = styled.div`
  margin: 20px auto;
  padding: 25px;
  background-color: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  color: #E0E0E0;
  width: 98%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;

  h1 {
    color: #E0E0E0;
    font-size: 32px;
    font-weight: 300; /* Leve para minimalismo */
    margin-bottom: 30px;
    text-align: center;
  }
`;

export const ControlesSelecao = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px; /* Mais espaçamento */
  width: 100%;
  padding: 25px;
  background-color: #2d2d2d; /* Fundo do card */
  border-radius: 10px;
  margin-bottom: 30px;
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
    color: #E0E0E0;
    margin-bottom: 8px;
    font-weight: 300;
    font-size: 14px;
  }

  /* Estilo do SELECT (Dropdown) */
  select {
    padding: 12px;
    background-color: #1e1e1e;
    color: #ffffff;
    border: 1px solid #444;
    border-radius: 6px;
    font-size: 14px;
    appearance: none;
    /* Imagem SVG adaptada para o fundo escuro */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23E0E0E0' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 8px 10px;
    
    &:focus {
      border-color: #FF9800;
      outline: none;
    }
  }

  /* Formulário de Cadastro de Empresa */
  .formulario-empresa {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    padding: 20px; /* Mais padding */
    border: 1px solid #444;
    border-radius: 8px;
    background-color: #262626; /* Fundo levemente mais claro */
  }

  .input-form {
    padding: 10px;
    background-color: #1e1e1e;
    color: #E0E0E0;
    border: 1px solid #444;
    border-radius: 5px;
    font-size: 14px;

    &::placeholder {
      color: #A0A0A0;
    }

    &:focus {
      border-color: #FF9800;
      outline: none;
    }
  }

  .container-botoes-form {
    grid-column: span 2;
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 10px;
  }

  .botao-form {
    padding: 10px 18px; /* Padding maior */
    color: #1e1e1e;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
  }

  .enviar-form {
    background-color: #64ff8a; /* Verde Sucesso */
    color: #1e1e1e;
    &:hover {
      background-color: #4CAF50;
    }
  }

  .cancelar-form {
    background-color: #444;
    color: #E0E0E0;
    &:hover {
      background-color: #555;
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
  /* Estilo Cupom: Mantido, mas ajustado para melhor contraste */
  border: none; /* Borda removida, confiando na sombra */
  padding: 30px 20px;
  background-color: #f8f8f8; /* Mantido para simular papel (contraste com o fundo #1e1e1e) */
  color: #000;
  width: 320px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  font-family: "Courier New", Courier, monospace;
  font-size: 11px;
  line-height: 1.4;

  h3 {
    text-align: center;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 700;
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

    th {
      text-align: left;
      border-bottom: 1px solid #000;
    }
  }

  .cupom-totais {
    border-top: 1px dashed #000;
    margin-top: 20px;
    padding-top: 10px;

    .total-bruto {
      font-weight: bold;
      font-size: 14px; /* Levemente menor */
    }

    .valor-troco {
      font-weight: bold;
      color: #E53935; /* Vermelho/Erro */
    }
  }
`;