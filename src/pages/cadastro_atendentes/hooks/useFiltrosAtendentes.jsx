import { useState, useMemo } from 'react';

export const useFiltrosAtendentes = (atendentesBase = []) => {
  const [filtroNome, setFiltroNome] = useState('');
  // Alterado para 'ativos' por padrão para garantir que excluídos/inativos sumam da vista imediata
  const [filtroAtivo, setFiltroAtivo] = useState('ativos');

  const atendentesFiltrados = useMemo(() => {
    // Filtro rigoroso: Se o dado não for um array ou estiver vazio, retorna lista vazia imediatamente
    if (!atendentesBase || !Array.isArray(atendentesBase) || atendentesBase.length === 0) {
      return [];
    }

    // Debug atualizado para monitorar a exclusão física
    console.log(`Filtro atualizando: ${atendentesBase.length} registros no estado global.`);

    return atendentesBase.filter(atendente => {
      // 1. Validação de existência do objeto
      if (!atendente || !atendente.id_atendente) return false;

      // 2. Filtro por Nome
      const nomeAtendente = atendente.nome?.toLowerCase() || "";
      const matchesNome = nomeAtendente.includes(filtroNome.toLowerCase().trim());
      
      // 3. Filtro por Status (Considerando a exclusão física do banco)
      const isAtivo = !!atendente.ativo; 
      
      if (filtroAtivo === 'ativos') {
        return matchesNome && isAtivo === true;
      } 
      
      if (filtroAtivo === 'inativos') {
        return matchesNome && isAtivo === false;
      }

      // Caso 'todos'
      return matchesNome;
    });
  }, [atendentesBase, filtroNome, filtroAtivo]);

  return {
    filtroNome, 
    setFiltroNome,
    filtroAtivo, 
    setFiltroAtivo,
    atendentesFiltrados,
    handleLimparFiltros: () => { 
      setFiltroNome(''); 
      setFiltroAtivo('ativos'); // Reset volta para mostrar apenas quem existe/está ativo
    }
  };
};