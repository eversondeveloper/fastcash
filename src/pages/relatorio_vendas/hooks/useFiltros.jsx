import { useState, useMemo, useEffect } from "react";

// Configuração de data atual para os filtros
const dataAtual = new Date();
const anoAtual = dataAtual.getFullYear();
const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, "0");
const diaAtual = String(dataAtual.getDate()).padStart(2, "0");
const dataFormatada = `${anoAtual}-${mesAtual}-${diaAtual}`;

export const useFiltros = (vendas, retiradas, filtrarRetiradasLocalmente) => {
  const [filtroDataInicio, setFiltroDataInicio] = useState(dataFormatada);
  const [filtroDataFim, setFiltroDataFim] = useState(dataFormatada);
  const [filtroMetodosPagamento, setFiltroMetodosPagamento] = useState([]);

  const METODOS_PAGAMENTO = ["Dinheiro", "Pix", "Crédito", "Débito", "Misto"];

  // Quando os filtros mudam, aplica filtragem local nas retiradas
  useEffect(() => {
    if (filtrarRetiradasLocalmente) {
      filtrarRetiradasLocalmente(filtroDataInicio, filtroDataFim);
    }
  }, [filtroDataInicio, filtroDataFim, filtrarRetiradasLocalmente]);

  const toggleMetodoPagamento = (metodo) => {
    setFiltroMetodosPagamento((prev) =>
      prev.includes(metodo)
        ? prev.filter((m) => m !== metodo)
        : [...prev, metodo]
    );
  };

  const limparFiltros = () => {
    setFiltroDataInicio("");
    setFiltroDataFim("");
    setFiltroMetodosPagamento([]);
  };

  const limparFiltrosMetodos = () => {
    setFiltroMetodosPagamento([]);
  };

  // Função auxiliar para normalizar datas
  const normalizeToISODate = (raw) => {
    if (!raw) return "";
    const date = new Date(raw);
    if (isNaN(date.getTime())) {
        const match = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (match) {
          const [, dd, mm, yyyy] = match;
          return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
        }
        return String(raw).slice(0, 10);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filtrarPorData = (item, dataField) => {
    if (!filtroDataInicio && !filtroDataFim) return true;
    const dataItemStr = normalizeToISODate(item[dataField]);

    if (filtroDataInicio && filtroDataFim && filtroDataInicio === filtroDataFim) {
      return dataItemStr === filtroDataInicio;
    }
    if (filtroDataInicio && !filtroDataFim) {
      return dataItemStr >= filtroDataInicio;
    }
    if (!filtroDataInicio && filtroDataFim) {
      return dataItemStr <= filtroDataFim;
    }
    if (filtroDataInicio && filtroDataFim) {
      return dataItemStr >= filtroDataInicio && dataItemStr <= filtroDataFim;
    }
    return true;
  };

  // Lógica de filtragem das vendas (RESTAURADA PARA PERÍODO COMPLETO)
  const vendasFiltradas = useMemo(() => {
    if (!vendas || vendas.length === 0) return [];

    // Filtra por data (pega todas as sessões dentro do dia/período)
    let lista = vendas.filter((venda) => filtrarPorData(venda, "data_hora"));

    // Filtro por métodos de pagamento
    if (filtroMetodosPagamento.length > 0) {
      lista = lista.filter((venda) => {
        if (!venda.pagamentos || venda.pagamentos.length === 0) return false;
        return venda.pagamentos.some((pagamento) =>
          filtroMetodosPagamento.includes(pagamento.metodo)
        );
      });
    }

    return lista.sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
  }, [vendas, filtroDataInicio, filtroDataFim, filtroMetodosPagamento]);

  const retiradasFiltradas = retiradas; 

  return {
    filtroDataInicio,
    setFiltroDataInicio,
    filtroDataFim,
    setFiltroDataFim,
    filtroMetodosPagamento,
    toggleMetodoPagamento,
    limparFiltros,
    limparFiltrosMetodos,
    METODOS_PAGAMENTO,
    vendasFiltradas,
    retiradasFiltradas,
  };
};