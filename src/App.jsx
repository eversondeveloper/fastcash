import { useState, useEffect, useCallback } from "react";
import { AppStyled } from "./AppStyled";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Relatorios } from "./pages/relatorio_vendas/Relatorios";
import { Produtos } from "./pages/cadastro_produtos/Produtos";
import { GerarCupom } from "./pages/gerar_cupom/GerarCupom";
import ComponenteVendas2 from "./pages/pdv/ComponenteVendas";
import { CadastroAtendentes } from "./pages/cadastro_atendentes/CadastroAtendentes";
import { useAtendentes } from "./pages/cadastro_atendentes/hooks/useAtendentes";
import { useSessoesCaixa } from "./pages/cadastro_atendentes/hooks/useSessoesCaixa";

const dataAnooAtual = new Date().getFullYear();

function App() {
  const URL_API_EMPRESAS = "http://localhost:3000/empresas";
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [carregandoSistema, setCarregandoSistema] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [statusSom] = useState(false);

  const { atendentes, buscarAtendentes } = useAtendentes();
  const { sessaoAtual, buscarSessaoAtual } = useSessoesCaixa();

  // Função de busca de empresa memorizada para evitar loops
  const carregarDadosEmpresa = useCallback(async () => {
    try {
      const resposta = await fetch(URL_API_EMPRESAS);
      if (!resposta.ok) throw new Error("Erro API");
      const dados = await resposta.json();
      
      if (dados && dados.length > 0) {
        setEmpresaSelecionada(dados[0]);
      } else {
        setEmpresaSelecionada(null);
      }
    } catch (erro) {
      console.error("Erro ao carregar empresas:", erro);
      setEmpresaSelecionada(null);
    } finally {
      setCarregandoSistema(false);
    }
  }, []);

  // Efeito inicial e sincronização global
  useEffect(() => {
    const inicializarSistema = async () => {
      await carregarDadosEmpresa();
      await buscarAtendentes();
      await buscarSessaoAtual();
    };
    
    inicializarSistema();
  }, [carregarDadosEmpresa, buscarAtendentes, buscarSessaoAtual]);

  const fecharMenu = () => setMenuAberto(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setMenuAberto(!menuAberto);
  };

  // Verificação de segurança para o PDV
  const temAtendentes = atendentes && atendentes.length > 0;

  // Enquanto o App decide se existe empresa ou não, mostramos uma tela neutra
  if (carregandoSistema) {
    return <div style={{ background: '#1e1e1e', height: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sincronizando sistema...</div>;
  }

  return (
    <AppStyled>
      <header>
        <div className="logomenu">
          <Link to="/everscash/" className="logo" onClick={fecharMenu}>
            EversCash
          </Link>

          {empresaSelecionada && (
            <div className="nomeempresa">
              <div className="nome-empresa-texto">
                {empresaSelecionada.nome_fantasia || empresaSelecionada.razao_social}
              </div>
              
              {sessaoAtual && (
                <div className="nome-atendente-header">
                  <span>| Operador:</span> <strong>{sessaoAtual.nome_atendente}</strong>
                </div>
              )}
            </div>
          )}

          <nav className={`menu-flutuante ${menuAberto ? 'ativo' : ''}`}>
            <button 
              className="menuButton" 
              onClick={toggleMenu}
              aria-expanded={menuAberto}
              type="button"
            >
              {menuAberto ? "✕" : "☰"}
            </button>

            <ul className={`menuItems ${menuAberto ? 'visivel' : 'oculto'}`}>
              <li><Link to="/everscash/" className="btns" onClick={fecharMenu}>PDV</Link></li>
              <li><Link to="/everscash/relatorios" className="btns" onClick={fecharMenu}>Vendas</Link></li>
              <li><Link to="/everscash/produtos" className="btns" onClick={fecharMenu}>Produtos</Link></li>
              <li><Link to="/everscash/gerarcupom" className="btns" onClick={fecharMenu}>Cupom</Link></li>
              <li><Link to="/everscash/atendentes_sessao" className="btns" onClick={fecharMenu}>Atendentes/Sessão</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main onClick={fecharMenu}>
        <Routes>
          <Route 
            path="/everscash/" 
            element={
              <ComponenteVendas2 
                somStatus={statusSom} 
                sessaoAtual={sessaoAtual} 
                temAtendentes={temAtendentes}
                // Passamos a empresa selecionada para garantir que o PDV a reconheça
                empresaGlobal={empresaSelecionada} 
              />
            } 
          />
          
          <Route path="/everscash/relatorios" element={<Relatorios empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
          <Route path="/everscash/produtos" element={<Produtos $empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
          <Route path="/everscash/gerarcupom" element={<GerarCupom empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
          <Route path="/everscash/atendentes_sessao" element={<CadastroAtendentes empresaSelecionada={empresaSelecionada} somStatus={statusSom} onAtualizarEmpresa={carregarDadosEmpresa} />} />
          
          <Route path="*" element={<Navigate to="/everscash/" />} />
        </Routes>
      </main>

      <footer>
        <div className="footer">
          <p>© Everscript {dataAnooAtual} - Todos os direitos reservados</p>
        </div>
      </footer>
    </AppStyled>
  );
}

export default App;