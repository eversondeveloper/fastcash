// hooks/useFiltros.js
import { useState, useMemo } from "react";

export const useFiltros = (produtosDB) => {
  const [filtroCategoriasSelecionadas, setFiltroCategoriasSelecionadas] = useState([]);
  const [filtroTipoItem, setFiltroTipoItem] = useState("Todos");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);

  // AJUSTADO: Garante ordenação alfabética robusta (ignora acentos e capitalização)
  const categoriasUnicas = useMemo(() => {
    if (!produtosDB || produtosDB.length === 0) return [];
    return [...new Set(produtosDB.map((p) => p.categoria))].sort((a, b) => 
        // Usa 'pt' para português e 'sensitivity: base' para ignorar diferenças de acento e caixa
        a.localeCompare(b, 'pt', { sensitivity: 'base' }) 
    );
  }, [produtosDB]);

  const produtosFiltrados = useMemo(() => {
    let lista = produtosDB;
    const termoBusca = filtroBusca.toLowerCase().trim();

    // Filtro por categorias
    if (filtroCategoriasSelecionadas.length > 0) {
      lista = lista.filter((p) =>
        filtroCategoriasSelecionadas.includes(p.categoria)
      );
    }

    // Filtro por tipo de item
    if (filtroTipoItem !== "Todos") {
      lista = lista.filter((p) => p.tipo_item === filtroTipoItem);
    }

    // Filtro por busca
    if (termoBusca) {
      lista = lista.filter(
        (p) =>
          p.descricao.toLowerCase().includes(termoBusca) ||
          p.categoria.toLowerCase().includes(termoBusca) ||
          p.id_produto.toString().includes(termoBusca)
      );
    }

    // Retorna a lista filtrada, que inclui o campo total_vendido para ser ordenado no ListaProdutos
    return lista;
  }, [produtosDB, filtroCategoriasSelecionadas, filtroTipoItem, filtroBusca]);

  const toggleCategoriaFiltro = (categoria) => {
    setFiltroCategoriasSelecionadas((prev) => {
      if (prev.includes(categoria)) {
        return prev.filter((c) => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };

  const limparFiltros = () => {
    setFiltroCategoriasSelecionadas([]);
    setFiltroTipoItem("Todos");
    setFiltroBusca("");
  };

  // CORREÇÃO CRÍTICA: Agora retorna boolean corretamente
  const temFiltrosAtivos = useMemo(() => {
    return Boolean(
      filtroCategoriasSelecionadas.length > 0 ||
      filtroTipoItem !== "Todos" ||
      filtroBusca.trim() !== ""
    );
  }, [filtroCategoriasSelecionadas, filtroTipoItem, filtroBusca]);

  return {
    // Estados
    filtroCategoriasSelecionadas,
    filtroTipoItem,
    filtroBusca,
    filtrosExpandidos,
    
    // Setters
    setFiltroBusca,
    setFiltrosExpandidos,
    
    // Dados calculados
    categoriasUnicas,
    produtosFiltrados,
    temFiltrosAtivos,
    
    // Funções
    toggleCategoriaFiltro,
    setFiltroTipoItem,
    limparFiltros
  };
};