import { useEffect, useState } from "react";
import { ButtonStyled } from "./ButtonStyled";
import impressaoPbImage from "/impressao.png"
import copia from "/copia.png"
import revelacao from "/revelacao.png"
import scan from "/scan.png"

export default function Button(props) {

  const [imagem, setImagem] = useState("")
  const [corPadrao, setCorPadrao] = useState("#262626");
  const corSelecionado = "#3a3a3aff";

  const [corBotao, setCorBotao] = useState(corPadrao);

  useEffect(() => {
    if (props.$texto === "Impressão") {
      setCorPadrao("#0097a7");
    } else if (props.$texto === "Cópia") {
      setCorPadrao("#1976d2");
    } else if (props.$texto === "Revelação") {
      setCorPadrao("#388e3c");
    } else if (props.$texto === "Scan") {
      setCorPadrao("#f57c00");
    } else if (props.$texto === "Encadernação") {
      setCorPadrao("#7b1fa2");
    } else if (props.$texto === "Apostila Color") {
      setCorPadrao("#512da8");
    } else if (props.$texto === "Documento") {
      setCorPadrao("#d32f2f");
    } else if (props.$texto === "Papelaria") {
      setCorPadrao("#cc9d26ff");
    } else if (props.$texto === "Serviço") {
      setCorPadrao("#5d4037");
    } else {
      setCorPadrao("#4f4f4f");
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
      $backgroundImage={imagem}
    >
      <div className="numbutton">{props.$index}</div>
      <div className="textobotao">
        {props.$texto} {props.$tipo.toUpperCase()}
      </div>
    </ButtonStyled>
  );
}
