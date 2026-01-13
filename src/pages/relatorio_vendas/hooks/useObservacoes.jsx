import { useState, useCallback } from 'react';

const URL_API = "http://localhost:3000/observacoes-diarias";

export const useObservacoes = () => {
  const [observacoes, setObservacoes] = useState([]); 
  const [carregandoObs, setCarregandoObs] = useState(false);

  /**
   * BUSCA OBSERVAÇÃO (CORRIGIDO):
   * Sincronizado com a rota GET do servidor que busca por data específica.
   */
  const buscarObservacoesNoPeriodo = useCallback(async (dataBusca) => {
    if (!dataBusca) return;
    
    setCarregandoObs(true);
    try {
      // O servidor espera o parâmetro 'data'
      const url = `${URL_API}?data=${dataBusca}`;
      const resposta = await fetch(url);
      
      if (resposta.ok) {
        const dados = await resposta.json();
        
        // Se vier um objeto único (uma observação), colocamos em um array para o mapa da UI
        if (dados && !Array.isArray(dados)) {
          setObservacoes([dados]);
        } else {
          setObservacoes(Array.isArray(dados) ? dados : []);
        }
      } else {
        setObservacoes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar observações:", error);
      setObservacoes([]);
    } finally {
      setCarregandoObs(false);
    }
  }, []);

  /**
   * SALVAR OBSERVAÇÃO (CORRIGIDO):
   * Agora dispara alertas e recarrega a lista automaticamente.
   */
  const salvarObservacao = async (data, texto, idEmpresa = null) => {
    if (!data || !texto.trim()) {
      alert("⚠️ Digite um texto para a observação.");
      return false;
    }

    setCarregandoObs(true);
    try {
      const resposta = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          data, 
          texto, 
          id_empresa: idEmpresa // Enviado como opcional conforme o novo servidor.js
        }),
      });
      
      const resultado = await resposta.json();

      if (resposta.ok) {
        alert("✅ Observação salva com sucesso!");
        // Recarrega os dados imediatamente para aparecer no relatório
        await buscarObservacoesNoPeriodo(data);
        return true;
      } else {
        alert(`❌ Erro ao salvar: ${resultado.erro || "Falha no servidor"}`);
        return false;
      }
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
      alert("❌ Erro de conexão com o servidor.");
      return false;
    } finally {
      setCarregandoObs(false);
    }
  };

  /**
   * APAGAR OBSERVAÇÃO
   */
  const apagarObservacao = async (data) => {
    if (!data) return false;
    
    const confirmar = window.confirm("Deseja realmente excluir esta observação?");
    if (!confirmar) return false;

    try {
      const resposta = await fetch(`${URL_API}?data=${data}`, { method: "DELETE" });
      
      if (resposta.ok) {
        alert("✅ Observação removida.");
        setObservacoes([]);
        return true;
      } else {
        alert("❌ Erro ao excluir.");
        return false;
      }
    } catch (error) {
      console.error("Erro ao apagar observação:", error);
      return false;
    }
  };

  return {
    observacoes, 
    setObservacoes,
    carregandoObs,
    buscarObservacoesNoPeriodo,
    salvarObservacao,
    apagarObservacao
  };
};