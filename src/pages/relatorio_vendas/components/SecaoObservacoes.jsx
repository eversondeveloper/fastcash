import React from 'react';

export const SecaoObservacoes = ({ 
  texto, 
  setTexto, 
  onSalvar, 
  onApagar, 
  carregando,
  dataSelecionada 
}) => {
  
  // Só exibe se houver uma data de início selecionada
  if (!dataSelecionada) return null;

  const dataFormatada = new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR');

  return (
    <div style={{ 
      marginTop: '40px', 
      padding: '25px', 
      backgroundColor: '#1a1a1a', 
      borderRadius: '8px',
      border: '1px solid #333',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ color: '#BACBD9', margin: 0, fontSize: '18px' }}>
          Observações do Dia: <span style={{ color: '#64ff8a' }}>{dataFormatada}</span>
        </h3>
        {carregando && <span style={{ color: '#888', fontSize: '12px' }}>Processando...</span>}
      </div>
      
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Registre aqui ocorrências, notas sobre o fechamento ou lembretes importantes deste dia específico..."
        style={{
          width: '100%',
          minHeight: '150px',
          backgroundColor: '#0c0c0c',
          color: '#e0e0e0',
          border: '1px solid #444',
          borderRadius: '6px',
          padding: '15px',
          fontSize: '15px',
          fontFamily: 'inherit',
          lineHeight: '1.5',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#2196F3'}
        onBlur={(e) => e.target.style.borderColor = '#444'}
        disabled={carregando}
      />

      <div style={{ display: 'flex', gap: '12px', marginTop: '15px', justifyContent: 'flex-end' }}>
        <button
          onClick={onApagar}
          disabled={carregando || !texto}
          style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#ff5252',
            border: '1px solid #ff5252',
            borderRadius: '4px',
            cursor: (carregando || !texto) ? 'not-allowed' : 'pointer',
            opacity: (carregando || !texto) ? 0.5 : 1,
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Excluir Registro
        </button>
        <button
          onClick={onSalvar}
          disabled={carregando}
          style={{
            padding: '10px 30px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: carregando ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'background-color 0.2s'
          }}
        >
          {carregando ? 'Salvando...' : 'Salvar Observação'}
        </button>
      </div>
    </div>
  );
};