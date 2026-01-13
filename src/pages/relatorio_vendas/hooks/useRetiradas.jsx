import { useState, useEffect, useCallback } from 'react';

const URL_API_RETIRADAS = "http://localhost:3000/retiradas-caixa";

const getDataAtualFormatada = () => {
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const diaAtual = String(dataAtual.getDate()).padStart(2, "0");
    return `${anoAtual}-${mesAtual}-${diaAtual}`;
};

const getTimeAtualFormatada = () => {
    const dataAtual = new Date();
    const hora = String(dataAtual.getHours()).padStart(2, "0");
    const minuto = String(dataAtual.getMinutes()).padStart(2, "0");
    return `${hora}:${minuto}`;
};

const formatarDataDB = (dataString) => {
    if (!dataString) return getDataAtualFormatada();
    const date = new Date(dataString);
    if (isNaN(date.getTime())) return getDataAtualFormatada();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatarHoraDB = (dataString) => {
    if (!dataString) return getTimeAtualFormatada();
    const date = new Date(dataString);
    if (isNaN(date.getTime())) return getTimeAtualFormatada();
    const hora = String(date.getHours()).padStart(2, '0');
    const minuto = String(date.getMinutes()).padStart(2, '0');
    return `${hora}:${minuto}`;
};

export const useRetiradas = () => {
  const [retiradas, setRetiradas] = useState([]);
  const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [retiradaEditando, setRetiradaEditando] = useState(null);
  
  const [novaRetirada, setNovaRetirada] = useState({
    valorRetirado: "",
    motivo: "",
    observacao: "",
    dataRetirada: getDataAtualFormatada(),
    timeRetirada: getTimeAtualFormatada(),
  });

  /**
   * BUSCAR RETIRADAS (CORRIGIDO):
   * Sincronizado com a rota GET do servidor.js para evitar o erro 404.
   */
  const buscarRetiradas = useCallback(async (dataInicio = '', dataFim = '') => {
    try {
      let url = URL_API_RETIRADAS;
      
      const params = new URLSearchParams();
      if (dataInicio) params.append('inicio', dataInicio);
      if (dataFim) params.append('fim', dataFim);
      
      const query = params.toString();
      if (query) url += `?${query}`;
      
      const resposta = await fetch(url);
      
      if (resposta.ok) {
        const dados = await resposta.json();
        const lista = Array.isArray(dados) ? dados : [];
        setRetiradas(lista);
        setRetiradasFiltradas(lista);
      } else {
        console.error("Servidor retornou erro ao buscar retiradas:", resposta.status);
        setRetiradas([]);
        setRetiradasFiltradas([]);
      }
    } catch (erro) {
      console.error("Erro de conexão ao buscar retiradas:", erro);
      setRetiradas([]);
      setRetiradasFiltradas([]);
    }
  }, []);

  const filtrarRetiradasLocalmente = useCallback((dataInicio, dataFim) => {
    if (!retiradas.length) return;
    
    const filtradas = retiradas.filter((retirada) => {
      const dataRetiradaStr = formatarDataDB(retirada.data_retirada || retirada.data_corrigida); 

      if (!dataInicio && !dataFim) return true;
      if (dataInicio && dataFim && dataInicio === dataFim) {
        return dataRetiradaStr === dataInicio;
      }
      if (dataInicio && !dataFim) return dataRetiradaStr >= dataInicio;
      if (!dataInicio && dataFim) return dataRetiradaStr <= dataFim;
      return dataRetiradaStr >= dataInicio && dataRetiradaStr <= dataFim;
    });

    setRetiradasFiltradas(filtradas);
  }, [retiradas]);
  
  const combinarDataHora = useCallback((data, hora) => {
    return `${data}T${hora}:00`; 
  }, []);

  /**
   * REGISTRAR RETIRADA (CORRIGIDO):
   * Envia os dados simplificados para evitar o erro 400 (Bad Request).
   */
  const registrarRetirada = useCallback(async () => {
    if (!novaRetirada.valorRetirado || !novaRetirada.motivo) {
      throw new Error("Preencha o valor e o motivo da retirada.");
    }

    const valor = parseFloat(String(novaRetirada.valorRetirado).replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      throw new Error("Digite um valor numérico válido.");
    }
    
    const dataHoraCompleta = combinarDataHora(novaRetirada.dataRetirada, novaRetirada.timeRetirada);

    const payload = {
      valor: valor,
      motivo: novaRetirada.motivo,
      observacao: novaRetirada.observacao || "",
      dataRetirada: dataHoraCompleta,
      // O id_empresa agora é tratado como opcional pelo servidor.js
    };

    const resposta = await fetch(URL_API_RETIRADAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Não foi possível registrar a retirada.");
    }

    // Após sucesso, atualiza a lista do dia atual
    const hoje = getDataAtualFormatada();
    await buscarRetiradas(hoje, hoje);
    
    return resultado;
  }, [novaRetirada, combinarDataHora, buscarRetiradas]);

  const atualizarRetirada = useCallback(async (id, dados) => {
    const dataHoraCompleta = combinarDataHora(dados.dataRetirada, dados.timeRetirada);
    
    const payload = {
      valor: parseFloat(String(dados.valorRetirado).replace(',', '.')),
      motivo: dados.motivo,
      observacao: dados.observacao || "",
      dataRetirada: dataHoraCompleta,
    };

    const resposta = await fetch(`${URL_API_RETIRADAS}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resposta.ok) {
      const resultado = await resposta.json();
      throw new Error(resultado.erro || "Erro ao atualizar retirada.");
    }

    await buscarRetiradas(getDataAtualFormatada(), getDataAtualFormatada());
    return await resposta.json();
  }, [combinarDataHora, buscarRetiradas]);

  const deletarRetirada = useCallback(async (id) => {
    const resposta = await fetch(`${URL_API_RETIRADAS}/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      const resultado = await resposta.json();
      throw new Error(resultado.mensagem || "Erro ao excluir retirada.");
    }

    await buscarRetiradas(getDataAtualFormatada(), getDataAtualFormatada());
    return true;
  }, [buscarRetiradas]);

  const abrirModalEdicao = useCallback((retirada) => {
    setRetiradaEditando(retirada);
    const dataHoraDB = retirada.data_retirada || retirada.data_corrigida;
    
    setNovaRetirada({
      valorRetirado: retirada.valor.toString(),
      motivo: retirada.motivo,
      observacao: retirada.observacao || "",
      dataRetirada: formatarDataDB(dataHoraDB),
      timeRetirada: formatarHoraDB(dataHoraDB),
    });
    setModalEdicao(true);
  }, []);

  const fecharModalEdicao = useCallback(() => {
    setModalEdicao(false);
    setRetiradaEditando(null);
    resetarFormulario();
  }, []);

  const resetarFormulario = useCallback(() => {
    setNovaRetirada({
      valorRetirado: "",
      motivo: "",
      observacao: "",
      dataRetirada: getDataAtualFormatada(),
      timeRetirada: getTimeAtualFormatada(),
    });
  }, []);

  useEffect(() => {
    const dataAtual = getDataAtualFormatada();
    buscarRetiradas(dataAtual, dataAtual);
  }, [buscarRetiradas]);

  return {
    retiradas,
    retiradasFiltradas,
    mostrarModal,
    setMostrarModal,
    modalEdicao,
    setModalEdicao,
    retiradaEditando,
    novaRetirada,
    setNovaRetirada,
    buscarRetiradas,
    filtrarRetiradasLocalmente,
    registrarRetirada,
    atualizarRetirada,
    deletarRetirada,
    abrirModalEdicao,
    fecharModalEdicao,
    resetarFormulario,
  };
};