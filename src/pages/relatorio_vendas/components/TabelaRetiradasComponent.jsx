// components/TabelaRetiradasComponent.jsx
import React from 'react';
import { TabelaVendas } from "../RelatoriosStyled";

export const TabelaRetiradasComponent = ({
  retiradasFiltradas,
  filtroDataInicio,
  filtroDataFim,
  onEditarRetirada,
  onDeletarRetirada,
}) => {
    
  const formatarDataHora = (dataString) => {
      if (!dataString) return '-';
      try {
          const data = new Date(dataString);
          return data.toLocaleString("pt-BR", {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false 
          });
      } catch (error) {
          return 'Data Inválida';
      }
  };

  return (
    <div style={{ marginTop: "40px", width: "100%" }}>
      <h2>
        Retiradas do Caixa{" "}
        {(filtroDataInicio || filtroDataFim) && (
          <span style={{ fontSize: '14px', color: '#888' }}>
            (Filtradas pelo mesmo período das vendas: {filtroDataInicio || 'Início'} 
            {filtroDataFim ? ` à ${filtroDataFim}` : ''})
          </span>
        )}
      </h2>
      {retiradasFiltradas.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
          {filtroDataInicio || filtroDataFim
            ? "Nenhuma retirada registrada no período filtrado."
            : "Nenhuma retirada registrada."}
        </p>
      ) : (
        <TabelaVendas>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Valor</th>
              <th>Motivo</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {retiradasFiltradas.map((retirada) => (
              <tr key={retirada.id_retirada}>
                <td>
                  {/* CORREÇÃO: Usa o campo data_retirada (que agora tem o timestamp completo) */}
                  {formatarDataHora(retirada.data_retirada)}
                </td>
                <td className="valor-retirada">
                  R$ {parseFloat(retirada.valor).toFixed(2).replace(".", ",")}
                </td>
                <td>{retirada.motivo}</td>
                <td>{retirada.observacao || "-"}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onEditarRetirada(retirada)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDeletarRetirada(retirada.id_retirada)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ff5252',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TabelaVendas>
      )}
    </div>
  );
};