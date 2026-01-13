import React, { useRef, useEffect } from 'react';

export const ModalObservacao = ({
  mostrar,
  onClose,
  texto,
  setTexto,
  onSalvar,
  onApagar,
  carregando,
  dataSelecionada
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (mostrar && editorRef.current) {
      if (editorRef.current.innerHTML !== texto) {
        editorRef.current.innerHTML = texto || "";
      }

      setTimeout(() => {
        editorRef.current.focus();
        if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 50);
    }
  }, [mostrar]);

  if (!mostrar) return null;

  const dataFormatada = dataSelecionada 
    ? new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR') 
    : '';

  const aplicarComando = (comando, valor = null) => {
    editorRef.current.focus();
    document.execCommand(comando, false, valor);
    if (editorRef.current) {
      setTexto(editorRef.current.innerHTML);
    }
  };

  /**
   * FUNÇÃO PARA COLAR APENAS TEXTO PURO
   */
  const handlePaste = (e) => {
    e.preventDefault();
    // Obtém apenas o texto puro do clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insere o texto puro no local do cursor
    if (document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, text);
    } else {
      // Fallback para navegadores que não suportam insertText
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(text));
    }
    
    // Atualiza o estado
    setTexto(editorRef.current.innerHTML);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ 
        maxWidth: '800px', 
        maxHeight: '90vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <h3 style={{ flexShrink: 0 }}>Observações do Dia: {dataFormatada}</h3>

        <div className="input-group" style={{ 
          marginBottom: '10px', 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          overflow: 'hidden'
        }}>
          <label style={{ flexShrink: 0 }}>Relato / Notas do Dia:</label>
          
          <div style={toolbarStyle}>
            <div style={groupStyle}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('bold'); }} style={btnEditorStyle} title="Negrito"><b>B</b></button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('italic'); }} style={btnEditorStyle} title="Itálico"><i>I</i></button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('underline'); }} style={btnEditorStyle} title="Sublinhado"><u>U</u></button>
            </div>

            <div style={groupStyle}>
              <select 
                onChange={(e) => aplicarComando('fontSize', e.target.value)}
                style={selectStyle}
                defaultValue="3"
              >
                <option value="1">Pequeno</option>
                <option value="3">Normal</option>
                <option value="5">Título</option>
                <option value="7">Extra Grande</option>
              </select>
            </div>

            <div style={groupStyle}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('insertUnorderedList'); }} style={btnEditorStyle} title="Lista">• Lista</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('justifyLeft'); }} style={btnEditorStyle} title="Alinhar Esquerda">Esq</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('justifyCenter'); }} style={btnEditorStyle} title="Centralizar">Centro</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('justifyRight'); }} style={btnEditorStyle} title="Alinhar Direita">Dir</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('justifyFull'); }} style={btnEditorStyle} title="Justificar">Just</button>
            </div>

            <div style={{...groupStyle, borderRight: 'none'}}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); aplicarComando('removeFormat'); }} style={{...btnEditorStyle, color: '#ff5252'}} title="Limpar Formatação">Limpar</button>
            </div>
          </div>

          <div
            ref={editorRef}
            className="editor-rich-text"
            contentEditable={!carregando}
            onInput={(e) => setTexto(e.currentTarget.innerHTML)}
            onPaste={handlePaste} // Adicionado o interceptador de colar
            style={{
              ...editorAreaStyle,
              flexGrow: 1,
              maxHeight: 'none',
            }}
          />
        </div>

        <style>{`
          .editor-rich-text ul, .editor-rich-text ol { padding-left: 25px; margin: 10px 0; }
          .editor-rich-text li { margin-bottom: 5px; }
          .editor-rich-text font[size="1"] { font-size: 12px; }
          .editor-rich-text font[size="3"] { font-size: 16px; }
          .editor-rich-text font[size="5"] { font-size: 20px; font-weight: bold; }
          .editor-rich-text font[size="7"] { font-size: 30px; font-weight: bold; }
        `}</style>

        <div className="modal-actions" style={{ flexShrink: 0, marginTop: '10px' }}>
          <button 
            onClick={onApagar} 
            className="btn-secondary"
            style={{ marginRight: 'auto', color: '#ff5252', border: '1px solid #ff5252', backgroundColor: 'transparent' }}
            disabled={carregando || !texto}
          >
            Excluir Nota
          </button>
          
          <button onClick={onClose} className="btn-secondary" disabled={carregando}>
            Cancelar
          </button>
          
          <button onClick={onSalvar} className="btn-primary" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar Observação'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- ESTILOS --- */

const toolbarStyle = {
  display: 'flex', 
  flexWrap: 'wrap',
  gap: '10px', 
  marginBottom: '10px', 
  padding: '8px', 
  backgroundColor: '#1e1e1e', 
  border: '1px solid #444',
  borderRadius: '4px',
  flexShrink: 0
};

const groupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  borderRight: '1px solid #444',
  paddingRight: '10px'
};

const btnEditorStyle = {
  backgroundColor: '#333',
  color: '#eee',
  border: '1px solid #555',
  borderRadius: '3px',
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: '12px',
  minWidth: '32px'
};

const selectStyle = {
  backgroundColor: '#333',
  color: '#eee',
  border: '1px solid #555',
  borderRadius: '3px',
  padding: '3px',
  fontSize: '12px'
};

const editorAreaStyle = {
  width: '100%',
  overflowY: 'auto',
  backgroundColor: '#0c0c0c',
  color: '#64ff8a',
  border: '1px solid #555',
  borderRadius: '4px',
  padding: '15px',
  fontSize: '16px',
  outline: 'none',
  lineHeight: '1.6',
  textAlign: 'left',
};