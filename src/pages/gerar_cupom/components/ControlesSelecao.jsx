import React from 'react';
import { ControlesSelecao } from "../GerarCupomStyled"; 

const ControlesSelecaoComponent = ({
  empresas,
  empresaSelecionada, 
  vendas,
  vendaSelecionada,
  handleVendaChange,
  formatarMoeda
}) => {
  const possuiEmpresa = empresas.length > 0;
  
  return (
    <ControlesSelecao>
      <h2>Seleção de Dados para Comprovante</h2>
      
      <div className="linha-selecao">
        {/* Grupo de Exibição da Empresa (Apenas Leitura) */}
        <div className="select-grupo">
          <label>Empresa Emissora:</label>
          <div style={{ display: "flex", gap: "10px", alignItems: 'center' }}>
            {possuiEmpresa ? (
              <div style={{ 
                flexGrow: 1, 
                padding: '12px', 
                backgroundColor: '#1e1e1e', 
                borderRadius: '6px', 
                border: '1px solid #444', 
                color: '#64ff8a',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {empresaSelecionada?.nome_fantasia || empresaSelecionada?.razao_social}
                <span style={{ fontSize: '10px', color: '#888', marginLeft: '10px' }}>
                  (CNPJ: {empresaSelecionada?.cnpj})
                </span>
              </div>
            ) : (
              <span style={{ color: '#FF9800', fontWeight: 'bold' }}>
                ⚠️ Nenhuma empresa configurada no sistema.
              </span>
            )}
          </div>
        </div>

        {/* Grupo de Seleção da Venda */}
        <div className="select-grupo">
          <label>Selecionar Venda:</label>
          <select
            value={vendaSelecionada?.id_venda || ""}
            onChange={(e) => handleVendaChange(e.target.value)}
            disabled={vendas.length === 0}
            style={{ padding: '10px', cursor: vendas.length > 0 ? 'pointer' : 'not-allowed' }}
          >
            {vendas.length === 0 ? (
              <option value="">Nenhuma venda encontrada</option>
            ) : (
              vendas.map((venda) => (
                <option key={venda.id_venda} value={venda.id_venda}>
                  ID: {venda.id_venda} — Total: R$ {formatarMoeda(venda.valor_total_bruto)}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </ControlesSelecao>
  );
};

export default ControlesSelecaoComponent;