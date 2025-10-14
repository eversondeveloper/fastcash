import { useState } from "react";
import React from "react";
import { ButtonStyled } from "./ButtonStyled";

const BotaoProduto = (props) => {
  const [corPadrao, setCorPadrao] = useState("#262626");
  const corSelecionado = "#1e1e1e";

  const [corBotao, setCorBotao] = useState(corPadrao);

  React.useEffect(() => {
    if (props.$texto === "Impressão") {
      setCorPadrao("#004D40");
    } else if (props.$texto === "Cópia") {
      setCorPadrao("#1A237E");
    } else if (props.$texto === "Revelação") {
      setCorPadrao("#33691E");
    } else if (props.$texto === "Scan") {
      setCorPadrao("#B71C1C");
    } else if (props.$texto === "Encadernação") {
      setCorPadrao("#4A148C");
    } else if (props.$texto === "Apostila Color") {
      setCorPadrao("#1B5E20");
    } else if (props.$texto === "Documento") {
      setCorPadrao("#3E2723");
    } else if (props.$texto === "Papelaria") {
      setCorPadrao("#E65100");
    } else if (props.$texto === "Serviço") {
      setCorPadrao("#006064");
    } else {
      setCorPadrao("#212121");
    }
  }, [props.$texto]);

  const estaSelecionado = props.$produtosSelecionados.some(
    (produto) => produto.id_produto === props.$id
  );

  React.useEffect(() => {
    setCorBotao(estaSelecionado ? corSelecionado : corPadrao);
  }, [estaSelecionado, corPadrao]);

  return (
    <ButtonStyled
      $background={corBotao}
      $corTexto={props.$corTexto}
      onClick={() => {
        props.$btnClick();
      }}
      onMouseEnter={() => {
        props.$btnHover();
      }}
    >
      <div className="numbutton">{props.$index}</div>
      <p>
        <strong>{props.$texto}</strong> <br /> {props.$descricao.toUpperCase()}
      </p>
    </ButtonStyled>
  );
};

const comparadorDeProps = (propsAnteriores, proximaProps) => {
  const estavaSelecionadoAntes = propsAnteriores.$produtosSelecionados.some(
    (p) => p.id_produto === propsAnteriores.$id
  );
  const estaSelecionadoAgora = proximaProps.$produtosSelecionados.some(
    (p) => p.id_produto === proximaProps.$id
  );

  const statusSelecaoMudou = estavaSelecionadoAntes !== estaSelecionadoAgora;

  const propsEstaticasIguais =
    propsAnteriores.$id === proximaProps.$id &&
    propsAnteriores.$index === proximaProps.$index &&
    propsAnteriores.$texto === proximaProps.$texto &&
    propsAnteriores.$descricao === proximaProps.$descricao &&
    propsAnteriores.$corTexto === proximaProps.$corTexto;

  return propsEstaticasIguais && !statusSelecaoMudou;
};

export default React.memo(BotaoProduto, comparadorDeProps);
