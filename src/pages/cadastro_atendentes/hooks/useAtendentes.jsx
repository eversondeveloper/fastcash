import { useState, useEffect, useCallback } from 'react';

const URL_API_ATENDENTES = 'http://localhost:3000/atendentes';

export const useAtendentes = () => {
  const [atendentes, setAtendentes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Busca a lista atualizada de atendentes do servidor
  const buscarAtendentes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      
      const resposta = await fetch(URL_API_ATENDENTES);
      
      if (!resposta.ok) throw new Error('Erro ao buscar atendentes no servidor.');
      
      const dados = await resposta.json();
      // Garante que o estado seja sempre um array para evitar erros de .map() na UI
      setAtendentes(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao buscar atendentes:", error);
      setErro(error.message);
      setAtendentes([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarAtendentes();
  }, [buscarAtendentes]);

  /**
   * CRIAÇÃO: Vincula o novo atendente à empresa de forma explícita.
   */
  const criarAtendente = async (dadosAtendente, idEmpresa) => {
    if (!idEmpresa) {
      return { sucesso: false, erro: "ID da empresa não detectado. Cadastre a empresa primeiro." };
    }

    try {
      const resposta = await fetch(URL_API_ATENDENTES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...dadosAtendente, 
          id_empresa: idEmpresa // Sobrescreve para garantir o vínculo correto
        })
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || 'Erro ao processar cadastro no servidor.');
      }

      await buscarAtendentes(); 
      return { sucesso: true, atendente: resultado.atendente };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  };

  /**
   * ATUALIZAÇÃO
   */
  const atualizarAtendente = async (id, dadosAtendente) => {
    try {
      const resposta = await fetch(`${URL_API_ATENDENTES}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtendente)
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || 'Erro ao atualizar dados.');
      }

      await buscarAtendentes();
      return { sucesso: true, atendente: resultado.atendente };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  };

  /**
   * DELEÇÃO DEFINITIVA (Sincronizada com DELETE do banco)
   */
  const deletarAtendente = async (id) => {
    // Confirmação de segurança
    const confirmar = window.confirm("⚠️ ATENÇÃO: Deseja EXCLUIR permanentemente este atendente? Esta ação não pode ser desfeita.");
    if (!confirmar) return { sucesso: false };

    try {
      const resposta = await fetch(`${URL_API_ATENDENTES}/${id}`, { method: 'DELETE' });
      
      if (!resposta.ok) {
        const erroSvr = await resposta.json();
        // O servidor retornará erro se houver sessão aberta (conforme consultas.js)
        throw new Error(erroSvr.erro || 'Não foi possível excluir o atendente.');
      }

      await buscarAtendentes();
      return { sucesso: true };
    } catch (error) {
      console.error("Erro ao deletar atendente:", error);
      return { sucesso: false, erro: error.message };
    }
  };

  return { 
    atendentes, 
    carregando, 
    erro, 
    criarAtendente, 
    atualizarAtendente, 
    deletarAtendente, 
    buscarAtendentes 
  };
};