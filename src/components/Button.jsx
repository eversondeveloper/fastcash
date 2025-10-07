import { useEffect, useState } from "react";
import { ButtonStyled } from "./ButtonStyled";

export default function Button(props) {
  const corbtn = "#b4b4b4";
  const [clicado, setClicado] = useState(false);
  const [corBotao, setCorBotao] = useState("#00ff94");

  useEffect(() => {
    props.$produtosSelecionados.filter((produto) => {
      if (produto.categoria === props.$texto && produto.tipo === props.$tipo) {
        setCorBotao("#00ff94");
      } else {
        setClicado(false);
        setCorBotao("#b4b4b4");
      }
      return null;
    });
  }, [props.$texto, props.$tipo]);

  return (
    <ButtonStyled
      $background={clicado ? corBotao : corbtn}
      $corTexto={props.$corTexto}
      onClick={() => {
        props.$btnClick();
        setClicado(true)
      }}
      {...props}
    >
      <div className="numbutton">{props.$index}</div>
      <p>
        {props.$texto} {props.$tipo.toUpperCase()}
      </p>
      
    </ButtonStyled>
  );
}
