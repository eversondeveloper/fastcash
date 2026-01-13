import { useEffect } from "react"; 

export const useAtalhos = ({
  podeFinalizarVenda,
  finalizarVenda, 
  cancelarVenda,
  produtosSelecionados,
  removerProduto,
  limparFiltros,
  alternarMetodoPagamento,
  inputFiltroBuscaRef,
}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // F2 sempre alterna o método, independente de onde o foco está
      if (event.key === "F2") {
        event.preventDefault();
        alternarMetodoPagamento?.();
        return; 
      }

      const elementoAtivo = document.activeElement;
      // Melhorada a detecção de input para capturar variações do navegador
      const ehInput = elementoAtivo.tagName === "INPUT" || elementoAtivo.tagName === "TEXTAREA";

      if (ehInput && event.key === "Enter") {
        // 1. Carrinho -> Pula para Pagamento
        if (elementoAtivo.className.includes("input-quantidade-campo")) {
          event.preventDefault();
          elementoAtivo.blur();
          setTimeout(() => {
            const inputDinheiro = document.querySelector(".valorrecebido");
            const primeiroMisto = document.querySelector(".input-misto-valor");
            const alvo = inputDinheiro || primeiroMisto;
            if (alvo) {
              alvo.focus();
              alvo.select(); // Já deixa selecionado para facilitar a troca
            }
          }, 50);
          return;
        }

        // 2. Navegação Circular no Pagamento Misto
        if (elementoAtivo.className.includes("input-misto-valor")) {
          event.preventDefault();
          const todosInputsMistos = Array.from(document.querySelectorAll(".input-misto-valor"));
          const indexAtual = todosInputsMistos.indexOf(elementoAtivo);

          if (indexAtual !== -1 && indexAtual < todosInputsMistos.length - 1) {
            const proximo = todosInputsMistos[indexAtual + 1];
            proximo.focus();
            proximo.select(); 
            return;
          } 
          
          if (indexAtual === todosInputsMistos.length - 1) {
            if (podeFinalizarVenda) {
              finalizarVenda();
            } else {
              const primeiro = todosInputsMistos[0];
              primeiro.focus();
              primeiro.select();
            }
            return;
          }
        }

        // 3. Pagamento em Dinheiro Único
        if (elementoAtivo.className.includes("valorrecebido")) {
          event.preventDefault(); // Previne comportamento padrão do form
          if (podeFinalizarVenda) {
            finalizarVenda();     
          } else {
            // Se não puder finalizar, apenas seleciona o texto para correção
            elementoAtivo.select();
          }
          return;
        }
      }

      // Atalhos Globais
      if (event.key === "Enter" && podeFinalizarVenda && !ehInput) {
        event.preventDefault();
        finalizarVenda();
      } else if (event.key === "Escape") {
        event.preventDefault();
        produtosSelecionados.length > 0 ? cancelarVenda() : limparFiltros();
      } else if (event.key === " ") {
        // Só foca na busca se não estiver digitando em nenhum outro input
        if (!ehInput) {
          event.preventDefault();
          inputFiltroBuscaRef.current?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
    
    // Adicionado inputFiltroBuscaRef às dependências
  }, [podeFinalizarVenda, finalizarVenda, cancelarVenda, produtosSelecionados, removerProduto, limparFiltros, alternarMetodoPagamento, inputFiltroBuscaRef]);
};