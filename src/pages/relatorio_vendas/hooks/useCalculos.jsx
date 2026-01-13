import { useMemo } from 'react';

export const useCalculos = (vendasFiltradas, retiradasFiltradas) => {
  const totaisCalculados = useMemo(() => {
    const tot = {};
    let trocoTotalDasVendas = 0;

    // 1. PROCESSAMENTO DAS VENDAS
    (vendasFiltradas || []).forEach((v) => {
      // Soma o troco total das vendas
      trocoTotalDasVendas += parseFloat(v.valor_troco || 0);

      // Soma os métodos de pagamento
      if (v.pagamentos && Array.isArray(v.pagamentos)) {
        v.pagamentos.forEach((p) => {
          const m = p.metodo || 'Outro';
          if (!tot[m]) tot[m] = 0;
          const valor = parseFloat(p.valor_pago || p.valorPago || 0);
          tot[m] += valor;
        });
      }
    });

    // 2. Ajuste do Dinheiro em Gaveta (Apenas Vendas em Dinheiro - Trocos)
    // O fundo de caixa foi removido deste cálculo.
    if (tot['Dinheiro'] !== undefined) {
      tot['Dinheiro'] = tot['Dinheiro'] - trocoTotalDasVendas;
    }
    
    return { 
      metodos: tot, 
      troco: trocoTotalDasVendas
    };
  }, [vendasFiltradas]);

  const totalVendasBruto = useMemo(() => {
    return (vendasFiltradas || []).reduce((acc, v) => acc + parseFloat(v.valor_total_bruto || 0), 0);
  }, [vendasFiltradas]);

  const totalRetiradas = useMemo(() => {
    return (retiradasFiltradas || []).reduce((acc, r) => acc + parseFloat(r.valor || 0), 0);
  }, [retiradasFiltradas]);

  // Saldo Líquido: (Vendas Brutas - Trocos Devolvidos - Retiradas / Sangrias)
  const totalLiquido = useMemo(() => {
    return (totalVendasBruto - totaisCalculados.troco - totalRetiradas);
  }, [totalVendasBruto, totalRetiradas, totaisCalculados.troco]);

  return {
    totaisPorMetodo: totaisCalculados.metodos,
    totalVendasBruto,
    totalValorPago: (vendasFiltradas || []).reduce((acc, v) => acc + parseFloat(v.valor_pago_total || 0), 0),
    totalTroco: totaisCalculados.troco,
    totalRetiradas,
    totalLiquido,
    fundoCaixa: 0, // Definido como 0 pois não deve mais impactar os cálculos
    quantidadeVendas: (vendasFiltradas || []).length,
  };
};