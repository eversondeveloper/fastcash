import React, { useState, useEffect } from 'react';
import { CadastroAtendentesStyled } from './CadastroAtendentesStyled';
import { useAtendentes } from './hooks/useAtendentes';
import { useSessoesCaixa } from './hooks/useSessoesCaixa';
import { useFiltrosAtendentes } from './hooks/useFiltrosAtendentes'; 
import { useEmpresa } from './hooks/useEmpresa';
import { SecaoEmpresa } from './components/SecaoEmpresa'; 
import { SecaoFiltrosAtendentes } from './components/SecaoFiltrosAtendentes';
import { SecaoAcoesAtendentes } from './components/SecaoAcoesAtendentes';
import { TabelaAtendentes } from './components/TabelaAtendentes';
import { ModalAtendente } from './components/ModalAtendente';
import { ModalSessaoCaixa } from './components/ModalSessaoCaixa';

export const CadastroAtendentes = () => {
  const {
    atendentes: atendentesBase,
    carregando: carregandoAtendentes,
    criarAtendente,
    atualizarAtendente,
    deletarAtendente,
    buscarAtendentes
  } = useAtendentes();

  const { sessaoAtual, abrirSessaoCaixa, fecharSessaoCaixa } = useSessoesCaixa();
  const { empresa, carregandoEmpresa, cadastrarEmpresa, atualizarEmpresa, deletarEmpresa } = useEmpresa();

  const {
    filtroNome,
    setFiltroNome,
    filtroAtivo,
    setFiltroAtivo,
    atendentesFiltrados,
    handleLimparFiltros
  } = useFiltrosAtendentes(atendentesBase || []); 

  const [mostrarModalAtendente, setMostrarModalAtendente] = useState(false);
  const [mostrarModalSessao, setMostrarModalSessao] = useState(false);
  const [atendenteEditando, setAtendenteEditando] = useState(null);
  const [atendenteSelecionadoParaSessao, setAtendenteSelecionadoParaSessao] = useState(null);

  useEffect(() => {
    if (empresa) {
      buscarAtendentes();
    }
  }, [buscarAtendentes, empresa]);

  const handleSalvarAtendente = async (dadosAtendente) => {
    // Garante que o id_empresa seja passado corretamente
    const idEmpresaFinal = empresa?.id_empresa || empresa?.id;
    
    const resultado = atendenteEditando 
      ? await atualizarAtendente(atendenteEditando.id_atendente, dadosAtendente)
      : await criarAtendente(dadosAtendente, idEmpresaFinal);

    if (resultado.sucesso) {
      setMostrarModalAtendente(false);
      setAtendenteEditando(null);
      await buscarAtendentes(); 
    } else {
      alert(resultado.erro || "Erro ao salvar atendente.");
    }
  };

  const handleDeletarAtendente = async (id) => {
    const resultado = await deletarAtendente(id);
    if (resultado.sucesso) {
      await buscarAtendentes();
    } else {
      alert(resultado.erro || "Não foi possível excluir o atendente.");
    }
  };

  const handleAbrirSessao = async (atendenteId, valorInicial = 0) => {
    const idEmpresaFinal = empresa?.id_empresa || empresa?.id;
    const resultado = await abrirSessaoCaixa({ 
      id_atendente: atendenteId, 
      valor_inicial: valorInicial,
      id_empresa: idEmpresaFinal // Enviando para bater com a nova regra do consultas.js
    });

    if (resultado.sucesso) {
      setMostrarModalSessao(false);
      setAtendenteSelecionadoParaSessao(null);
    } else {
      alert(resultado.erro || "Erro ao abrir sessão.");
    }
  };

  if (carregandoEmpresa) return <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Sincronizando configurações...</div>;

  if (!empresa) {
    return (
      <CadastroAtendentesStyled>
        <div className="cabecalho"><h1>Configuração Obrigatória</h1></div>
        <div className="container-bloqueio-caixa">
          <div className="card-bloqueio" style={{ border: '2px solid #FF9800', padding: '30px', background: '#2d2d2d', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ color: '#FF9800' }}>🏢 Empresa não identificada</h2>
            <p style={{ margin: '15px 0' }}>Cadastre os dados da empresa antes de gerenciar operadores.</p>
            <SecaoEmpresa empresa={null} onCadastrar={cadastrarEmpresa} />
          </div>
        </div>
      </CadastroAtendentesStyled>
    );
  }

  return (
    <CadastroAtendentesStyled>
      <div className="cabecalho">
        <h1>Gestão de Operadores e Caixa</h1>
      </div>

      <SecaoEmpresa 
        empresa={empresa}
        onCadastrar={cadastrarEmpresa}
        onAtualizar={atualizarEmpresa}
        onDeletar={deletarEmpresa}
      />

      <div className="secao-filtros">
        <SecaoFiltrosAtendentes
          filtroNome={filtroNome}
          setFiltroNome={setFiltroNome}
          filtroAtivo={filtroAtivo}
          setFiltroAtivo={setFiltroAtivo}
          onLimparFiltros={handleLimparFiltros}
        />
      </div>

      <div className="secao-acoes">
        <SecaoAcoesAtendentes
          onNovoAtendente={() => { setAtendenteEditando(null); setMostrarModalAtendente(true); }}
          onAbrirSessao={() => { setAtendenteSelecionadoParaSessao(null); setMostrarModalSessao(true); }}
          onFecharSessao={async (vFinal) => {
             const res = await fecharSessaoCaixa(sessaoAtual.id_sessao, { valor_final: vFinal });
             if (!res.sucesso) alert(res.erro);
          }}
          sessaoAtual={sessaoAtual}
          totalAtendentes={atendentesBase?.length || 0}
        />
      </div>

      {/* CORREÇÃO: Nome da classe ajustado para o Styled Component */}
      <div className="tabela-container1">
        <h3 className="titulo-secao" style={{ margin: '0 0 15px 15px', color: '#FF9800', fontSize: '1.1rem' }}>
          📋 Operadores Cadastrados
        </h3>
        
        {atendentesFiltrados?.length > 0 ? (
          <TabelaAtendentes
            atendentes={atendentesFiltrados}
            carregando={carregandoAtendentes}
            sessaoAtual={sessaoAtual}
            onEditarAtendente={(a) => { setAtendenteEditando(a); setMostrarModalAtendente(true); }}
            onDeletarAtendente={handleDeletarAtendente}
            onAbrirSessao={(id) => { setAtendenteSelecionadoParaSessao(id); setMostrarModalSessao(true); }}
          />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', background: '#2d2d2d', borderRadius: '8px', color: '#888' }}>
            Nenhum operador encontrado.
          </div>
        )}
      </div>

      <ModalAtendente
        mostrar={mostrarModalAtendente}
        onClose={() => setMostrarModalAtendente(false)}
        atendenteEditando={atendenteEditando}
        onSalvar={handleSalvarAtendente}
      />

      <ModalSessaoCaixa
        mostrar={mostrarModalSessao}
        onClose={() => setMostrarModalSessao(false)}
        atendentes={atendentesBase || []} // Removido o filtro de 'ativo' para evitar esconder dados do banco
        onAbrirSessao={handleAbrirSessao}
        sessaoAtual={sessaoAtual}
        atendentePreSelecionado={atendenteSelecionadoParaSessao}
      />
    </CadastroAtendentesStyled>
  );
};