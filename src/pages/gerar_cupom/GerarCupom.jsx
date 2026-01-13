import { GerarCupomStyled } from "./GerarCupomStyled"; 
import { useCupom } from "./hooks/useCupom";
import ControlesSelecao from "./components/ControlesSelecao";
import CupomVisualizacao from "./components/CupomVisualizacao";

export const GerarCupom = () => {
  const {
    empresas,
    vendas,
    vendaSelecionada,
    empresaSelecionada,
    detalhesVenda,
    carregando,
    erro,
    gerandoPDF,
    
    // Funções do hook
    formatarMoeda,
    handleVendaChange,
    gerarPDFCupom
  } = useCupom();

  if (carregando) {
    return (
      <GerarCupomStyled>
        <h1 style={{ color: "#BACBD9", textAlign: "center" }}>
          Carregando dados...
        </h1>
      </GerarCupomStyled>
    );
  }

  if (erro) {
    return (
      <GerarCupomStyled>
        <h1 style={{ color: "#E53935", textAlign: "center" }}>{erro}</h1>
      </GerarCupomStyled>
    );
  }

  return (
    <GerarCupomStyled>
      <h1 style={{ color: "#BACBD9", textAlign: "center", marginBottom: "20px" }}>
        Geração de Comprovante
      </h1>

      <ControlesSelecao
        empresas={empresas}
        empresaSelecionada={empresaSelecionada}
        vendas={vendas}
        vendaSelecionada={vendaSelecionada}
        handleVendaChange={handleVendaChange}
        formatarMoeda={formatarMoeda}
      />

      <CupomVisualizacao
        empresaSelecionada={empresaSelecionada}
        detalhesVenda={detalhesVenda}
        formatarMoeda={formatarMoeda}
        gerarPDFCupom={gerarPDFCupom}
        gerandoPDF={gerandoPDF}
      />
    </GerarCupomStyled>
  );
};