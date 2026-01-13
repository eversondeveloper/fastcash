import React, { useState, useEffect, useRef } from 'react';
import { BotaoPrimario, BotaoSecundario, Flex, Input, Select } from '../CadastroAtendentesStyled';
import { useEmpresa } from '../hooks/useEmpresa'; // IMPORTADO

export const ModalSessaoCaixa = ({ 
  mostrar, 
  onClose, 
  atendentes, 
  onAbrirSessao,
  sessaoAtual,
  atendentePreSelecionado 
}) => {
  // ACESSA OS DADOS DA EMPRESA
  const { empresa } = useEmpresa();

  const [dadosSessao, setDadosSessao] = useState({
    id_atendente: '',
    valor_inicial: '0,00' 
  });
  
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState({});
  const inputValorRef = useRef(null);

  useEffect(() => {
    if (mostrar) {
      const idInicial = atendentePreSelecionado || '';
      setDadosSessao({
        id_atendente: idInicial,
        valor_inicial: idInicial ? '' : '0,00'
      });
      setErros({});
      if (idInicial) {
        setTimeout(() => {
          inputValorRef.current?.focus();
        }, 100);
      }
    }
  }, [mostrar, atendentePreSelecionado]);

  // Funções de validação, formatação e submit mantidas...
  const validarFormulario = () => {
    const novosErros = {};
    if (!dadosSessao.id_atendente) novosErros.id_atendente = 'Selecione um atendente';
    const valorStr = dadosSessao.valor_inicial.replace(',', '.');
    const valor = parseFloat(valorStr);
    if (isNaN(valor) || valor < 0) novosErros.valor_inicial = 'Valor inválido';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (campo, valor) => {
    setDadosSessao(prev => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros(prev => ({ ...prev, [campo]: '' }));
    if (campo === 'id_atendente' && valor !== '') {
      setDadosSessao(prev => ({ ...prev, id_atendente: valor, valor_inicial: '' }));
      setTimeout(() => inputValorRef.current?.focus(), 10);
    }
  };

  const formatarValor = (valor) => {
    valor = valor.replace(/[^\d,]/g, '');
    const partes = valor.split(',');
    if (partes.length > 2) valor = partes[0] + ',' + partes.slice(1).join('');
    if (partes.length === 2 && partes[1].length > 2) valor = partes[0] + ',' + partes[1].substring(0, 2);
    return valor;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validarFormulario()) return;
    setEnviando(true);
    try {
      const valorLimpo = dadosSessao.valor_inicial === '' ? '0' : dadosSessao.valor_inicial.replace(',', '.');
      await onAbrirSessao(dadosSessao.id_atendente, parseFloat(valorLimpo));
    } catch (error) {
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  if (!mostrar) return null;
  const atendentesDisponiveis = atendentes.filter(a => a.ativo);
  
  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 3000
    }}>
      <div className="modal-content" style={{ 
        backgroundColor: '#2d2d2d', 
        padding: '30px', 
        borderRadius: '12px', 
        width: '550px',
        border: '1px solid #444'
      }}>
        {/* CABEÇALHO DO MODAL COM DADOS DA EMPRESA */}
        <div className="modal-header" style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '15px' }}>
          <Flex justify="space-between" align="center">
            <div>
              <h2 style={{ color: '#FF9800', margin: 0, fontSize: '1.4rem' }}>
                💰 Abrir Sessão de Caixa
              </h2>
              {empresa && (
                <p style={{ color: '#64ff8a', margin: '5px 0 0 0', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {empresa.nome_fantasia || empresa.razao_social} <span style={{ color: '#888' }}>| CNPJ: {empresa.cnpj}</span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </Flex>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '8px', fontSize: '0.9rem' }}>Selecione o Atendente *</label>
              <Select
                value={dadosSessao.id_atendente}
                onChange={(e) => handleChange('id_atendente', e.target.value)}
                disabled={enviando || sessaoAtual}
                style={{ borderColor: erros.id_atendente ? '#E53935' : undefined }}
              >
                <option value="">Escolha um operador disponível...</option>
                {atendentesDisponiveis.map(atendente => (
                  <option key={atendente.id_atendente} value={atendente.id_atendente}>
                    {atendente.nome}
                  </option>
                ))}
              </Select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '8px', fontSize: '0.9rem' }}>
                Valor de Fundo de Caixa (Troco Inicial)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}>R$</span>
                <Input
                  ref={inputValorRef}
                  type="text"
                  placeholder="0,00"
                  value={dadosSessao.valor_inicial}
                  onChange={(e) => handleChange('valor_inicial', formatarValor(e.target.value))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  disabled={enviando || sessaoAtual}
                  style={{ paddingLeft: '40px', borderColor: erros.valor_inicial ? '#E53935' : undefined }}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <BotaoSecundario type="button" onClick={onClose} disabled={enviando}>
                Cancelar
              </BotaoSecundario>
              <BotaoPrimario 
                type="submit" 
                disabled={enviando || sessaoAtual || !dadosSessao.id_atendente}
              >
                {enviando ? 'Processando...' : 'Confirmar Abertura'}
              </BotaoPrimario>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};