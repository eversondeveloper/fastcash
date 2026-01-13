// components/SecaoFiltros.jsx
import React from 'react';

export const SecaoFiltros = ({
  filtroDataInicio,
  setFiltroDataInicio,
  filtroDataFim,
  setFiltroDataFim,
  filtroMetodosPagamento,
  toggleMetodoPagamento,
  limparFiltros,
  limparFiltrosMetodos,
  METODOS_PAGAMENTO,
}) => {
  return (
    <div className="secao-filtros">
      <div className="filtro-datas">
        <div className="input-group">
          <label>Data Início:</label>
          <input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Data Fim:</label>
          <input
            type="date"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
          />
        </div>
      </div>

      <div className="filtro-metodos">
        <div className="metodos-header">
          <label>Métodos de Pagamento:</label>
          {filtroMetodosPagamento.length > 0 && (
            <button onClick={limparFiltrosMetodos} className="btn-limpar-metodos">
              Limpar Métodos
            </button>
          )}
        </div>
        <div className="botoes-metodos">
          {METODOS_PAGAMENTO.map((metodo) => (
            <button
              key={metodo}
              type="button"
              onClick={() => toggleMetodoPagamento(metodo)}
              className={`btn-metodo ${filtroMetodosPagamento.includes(metodo) ? 'ativo' : ''}`}
            >
              {metodo}
            </button>
          ))}
        </div>
      </div>

      <div className="acoes-filtros">
        <button onClick={limparFiltros} className="btn-limpar-todos">
          Limpar Todos os Filtros
        </button>
      </div>
    </div>
  );
};