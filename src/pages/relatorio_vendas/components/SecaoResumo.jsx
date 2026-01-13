import React from 'react';

export const SecaoResumo = ({
  filtroDataInicio,
  filtroDataFim,
  filtroMetodosPagamento,
  quantidadeVendas,
  totalVendasBruto,
  totalValorPago,
  totalTroco,
  totalRetiradas,
  totalLiquido,
  totaisPorMetodo,
  dadosEmpresa,
}) => {
  const formatarData = (dataString) => {
    if (!dataString) return '';
    try {
      const data = new Date(dataString);
      return new Date(data.getTime() + data.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR');
    } catch {
      return dataString;
    }
  };

  const periodoTexto = (filtroDataInicio || filtroDataFim)
    ? `${formatarData(filtroDataInicio) || "Início"} ${filtroDataFim ? `à ${formatarData(filtroDataFim)}` : ''}`
    : "Todas as datas";

  const seguro = (valor) => parseFloat(valor || 0);

  return (
    <div className="secao-resumo">
      {dadosEmpresa && (
        <div className="cabecalho-empresa" style={{ marginBottom: '20px' }}>
          <h2 style={{ marginBottom: '5px', fontSize: '18px', color: '#4180B9' }}>
            {dadosEmpresa.nome_fantasia || dadosEmpresa.razao_social || "EMPRESA NÃO CADASTRADA"}
          </h2>
          <p style={{ fontSize: '12px', margin: '2px 0', color: '#888' }}>
            {dadosEmpresa.cnpj && `CNPJ: ${dadosEmpresa.cnpj} `}
            {dadosEmpresa.telefone && `| Tel: ${dadosEmpresa.telefone}`}
          </p>
          <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '15px 0 5px 0', borderTop: '1px solid #333', paddingTop: '10px' }}>
            RELATÓRIO FINANCEIRO DETALHADO
          </p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Período: {periodoTexto}
          </p>
        </div>
      )}
      
      <div className="resumo-superior">
        <div className="info-filtros">
          <div className="filtros-ativos">
            <strong>Filtros de Pagamento:</strong>
            {filtroMetodosPagamento.length > 0
              ? ` ${filtroMetodosPagamento.join(", ")}`
              : " Todos os métodos"}
          </div>
          <div style={{ marginTop: '5px' }}>
            Total de Vendas no Período: <span className="destaque">{quantidadeVendas}</span> registro(s)
          </div>
        </div>
      </div>

      <div className="resumo-financeiro" style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
        <div className="titulo-resumo" style={{ color: '#E0E0E0', marginBottom: '15px', fontWeight: 'bold' }}>
          Fluxo de Caixa do Período:
        </div>
        <div className="valores-resumo" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Vendas Brutas (+):</span>
            <span className="destaque" style={{ color: '#64ff8a', fontSize: '16px' }}>
              R$ {seguro(totalVendasBruto).toFixed(2).replace(".", ",")}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Trocos Devolvidos (-):</span>
            <span className="destaque-negativo" style={{ color: '#ff5252', fontSize: '16px' }}>
              R$ {seguro(totalTroco).toFixed(2).replace(".", ",")}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Sangrias/Retiradas (-):</span>
            <span className="destaque-negativo" style={{ color: '#ff5252', fontSize: '16px' }}>
              R$ {seguro(totalRetiradas).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #444', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '14px', color: '#E0E0E0', display: 'block' }}>Saldo Líquido Estimado em Caixa:</span>
            <span className={`destaque-liquido ${seguro(totalLiquido) >= 0 ? 'positivo' : 'negativo'}`} style={{ fontSize: '24px', fontWeight: 'bold' }}>
              R$ {seguro(totalLiquido).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      </div>

      <div className="totais-metodos" style={{ marginTop: '25px' }}>
        <div className="titulo-metodos" style={{ fontSize: '14px', marginBottom: '10px', color: '#aaa' }}>
          Totalização por Meio de Recebimento:
        </div>
        <div className="lista-metodos" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {Object.entries(totaisPorMetodo || {}).map(([metodo, total]) => {
            return (
              <div key={metodo} style={{ background: '#222', padding: '10px 15px', borderRadius: '5px', border: '1px solid #333' }}>
                <span style={{ fontSize: '12px', color: '#888', display: 'block' }}>{metodo}</span>
                <span className="destaque" style={{ fontWeight: 'bold' }}>
                  R$ {seguro(total).toFixed(2).replace(".", ",")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};