import React, { useState, useEffect } from 'react';

export const SecaoEmpresa = ({ empresa, onCadastrar, onAtualizar, onDeletar }) => {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    razaoSocial: '', nomeFantasia: '', cnpj: '', inscricaoEstadual: '',
    endereco: '', cidade: '', estado: '', cep: '', telefone: '', email: ''
  });

  // --- MÁSCARAS BLINDADAS (REGEX CORRIGIDO) ---
  const aplicarMascaraCNPJ = (valor) => {
    return valor
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/, '$1.$2') // Coloca ponto após os 2 primeiros números
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Coloca ponto após os 5 primeiros números
      .replace(/\.(\d{3})(\d)/, '.$1/$2') // Coloca a barra após os 8 primeiros números
      .replace(/(\d{4})(\d)/, '$1-$2') // Coloca o traço após os 12 primeiros números
      .substring(0, 18); // Limita ao tamanho máximo do CNPJ formatado
  };

  const aplicarMascaraCEP = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const aplicarMascaraTelefone = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  // --- BUSCA CEP AUTOMÁTICA ---
  const buscarCEP = async (cepLimpo) => {
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            endereco: data.logradouro,
            cidade: data.localidade,
            estado: data.uf
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorFormatado = value;

    if (name === 'cnpj') valorFormatado = aplicarMascaraCNPJ(value);
    if (name === 'cep') {
      valorFormatado = aplicarMascaraCEP(value);
      buscarCEP(value.replace(/\D/g, ''));
    }
    if (name === 'telefone') valorFormatado = aplicarMascaraTelefone(value);

    setForm(prev => ({ ...prev, [name]: valorFormatado }));
  };

  const prepararEdicao = () => {
    setForm({
      razaoSocial: empresa.razao_social || '',
      nomeFantasia: empresa.nome_fantasia || '',
      cnpj: empresa.cnpj || '',
      inscricaoEstadual: empresa.inscricao_estadual || '',
      endereco: empresa.endereco || '',
      cidade: empresa.cidade || '',
      estado: empresa.estado || '',
      cep: empresa.cep || '',
      telefone: empresa.telefone || '',
      email: empresa.email || ''
    });
    setEditando(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = empresa ? await onAtualizar(empresa.id_empresa, form) : await onCadastrar(form);
    if (res?.sucesso) setEditando(false);
  };

  const inputStyle = {
    padding: '12px',
    background: '#252525',
    border: '1px solid #444',
    color: 'white',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  if (empresa && !editando) {
    return (
      <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333', marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ background: '#64ff8a22', color: '#64ff8a', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>EMPRESA ATIVA</span>
            <h2 style={{ color: 'white', margin: '10px 0 5px 0' }}>{empresa.nome_fantasia || empresa.razao_social}</h2>
            <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}><strong>CNPJ:</strong> {empresa.cnpj}</p>
            <p style={{ color: '#777', fontSize: '13px', marginTop: '5px' }}>📍 {empresa.endereco}, {empresa.cidade}-{empresa.estado}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={prepararEdicao} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
            <button onClick={() => onDeletar(empresa.id_empresa)} style={{ background: 'transparent', color: '#ff4b4b', border: '1px solid #ff4b4b', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' }}>Apagar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px', border: editando ? '1px solid #2196F3' : '1px dashed #FF9800', marginBottom: '25px' }}>
      {(!editando && !empresa) ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: '#FF9800', fontSize: '16px' }}>⚠️ Nenhuma empresa emissora configurada.</p>
          <button onClick={() => setEditando(true)} style={{ background: '#FF9800', color: 'black', border: 'none', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            + CONFIGURAR AGORA
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
          <h3 style={{ gridColumn: 'span 6', color: '#2196F3', margin: '0 0 5px 0' }}>
            {editando ? "📝 Editar Cadastro" : "🏢 Novo Cadastro de Empresa"}
          </h3>
          
          <div style={{ gridColumn: 'span 4' }}>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '4px', display: 'block' }}>RAZÃO SOCIAL</label>
            <input name="razaoSocial" required value={form.razaoSocial} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '4px', display: 'block' }}>CNPJ (Somente números)</label>
            <input name="cnpj" required value={form.cnpj} onChange={handleChange} style={inputStyle} placeholder="00.000.000/0000-00" />
          </div>

          <div style={{ gridColumn: 'span 3' }}>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '4px', display: 'block' }}>NOME FANTASIA</label>
            <input name="nomeFantasia" value={form.nomeFantasia} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 3' }}>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '4px', display: 'block' }}>INSCRIÇÃO ESTADUAL</label>
            <input name="inscricaoEstadual" value={form.inscricaoEstadual} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '4px', display: 'block' }}>CEP</label>
            <input name="cep" value={form.cep} onChange={handleChange} style={inputStyle} placeholder="00000-000" />
          </div>

          <div style={{ gridColumn: 'span 4' }}>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '4px', display: 'block' }}>ENDEREÇO</label>
            <input name="endereco" value={form.endereco} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 3' }}>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '4px', display: 'block' }}>CIDADE</label>
            <input name="cidade" value={form.cidade} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 1' }}>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '4px', display: 'block' }}>UF</label>
            <input name="estado" maxLength="2" value={form.estado} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '4px', display: 'block' }}>TELEFONE</label>
            <input name="telefone" value={form.telefone} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 6', display: 'flex', gap: '12px', marginTop: '10px' }}>
             <button type="button" onClick={() => setEditando(false)} style={{ background: '#333', color: 'white', border: 'none', padding: '15px', flex: 1, borderRadius: '8px', cursor: 'pointer' }}>CANCELAR</button>
             <button type="submit" style={{ background: '#64ff8a', color: 'black', border: 'none', padding: '15px', flex: 2, borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                {editando ? "ATUALIZAR DADOS" : "CONCLUIR CADASTRO"}
             </button>
          </div>
        </form>
      )}
    </div>
  );
};