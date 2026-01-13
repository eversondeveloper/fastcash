import React from 'react';

export const SecaoFiltrosAtendentes = ({
  filtroNome,
  setFiltroNome,
  filtroAtivo,
  setFiltroAtivo,
  onLimparFiltros
}) => {
  return (
    <div className="card secao-filtros">
      <div className="titulo-secao">
        🔍 Filtros
      </div>
      <p style={{ color: '#888', margin: '0 0 15px 0', fontSize: '14px' }}>
        Filtre os atendentes por nome e status
      </p>

      <div className="filtros-linha">
        {/* Filtro por Nome */}
        <div className="grupo-filtro">
          <div className="input-group">
            <label htmlFor="filtro-nome">Buscar por nome</label>
            <input
              id="filtro-nome"
              type="text"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              placeholder="Digite o nome do atendente..."
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237f8c8d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.3-4.3'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '12px center',
                backgroundSize: '16px',
                paddingLeft: '40px'
              }}
            />
          </div>
        </div>

        {/* Filtro por Status */}
        <div className="grupo-filtro">
          <div className="input-group">
            <label htmlFor="filtro-status">Status</label>
            <select
              id="filtro-status"
              value={filtroAtivo}
              onChange={(e) => setFiltroAtivo(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="ativos">Apenas ativos</option>
              <option value="inativos">Apenas inativos</option>
            </select>
          </div>
        </div>

        {/* Botão Limpar Filtros */}
        <div className="grupo-filtro" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            className="btn-secundario"
            onClick={onLimparFiltros}
            disabled={!filtroNome && filtroAtivo === 'todos'}
            style={{
              width: '100%',
              opacity: (!filtroNome && filtroAtivo === 'todos') ? 0.6 : 1
            }}
          >
            🗑️ Limpar Filtros
          </button>
        </div>
      </div>

      {/* Indicadores de Filtros Ativos */}
      {(filtroNome || filtroAtivo !== 'todos') && (
        <div style={{ 
          marginTop: '15px',
          padding: '10px 15px',
          backgroundColor: '#3b3b3b',
          border: '1px solid #FF9800',
          borderRadius: '6px',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: '#BACBD9' }}>Filtros ativos:</strong>
              {filtroNome && (
                <span style={{ marginLeft: '10px', color: '#FF9800' }}>
                  📝 Nome: "{filtroNome}"
                </span>
              )}
              {filtroAtivo !== 'todos' && (
                <span style={{ marginLeft: '10px', color: '#FF9800' }}>
                  {filtroAtivo === 'ativos' ? '✅ Ativos' : '❌ Inativos'}
                </span>
              )}
            </div>
            
            <button
              onClick={onLimparFiltros}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF9800',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textDecoration: 'underline'
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};