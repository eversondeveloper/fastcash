import { useState, useEffect, useCallback } from 'react';

const URL_API_SESSOES = 'http://localhost:3000/sessoes-caixa';

export const useSessoesCaixa = () => {
  const [sessoes, setSessoes] = useState([]);
  const [sessaoAtual, setSessaoAtual] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Busca a sessão que está aberta no momento
  const buscarSessaoAtual = useCallback(async () => {
    try {
      const resposta = await fetch(`${URL_API_SESSOES}/atual`);
      
      if (!resposta.ok) {
        setSessaoAtual(null);
        return null;
      }
      
      const sessao = await resposta.json();
      setSessaoAtual(sessao || null);
      return sessao;
    } catch (error) {
      setSessaoAtual(null);
      return null;
    }
  }, []);

  // Busca o histórico de todas as sessões
  const buscarSessoes = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await fetch(URL_API_SESSOES);
      
      if (!resposta.ok) {
        if (resposta.status === 404) {
           setSessoes([]);
           return;
        }
        throw new Error('Erro ao buscar lista de sessões');
      }

      const dados = await resposta.json();
      setSessoes(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro buscarSessoes:", error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  /**
   * ABRIR SESSÃO (CORRIGIDO):
   * Agora aceita os dados em um único objeto, garantindo que o id_empresa seja lido corretamente.
   */
  const abrirSessaoCaixa = async (dadosSessao) => {
    // Busca o ID tanto da raiz do objeto quanto de uma propriedade interna
    const idEmpresaFinal = dadosSessao.id_empresa;

    if (!idEmpresaFinal) {
      return { sucesso: false, erro: "ID da empresa não detectado no envio." };
    }

    try {
      setErro('');
      const resposta = await fetch(URL_API_SESSOES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_atendente: dadosSessao.id_atendente,
          valor_inicial: parseFloat(dadosSessao.valor_inicial) || 0,
          id_empresa: idEmpresaFinal 
        })
      });
      
      const resultado = await resposta.json();
      
      if (!resposta.ok) {
        throw new Error(resultado.erro || 'Falha ao abrir o caixa');
      }
      
      setSessaoAtual(resultado.sessao);
      
      // Em vez de reload total, buscamos os dados atualizados
      await buscarSessaoAtual();
      await buscarSessoes();
      
      return { sucesso: true, sessao: resultado.sessao };
    } catch (error) {
      setErro(error.message);
      return { sucesso: false, erro: error.message };
    }
  };

  /**
   * FECHAR SESSÃO
   */
  const fecharSessaoCaixa = async (idSessao, dadosFechamento = {}) => {
    try {
      setErro('');
      const dadosParaEnviar = {
        valor_final: parseFloat(dadosFechamento.valor_final) || 0
      };

      const resposta = await fetch(`${URL_API_SESSOES}/${idSessao}/fechar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnviar)
      });
      
      if (!resposta.ok) {
        const erroJson = await resposta.json();
        throw new Error(erroJson.erro || 'Erro ao fechar sessão');
      }
      
      setSessaoAtual(null);
      await buscarSessaoAtual();
      await buscarSessoes();
      
      return { sucesso: true };
    } catch (error) {
      setErro(error.message);
      return { sucesso: false, erro: error.message };
    }
  };

  // Monitoramento automático da sessão
  useEffect(() => {
    buscarSessaoAtual();
    const intervalo = setInterval(() => buscarSessaoAtual(), 30000);
    return () => clearInterval(intervalo);
  }, [buscarSessaoAtual]);

  // Carrega o histórico ao montar o hook
  useEffect(() => {
    buscarSessoes();
  }, [buscarSessoes]);

  return {
    sessoes,
    sessaoAtual,
    carregando,
    erro,
    buscarSessoes,
    buscarSessaoAtual,
    abrirSessaoCaixa,
    fecharSessaoCaixa
  };
};