import { useState, useEffect, memo } from "react";
import { ButtonStyled } from "./ButtonStyled";
import imgFavorito from "/favorito.svg";

const CATEGORIA_CORES = {
  "Impressão": "#006064",    
  "Cópia": "#303F9F",        
  "Revelação": "#388E3C",    
  "Scan": "#B71C1C",         
  "Encadernação": "#512DA8",  
  "Papelaria": "#F57C00",     
  "Apostila Color": "#7CB342",
  "Documento": "#5D4037",     
  "Serviço": "#0097A7",       
  "Foto Produto": "#0D47A1",  
  "Plástico": "#455A64",      
  "Material": "#C2185B",      
};

const COR_PADRAO_DEFAULT = "#263238"; 
const COR_SELECIONADO = "#1e1e1e"; 
const LIMITE_MAIS_VENDIDO = 50; 

const getCorCategoria = (categoriaTexto) => {
    return CATEGORIA_CORES[categoriaTexto] || COR_PADRAO_DEFAULT;
};

const BotaoProduto = ({
  $index,
  $texto, 
  $descricao,
  $id,
  $corTexto,
  $btnClick,
  $produtosSelecionados,
  $preco,
  $totalVendido = 0,
  $estoqueAtual,
  $tipoItem,
  $btnHover 
}) => {
  
  const [corPadrao, setCorPadrao] = useState(() => getCorCategoria($texto));

  useEffect(() => {
    setCorPadrao(getCorCategoria($texto));
  }, [$texto]); 

  const estaSelecionado = $produtosSelecionados.some(
    (produto) => produto.id_produto === $id
  );

  const isMaisVendido = $totalVendido >= LIMITE_MAIS_VENDIDO;
  const isEstoqueBaixo = $tipoItem === 'Produto' && $estoqueAtual < 5;
  const isEsgotado = $tipoItem === 'Produto' && $estoqueAtual === 0;

  return (
    <ButtonStyled
      $background={estaSelecionado ? COR_SELECIONADO : corPadrao}
      $corTexto={$corTexto}
      $isEstoqueBaixo={isEstoqueBaixo} 
      $isEsgotado={isEsgotado}
      $selecionado={estaSelecionado}
      className={`card-produto ${estaSelecionado ? 'selecionado' : ''} ${isEsgotado ? 'esgotado' : ''}`}
      onClick={() => !isEsgotado && $btnClick()}
      onMouseEnter={() => $btnHover && $btnHover()}
    >
      <div className="badge-superior">
        <span className="indice">{$index}</span>
        {isMaisVendido && (
          <span className="tag-popular" title={`Top Vendas: ${$totalVendido} vendidos`}>
            <img src={imgFavorito} alt="Favorito" />
          </span>
        )}
      </div>
      
      <div className="conteudo-produto">
        <label className="categoria-label">{$texto}</label>
        <h4 className="descricao-titulo">{$descricao.toUpperCase()}</h4>
        <div className="preco-tag">
          <small>R$</small>
          <strong>{parseFloat($preco).toFixed(2).replace('.', ',')}</strong>
        </div>
      </div>

      {isEsgotado && (
          <div className="overlay-status esgotado">ESGOTADO</div>
      )}
      {isEstoqueBaixo && !isEsgotado && (
          <div className="tag-alerta-estoque" title={`Estoque Baixo: ${$estoqueAtual} restantes`}>
            ⚠️ BAIXO ESTOQUE
          </div>
      )}
      
    </ButtonStyled>
  );
};

const comparadorDeProps = (prev, next) => {
  const statusMudou = prev.$produtosSelecionados.some(p => p.id_produto === prev.$id) !== 
                      next.$produtosSelecionados.some(p => p.id_produto === next.$id);

  return !statusMudou &&
    prev.$id === next.$id &&
    prev.$index === next.$index &&
    prev.$texto === next.$texto &&
    prev.$descricao === next.$descricao &&
    prev.$preco === next.$preco && 
    prev.$totalVendido === next.$totalVendido && 
    prev.$estoqueAtual === next.$estoqueAtual;
};

export default memo(BotaoProduto, comparadorDeProps);