import React from 'react';
import { TabelaVendas } from "../RelatoriosStyled";

export const TabelaVendasComponent = ({
  vendasFiltradas,
  quantidadeVendas,
  totalVendasBruto,
  onDeletarVenda,
  onEditarVenda,
}) => {
    
  // Função para formatar data e hora de forma legível
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

  // Função para extrair primeiro nome e formatar identificação
  const formatarIdentificacaoAtendente = (nome, cpf) => {
    if (!nome) return "Sistema";
    
    const primeiroNome = nome.split(' ')[0].toUpperCase();
    
    if (!cpf) return primeiroNome;

    const cpfLimpo = cpf.replace(/\D/g, '');
    const cpfFormatado = cpfLimpo.length === 11 
      ? `${cpfLimpo.substring(0, 3)}...${cpfLimpo.substring(9, 11)}` 
      : cpf;

    return `${primeiroNome} (${cpfFormatado})`;
  };

  return (
    <div style={{ marginTop: "40px", width: "100%" }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: "15px" 
      }}>
        <h2 style={{ margin: 0 }}>
          Vendas Realizadas ({quantidadeVendas})
        </h2>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#64ff8a',
          backgroundColor: '#1e1e1e',
          padding: '8px 15px',
          borderRadius: '6px',
          border: '1px solid #333'
        }}>
          Total Bruto: R$ {totalVendasBruto.toFixed(2).replace(".", ",")}
        </div>
      </div>

      {vendasFiltradas.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#888", backgroundColor: '#2d2d2d', borderRadius: '8px' }}>
          Nenhuma venda encontrada para o filtro aplicado.
        </p>
      ) : (
        <TabelaVendas>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Data/Hora</th>
              <th>Atendente (CPF)</th>
              <th>Detalhamento da Transação</th>
              <th style={{ textAlign: 'center', width: '180px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.map((venda) => (
              <tr key={venda.id_venda}>
                <td><small style={{ color: '#888' }}>#{venda.id_venda}</small></td>
                <td>
                  {formatarDataHora(venda.data_venda || venda.data_cadastro || venda.data_hora)}
                </td>
                
                <td style={{ fontWeight: '600', color: '#ff9800', fontSize: '13px' }}>
                  {formatarIdentificacaoAtendente(venda.nome_atendente, venda.cpf_atendente || venda.cpf)}
                </td>
                
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '220px' }}>
                    {/* Lista de Métodos de Entrada */}
                    {venda.pagamentos && Array.isArray(venda.pagamentos) && venda.pagamentos.map((p, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '2px 8px',
                        borderRadius: '3px'
                      }}>
                        <span style={{ color: '#aaa' }}>{p.metodo}:</span>
                        <span style={{ color: '#fff' }}>
                          R$ {parseFloat(p.valor_pago || p.valorPago || 0).toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    ))}

                    {/* Resumo Financeiro da Venda */}
                    <div style={{ 
                      marginTop: '4px', 
                      padding: '4px 8px', 
                      borderTop: '1px solid #444', 
                      fontSize: '12px',
                      background: 'rgba(100, 255, 138, 0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64ff8a' }}>
                        <span>Total Recebido:</span>
                        <strong>R$ {parseFloat(venda.valor_pago_total || 0).toFixed(2).replace(".", ",")}</strong>
                      </div>
                      
                      {parseFloat(venda.valor_troco) > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffb74d', marginTop: '2px' }}>
                          <span>Troco Devolvido:</span>
                          <span>R$ {parseFloat(venda.valor_troco).toFixed(2).replace(".", ",")}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', borderTop: '1px dashed #555', marginTop: '4px', paddingTop: '2px' }}>
                        <span>Valor Final Venda:</span>
                        <strong>R$ {parseFloat(venda.valor_total_bruto || 0).toFixed(2).replace(".", ",")}</strong>
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => onEditarVenda(venda)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDeletarVenda(venda.id_venda)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ff5252',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Excluir
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