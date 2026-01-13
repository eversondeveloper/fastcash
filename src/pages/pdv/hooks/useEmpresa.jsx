// hooks/useEmpresa.js
import { useState, useEffect } from "react";

const URL_API_EMPRESAS = "http://localhost:3000/empresas";

export const useEmpresa = () => {
  const [dadosEmpresa, setDadosEmpresa] = useState(null);
  const [carregandoEmpresa, setCarregandoEmpresa] = useState(true);
  const [erroEmpresa, setErroEmpresa] = useState(null);

  useEffect(() => {
    const buscarEmpresa = async () => {
      setCarregandoEmpresa(true);
      setErroEmpresa(null);
      try {
        const resposta = await fetch(URL_API_EMPRESAS);
        if (!resposta.ok) {
          throw new Error("Falha ao carregar empresas da API.");
        }
        const dados = await resposta.json();

       
        if (dados.length > 0) {
          setDadosEmpresa(dados[0]);
        } else {
          setErroEmpresa("Nenhuma empresa encontrada na base de dados.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados da empresa:", error);
        setErroEmpresa("❌ Erro ao carregar dados da empresa da API.");
      } finally {
        setCarregandoEmpresa(false);
      }
    };
    buscarEmpresa();
  }, []);

  return {
    dadosEmpresa,
    carregandoEmpresa,
    erroEmpresa,
  };
};