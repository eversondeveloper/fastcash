import { useState } from "react";
import React from "react";
import { ButtonStyled } from "./ButtonStyled";
import clickSound from "/sounds/selecionar.mp3";

const BotaoProduto = (props) => {
    const [corPadrao, setCorPadrao] = useState("#262626");
    const corSelecionado = "#262626";

    const [corBotao, setCorBotao] = useState(corPadrao);

    const click = () => {
        const clickSom = new Audio(clickSound);
        clickSom.currentTime = 0;
        clickSom.volume = 1.0;
        clickSom.play();
    };

    React.useEffect(() => {
        if (props.$texto === "Impressão") {
            setCorPadrao("#006064");
        } else if (props.$texto === "Cópia") {
            setCorPadrao("#0d47a1");
        } else if (props.$texto === "Revelação") {
            setCorPadrao("#1b5e20");
        } else if (props.$texto === "Scan") {
            setCorPadrao("#e65100");
        } else if (props.$texto === "Encadernação") {
            setCorPadrao("#4a148c");
        } else if (props.$texto === "Apostila Color") {
            setCorPadrao("#311b92");
        } else if (props.$texto === "Documento") {
            setCorPadrao("#b71c1c");
        } else if (props.$texto === "Papelaria") {
            setCorPadrao("#f57f17");
        } else if (props.$texto === "Serviço") {
            setCorPadrao("#3e2723");
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
                click();
                props.$btnClick();
            }}
        >
            <div className="numbutton">{props.$index}</div>
            <p>
                {props.$texto} {props.$descricao.toUpperCase()}
            </p>
        </ButtonStyled>
    );
};

const comparadorDeProps = (propsAnteriores, proximaProps) => {
    const estavaSelecionadoAntes = propsAnteriores.$produtosSelecionados.some(p => p.id_produto === propsAnteriores.$id);
    const estaSelecionadoAgora = proximaProps.$produtosSelecionados.some(p => p.id_produto === proximaProps.$id);

    const statusSelecaoMudou = estavaSelecionadoAntes !== estaSelecionadoAgora;
    
    const propsEstaticasIguais = (
        propsAnteriores.$id === proximaProps.$id &&
        propsAnteriores.$index === proximaProps.$index &&
        propsAnteriores.$texto === proximaProps.$texto &&
        propsAnteriores.$descricao === proximaProps.$descricao &&
        propsAnteriores.$corTexto === proximaProps.$corTexto
    );


    return propsEstaticasIguais && !statusSelecaoMudou;
};


export default React.memo(BotaoProduto, comparadorDeProps);