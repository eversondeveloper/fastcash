import React from 'react';
import { TabelaContainer, Badge, Flex, BotaoSecundario, BotaoPerigo, BotaoSucesso } from '../CadastroAtendentesStyled';

export const TabelaAtendentes = ({ 
  atendentes, 
  carregando, 
  sessaoAtual, 
  onEditarAtendente, 
  onDeletarAtendente, 
  onAbrirSessao 
}) => {
  if (atendentes.length === 0 && !carregando) {
    return (
      <TabelaContainer>
        <div style={{ padding: '40px', textAlign: 'center', color: '#A0A0A0' }}>
          <h3>Nenhum atendente encontrado</h3>
          <p>Cadastre o primeiro atendente para começar</p>
        </div>
      </TabelaContainer>
    );
  }

  return (
    <TabelaContainer>
      <table className="tabela-atendentes">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Atendente</th>
            <th style={{ width: '30%' }}>Contato</th>
            <th style={{ width: '15%' }}>Status</th>
            <th style={{ width: '15%' }}>Sessão</th>
            <th className="celula-acao">Ações</th>
          </tr>
        </thead>
        
        <tbody>
          {atendentes.map((atendente) => {
            // Verifica se este atendente específico é o dono da sessão ativa
            const temSessaoAberta = sessaoAtual?.id_atendente === atendente.id_atendente;
            
            // Lógica de Negócio:
            // 1. Deve estar ativo no cadastro.
            // 2. Não pode ter sessão já aberta.
            // 3. O terminal não pode ter nenhuma outra sessão aberta (Trava Global).
            const podeAbrirSessao = atendente.ativo && !temSessaoAberta && !sessaoAtual; 

            return (
              <tr key={atendente.id_atendente} style={{ opacity: atendente.ativo ? 1 : 0.6 }}>
                <td>
                  <div>
                    <div style={{ fontWeight: '600', color: '#E0E0E0', marginBottom: '4px' }}>
                      {atendente.nome}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>
                      ID: {atendente.id_atendente}
                    </div>
                  </div>
                </td>

                <td>
                  <div>
                    <div style={{ marginBottom: '4px', color: '#E0E0E0' }}>{atendente.email}</div>
                    {atendente.telefone && (
                      <div style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>📞 {atendente.telefone}</div>
                    )}
                    {atendente.cpf && (
                      <div style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>🆔 {atendente.cpf}</div>
                    )}
                  </div>
                </td>

                <td>
                  <Badge className={atendente.ativo ? 'sucesso' : 'perigo'}>
                    {atendente.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <div style={{ fontSize: '0.8rem', color: '#A0A0A0', marginTop: '4px' }}>
                    Desde: {new Date(atendente.data_cadastro).toLocaleDateString('pt-BR')}
                  </div>
                </td>

                <td>
                  {temSessaoAberta ? (
                    <div>
                      <Badge className="info">Sessão Aberta</Badge>
                      <div style={{ fontSize: '0.8rem', color: '#A0A0A0', marginTop: '4px' }}>
                        Início: {new Date(sessaoAtual.data_abertura).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  ) : (
                    <Badge className="aviso" style={{ background: '#444', color: '#888' }}>
                      Offline
                    </Badge>
                  )}
                </td>

                <td className="celula-acao">
                  <Flex gap="8px" justify="center" wrap="wrap">
                    <BotaoSecundario onClick={() => onEditarAtendente(atendente)} title="Editar">
                      ✏️ Editar
                    </BotaoSecundario>

                    {podeAbrirSessao && (
                      <BotaoSucesso onClick={() => onAbrirSessao(atendente.id_atendente)} title="Abrir Caixa">
                        💰 Abrir Caixa
                      </BotaoSucesso>
                    )}

                    {!temSessaoAberta && (
                      <BotaoPerigo onClick={() => onDeletarAtendente(atendente.id_atendente, atendente.nome)} title="Remover">
                        🗑️ Deletar
                      </BotaoPerigo>
                    )}

                    {temSessaoAberta && (
                      <span style={{ fontSize: '0.7rem', color: '#E53935', fontStyle: 'italic' }}>
                        Em operação
                      </span>
                    )}
                  </Flex>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {carregando && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#FF9800' }}>
          Atualizando lista...
        </div>
      )}
    </TabelaContainer>
  );
};