import { useEffect, useState } from "react";
import { ButtonStyled } from "./ButtonStyled";

export default function Button(props) {
  const [corPadrao, setCorPadrao] = useState("#262626");
  const corSelecionado = "#7d0000";

  const [corBotao, setCorBotao] = useState(corPadrao);

  useEffect(() => {
    if (props.$texto == "Impressão") {
      setCorPadrao("#0901f3");
    } else if (props.$texto == "Cópia") {
      setCorPadrao("#b83f02");
    } else if (props.$texto == "Revelação") {
      setCorPadrao("#00700f");
    } else if (props.$texto) {
      setCorPadrao("#30005e")
    }
  }, [props.$texto]);

  useEffect(() => {
    const estaSelecionado = props.$produtosSelecionados.some(
      (produto) =>
        produto.categoria === props.$texto && produto.tipo === props.$tipo
    );

    setCorBotao(estaSelecionado ? corSelecionado : corPadrao);
  }, [props.$produtosSelecionados, props.$texto, props.$tipo, corPadrao]);

  return (
    <ButtonStyled
      $background={corBotao}
      $corTexto={props.$corTexto}
      onClick={props.$btnClick}
    >
      <div className="numbutton">{props.$index}</div>
      <p>
        {props.$texto} {props.$tipo.toUpperCase()}
      </p>
    </ButtonStyled>
  );
}
