// components/ModalRetirada.jsx
import React from 'react';

export const ModalRetirada = ({
  mostrar,
  onClose,
  novaRetirada,
  setNovaRetirada,
  onRegistrar,
}) => {
  if (!mostrar) return null;

  const handleRegistrar = () => {
    // Check de validação ajustado para incluir timeRetirada
    if (!novaRetirada.valorRetirado || !novaRetirada.motivo || !novaRetirada.dataRetirada || !novaRetirada.timeRetirada) {
      alert('Preencha o valor, o motivo, a data e a hora da retirada.');
      return;
    }

    const valor = parseFloat(novaRetirada.valorRetirado);
    if (isNaN(valor) || valor <= 0) {
      alert('Valor inválido. Digite um valor numérico positivo.');
      return;
    }

    onRegistrar();
  };
  
  // Estilo comum para inputs de formulário
  const inputStyle = {
    width: '100%',
    padding: '8px',
    backgroundColor: '#1e1e1e',
    color: '#BACBD9',
    border: '1px solid #555',
    borderRadius: '4px',
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <h3>Nova Retirada do Caixa</h3>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '5px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#64ff8a' }}>Informações de Data e Hora</h4>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            {/* 1. SELETOR DE DATA */}
            <div className="input-group" style={{ marginBottom: '10px', flex: 1 }}>
              <label>Data:</label>
              <input
                type="date"
                value={novaRetirada.dataRetirada}
                onChange={(e) =>
                  setNovaRetirada({
                    ...novaRetirada,
                    dataRetirada: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>
            
            {/* 2. SELETOR DE HORA (NOVO) */}
            <div className="input-group" style={{ marginBottom: '10px', flex: 1 }}>
              <label>Hora:</label>
              <input
                type="time"
                value={novaRetirada.timeRetirada}
                onChange={(e) =>
                  setNovaRetirada({
                    ...novaRetirada,
                    timeRetirada: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>
          </div>

          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#BACBD9' }}>
            Defina a data e hora exatas do evento.
          </p>
        </div>

        <div className="input-group">
          <label>Valor Retirado:</label>
          <input
            type="number"
            step="0.01"
            value={novaRetirada.valorRetirado}
            onChange={(e) =>
              setNovaRetirada({
                ...novaRetirada,
                valorRetirado: e.target.value,
              })
            }
            placeholder="0.00"
            style={inputStyle}
          />
        </div>

        <div className="input-group">
          <label>Motivo:</label>
          <input
            type="text"
            value={novaRetirada.motivo}
            onChange={(e) =>
              setNovaRetirada({ ...novaRetirada, motivo: e.target.value })
            }
            placeholder="Ex: Compra de material, Pagamento de conta..."
            style={inputStyle}
          />
        </div>

        <div className="input-group">
          <label>Observação (opcional):</label>
          <textarea
            value={novaRetirada.observacao}
            onChange={(e) =>
              setNovaRetirada({ ...novaRetirada, observacao: e.target.value })
            }
            style={{
              ...inputStyle,
              minHeight: '80px',
              resize: 'vertical',
            }}
          />
        </div>

        <div className="modal-actions">
          <button 
            onClick={onClose} 
            className="btn-secondary"
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={handleRegistrar} 
            className="btn-primary"
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Registrar Retirada
          </button>
        </div>
      </div>
    </div>
  );
};