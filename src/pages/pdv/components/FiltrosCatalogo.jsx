// components/Vendas/FiltrosCatalogo.jsx
import { useRef, useEffect } from "react";
import { FiltrosCatalogoStyled } from "./FiltrosCatalogoStyled";

const FiltrosCatalogo = ({
  filtroBusca = "",
  setFiltroBusca,
  filtrosExpandidos,
  setFiltrosExpandidos,
  categoriasUnicas = [],
  filtroCategoriasSelecionadas = [],
  toggleCategoriaFiltro,
  filtroTipoItem = "Todos",
  setFiltroTipoItem,
  temFiltrosAtivos,
  limparFiltros,
  inputFiltroBuscaRef,
}) => {
  const containerFiltrosRef = useRef(null);

  // Inteligência de Foco: Abre o painel e foca no input automaticamente
  useEffect(() => {
    if (filtrosExpandidos) {
      const timer = setTimeout(() => {
        inputFiltroBuscaRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [filtrosExpandidos, inputFiltroBuscaRef]);

  const classeEstado = filtrosExpandidos ? "expandido" : "recolhido";

  return (
    <FiltrosCatalogoStyled
      ref={containerFiltrosRef}
      className={`container-filtros-pdv ${classeEstado}`}
      onMouseEnter={() => setFiltrosExpandidos(true)}
      onMouseLeave={() => setFiltrosExpandidos(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          inputFiltroBuscaRef.current?.focus();
        }
      }}
    >
      <div className="cabecalho-filtros">
        <div className="titulo-wrapper">
          <span className="icone-busca">🔍</span>
          <h3 className="titulo-filtros">BUSCAR NO CATÁLOGO</h3>
        </div>

        {!filtrosExpandidos ? (
          // Classe dinâmica para mudar a cor da badge se houver filtros ativos
          <div className={`badge-status ${temFiltrosAtivos ? "ativo" : ""}`}>
            {temFiltrosAtivos ? "FILTROS ATIVOS" : "PASSE O MOUSE"}
          </div>
        ) : (
          <span className="seta-expansao">▼</span>
        )}
      </div>

      <div className="conteudo-filtros-animado">
        <div className="grupo-busca-principal" style={{ position: 'relative' }}>
          <input
            ref={inputFiltroBuscaRef}
            type="text"
            placeholder="Nome, categoria ou código... [ESPAÇO]"
            className="input-filtro-busca"
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
          />
          {/* Botão para limpar o texto da busca rapidamente */}
          {filtroBusca && (
            <button 
              type="button"
              className="btn-limpar-input-interno"
              onClick={() => {
                setFiltroBusca("");
                inputFiltroBuscaRef.current?.focus();
              }}
            >✕</button>
          )}
        </div>

        <div className="secao-filtros-botoes">
          <div className="bloco-filtro">
            <label className="label-filtros">CATEGORIAS</label>
            <div className="lista-pills">
              {categoriasUnicas.length > 0 ? (
                categoriasUnicas.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`pill-filtro ${filtroCategoriasSelecionadas.includes(cat) ? "ativo" : ""}`}
                    onClick={() => toggleCategoriaFiltro(cat)}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))
              ) : (
                <span className="msg-vazia">Nenhuma categoria encontrada</span>
              )}
            </div>
          </div>

          <div className="bloco-filtro">
            <label className="label-filtros">TIPO DE ITEM</label>
            <div className="lista-pills">
              {["Todos", "Produto", "Serviço"].map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  className={`pill-filtro ${filtroTipoItem === tipo ? "ativo" : ""}`}
                  onClick={() => setFiltroTipoItem(tipo)}
                >
                  {tipo.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {temFiltrosAtivos && (
          <button
            type="button"
            className="btn-limpar-filtros-moderno"
            onClick={limparFiltros}
          >
            LIMPAR TODOS OS FILTROS
          </button>
        )}
      </div>
    </FiltrosCatalogoStyled>
  );
};

export default FiltrosCatalogo;