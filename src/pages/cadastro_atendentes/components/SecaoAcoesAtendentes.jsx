// components/SecaoAcoesAtendentes.jsx
import React from 'react';
// Importa os componentes estilizados de ação e utilitários
import { BotaoPrimario, BotaoSucesso, BotaoPerigo, Card, Badge, Flex } from '../CadastroAtendentesStyled';

// Função auxiliar para calcular duração da sessão (mantida)
const calcularDuracaoSessao = (dataAbertura) => {
  const agora = new Date();
  const abertura = new Date(dataAbertura);
  const diferenca = agora - abertura;
  
  const horas = Math.floor(diferenca / (1000 * 60 * 60));
  const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
  
  if (horas > 0) {
    return `${horas}h ${minutos}m`;
  } else {
    return `${minutos}m`;
  }
};


export const SecaoAcoesAtendentes = ({
  onNovoAtendente,
  onAbrirSessao,
  onFecharSessao,
  sessaoAtual,
  totalAtendentes
}) => {
  return (
    <Card className="secao-acoes">
      <div className="linha-superior">
        {/* Informações e Estatísticas */}
        <div className="info-resumo">
          <h3 style={{ 
            margin: '0 0 8px 0', 
            color: '#BACBD9',
            fontSize: '1.2rem'
          }}>
            📊 Resumo
          </h3>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div className="item-resumo">
              <span>Total de atendentes:</span>
              <Badge className="info">{totalAtendentes}</Badge>
            </div>

            <div className="item-resumo">
              <span>Sessão atual:</span>
              {sessaoAtual ? (
                <Badge className="sucesso">
                  🔵 Aberta - {sessaoAtual.nome_atendente}
                </Badge>
              ) : (
                <Badge className="aviso">
                  🔴 Fechada
                </Badge>
              )}
            </div>

            {sessaoAtual && (
              <div className="item-resumo">
                <span>Aberta desde:</span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: '#BACBD9',
                  fontWeight: '500'
                }}>
                  {new Date(sessaoAtual.data_abertura).toLocaleString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="botoes-acoes">
          {/* Botão Novo Atendente */}
          <BotaoPrimario
            onClick={onNovoAtendente}
            title="Cadastrar novo atendente"
            style={{ minWidth: '140px' }} // Adicionando min-width aqui
          >
            👤 Novo Atendente
          </BotaoPrimario>

          {/* Botão Abrir Sessão */}
          {!sessaoAtual && (
            <BotaoSucesso
              onClick={onAbrirSessao}
              title="Abrir nova sessão de caixa"
              style={{ minWidth: '140px' }}
            >
              💰 Abrir Sessão
            </BotaoSucesso>
          )}

          {/* Botão Fechar Sessão */}
          {sessaoAtual && (
            <BotaoPerigo
              onClick={onFecharSessao}
              title="Fechar sessão de caixa atual"
              style={{ minWidth: '140px' }}
            >
              🔒 Fechar Sessão
            </BotaoPerigo>
          )}
        </div>
      </div>

      {/* Informações Adicionais da Sessão */}
      {sessaoAtual && (
        <div className="info-sessao ativa">
          <Flex justify="space-between" align="center" wrap="wrap" gap="10px">
            <div>
              <strong style={{ color: '#BACBD9' }}>💰 Sessão em Andamento</strong>
              <div style={{ marginTop: '5px', color: '#64ff8a' }}>
                <strong>Atendente:</strong> {sessaoAtual.nome_atendente} 
                <span style={{ marginLeft: '15px' }}>
                  <strong>Valor Inicial:</strong> R$ {parseFloat(sessaoAtual.valor_inicial || 0).toFixed(2)}
                </span>
                <span style={{ marginLeft: '15px' }}>
                  <strong>Duração:</strong> {calcularDuracaoSessao(sessaoAtual.data_abertura)}
                </span>
              </div>
            </div>
            
            {/* Botão Fechar Sessão (Repetição na linha de info) */}
            <BotaoPerigo
              onClick={onFecharSessao}
              style={{ 
                padding: '6px 12px',
                fontSize: '0.8rem',
                minWidth: 'auto'
              }}
            >
              🔒 Finalizar Sessão
            </BotaoPerigo>
          </Flex>
        </div>
      )}

      {/* Aviso quando não há sessão */}
      {!sessaoAtual && (
        <div className="info-sessao inativa">
          <Flex align="center" gap="10px">
            <span style={{ fontSize: '1.2rem', color: '#FF9800' }}>⚠️</span>
            <div>
              <strong style={{ color: '#BACBD9' }}>Nenhuma sessão de caixa aberta</strong>
              <div style={{ marginTop: '2px', color: '#FF9800' }}>
                Para registrar vendas, é necessário abrir uma sessão de caixa
              </div>
            </div>
          </Flex>
        </div>
      )}
    </Card>
  );
};