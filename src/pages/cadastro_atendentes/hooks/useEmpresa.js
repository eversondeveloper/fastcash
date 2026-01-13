import { useState, useCallback, useEffect } from "react";

const URL_API_EMPRESAS = "http://localhost:3000/empresas";

export const useEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [carregandoEmpresa, setCarregandoEmpresa] = useState(true);
  const [erroEmpresa, setErroEmpresa] = useState(null);

  // Busca a empresa ativa e garante a normalização do ID
  const buscarEmpresa = useCallback(async () => {
    setCarregandoEmpresa(true);
    setErroEmpresa(null);
    try {
      const res = await fetch(URL_API_EMPRESAS);
      if (!res.ok) throw new Error("Erro na comunicação com o servidor.");
      
      const dados = await res.json();
      
      // Verificação rigorosa do array de empresas
      if (Array.isArray(dados) && dados.length > 0) {
        const empresaEncontrada = dados[0];
        
        // Normalização: garante que id_empresa exista independente da chave do banco
        const empresaNormalizada = {
          ...empresaEncontrada,
          id_empresa: empresaEncontrada.id_empresa || empresaEncontrada.id
        };
        
        setEmpresa(empresaNormalizada);
      } else {
        setEmpresa(null);
      }
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      setErroEmpresa(error.message);
      setEmpresa(null);
    } finally {
      setCarregandoEmpresa(false);
    }
  }, []);

  const cadastrarEmpresa = async (dados) => {
    try {
      const res = await fetch(URL_API_EMPRESAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      
      if (!res.ok) {
        const erroJson = await res.json();
        throw new Error(erroJson.erro || "Falha ao cadastrar empresa");
      }
      
      await buscarEmpresa();
      return { sucesso: true };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  };

  const atualizarEmpresa = async (id, dados) => {
    try {
      const res = await fetch(`${URL_API_EMPRESAS}/${id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      
      if (!res.ok) {
        const erroJson = await res.json();
        throw new Error(erroJson.erro || "Falha ao atualizar dados");
      }
      
      await buscarEmpresa();
      return { sucesso: true };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  };

  const deletarEmpresa = async (id) => {
    // Validação de segurança extra
    if (!id) return { sucesso: false, erro: "ID da empresa não informado." };

    const confirmacao = window.confirm(
      "⚠️ AVISO CRÍTICO DE RESET ⚠️\n\n" +
      "Ao confirmar, você apagará permanentemente:\n" +
      "- Dados da Empresa\n" +
      "- Todo o histórico de Vendas e Pagamentos\n" +
      "- Todas as Sessões de Caixa e Retiradas\n" +
      "- Todos os Atendentes e Produtos vinculados\n\n" +
      "Esta ação NÃO PODE SER DESFEITA. Deseja continuar?"
    );

    if (!confirmacao) return { sucesso: false };

    try {
      const res = await fetch(`${URL_API_EMPRESAS}/${id}`, { 
        method: "DELETE" 
      });

      if (res.ok) {
        setEmpresa(null);
        // Limpa estados e recarrega para garantir interface limpa
        await buscarEmpresa(); 
        alert("Sistema resetado com sucesso. Todos os dados foram apagados.");
        return { sucesso: true };
      } else {
        const erroJson = await res.json();
        throw new Error(erroJson.erro || "Ocorreu um erro ao tentar resetar o sistema.");
      }
    } catch (error) {
      console.error("Erro na deleção:", error);
      alert(error.message);
      return { sucesso: false, erro: error.message };
    }
  };

  useEffect(() => { 
    buscarEmpresa(); 
  }, [buscarEmpresa]);

  return { 
    empresa, 
    carregandoEmpresa, 
    erroEmpresa,
    cadastrarEmpresa, 
    atualizarEmpresa, 
    deletarEmpresa, 
    buscarEmpresa 
  };
};