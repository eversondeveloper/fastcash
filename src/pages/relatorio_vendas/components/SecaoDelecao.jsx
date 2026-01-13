import React from 'react';

export const SecaoDelecao = ({
  onNovaRetirada,
  onGerarPDF,
  gerandoPDF,
  vendasFiltradas,
  retiradasFiltradas,
  vendas,
  onDeletarFiltrados,
  onDeletarTudo,
  onAbrirObservacao,
  temObservacao
}) => {
  return (
    <div className="secao-delecao">
      {/* BOTÃO NOVA RETIRADA (Laranja) */}
      <button 
        className="btn-retirada" 
        onClick={onNovaRetirada}
      >
        Nova Retirada
      </button>

      {/* BOTÃO: OBSERVAÇÃO (Verde) */}
      <button 
        className="btn-pdf" 
        style={{ backgroundColor: '#4CAF50', color: 'white' }}
        onClick={onAbrirObservacao}
      >
        {temObservacao ? "Editar Observação" : "Adicionar Observação"}
      </button>

      {/* BOTÃO GERAR PDF (Azul) */}
      <button 
        className="btn-pdf" 
        onClick={onGerarPDF} 
        disabled={gerandoPDF || (vendasFiltradas.length === 0 && retiradasFiltradas.length === 0)}
      >
        {gerandoPDF ? "Gerando..." : "Gerar PDF"}
      </button>

      {/* BOTÃO DELETAR FILTRADOS (Cinza/Padrão conforme CSS) */}
      <button 
        className="btn-deletar-filtrados" 
        onClick={onDeletarFiltrados}
        disabled={vendasFiltradas.length === 0}
      >
        Deletar Filtrados
      </button>

      {/* BOTÃO DELETAR TUDO (Alterado para Vermelho de Destaque) */}
      <button 
        className="btn-deletar-tudo" 
        style={{ 
          backgroundColor: '#E53935', 
          color: 'white',
          fontWeight: 'bold',
          border: '1px solid #b71c1c' 
        }}
        onClick={onDeletarTudo}
        disabled={vendas.length === 0}
      >
        Deletar Tudo
      </button>
    </div>
  );
};