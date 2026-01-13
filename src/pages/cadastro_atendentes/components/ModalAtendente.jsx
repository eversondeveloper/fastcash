import React, { useState, useEffect } from 'react';
import { 
  Input, 
  Label, 
  BotaoSucesso, 
  BotaoSecundario, 
  Flex 
} from '../CadastroAtendentesStyled';

export const ModalAtendente = ({ mostrar, onClose, atendenteEditando, onSalvar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    ativo: true
  });

  // Efeito para carregar os dados caso seja edição
  useEffect(() => {
    if (atendenteEditando) {
      setFormData({
        nome: atendenteEditando.nome || '',
        email: atendenteEditando.email || '',
        telefone: atendenteEditando.telefone || '',
        cpf: atendenteEditando.cpf || '',
        ativo: atendenteEditando.ativo ?? true
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        ativo: true
      });
    }
  }, [atendenteEditando, mostrar]);

  if (!mostrar) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      alert("Nome e Email são obrigatórios!");
      return;
    }
    onSalvar(formData);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 3000
    }}>
      <div className="modal-content" style={{ 
        backgroundColor: '#2d2d2d', 
        padding: '30px', 
        borderRadius: '12px', 
        width: '500px',
        border: '1px solid #444',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <div className="modal-header" style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
          <h2 style={{ color: '#FF9800', margin: 0 }}>
            {atendenteEditando ? '✏️ Editar Atendente' : '👤 Novo Atendente'}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <Label>Nome Completo *</Label>
            <Input 
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Label>E-mail *</Label>
            <Input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@empresa.com"
              required
            />
          </div>

          <Flex gap="15px" style={{ marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <Label>Telefone</Label>
              <Input 
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>CPF *</Label>
              <Input 
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </Flex>

          {atendenteEditando && (
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="ativo"
                name="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <Label htmlFor="ativo" style={{ marginBottom: 0, cursor: 'pointer' }}>Atendente Ativo</Label>
            </div>
          )}

          <Flex justify="flex-end" gap="10px" style={{ marginTop: '20px' }}>
            <BotaoSecundario type="button" onClick={onClose}>
              Cancelar
            </BotaoSecundario>
            <BotaoSucesso type="submit">
              {atendenteEditando ? 'Atualizar Dados' : 'Cadastrar Atendente'}
            </BotaoSucesso>
          </Flex>
        </form>
      </div>
    </div>
  );
};