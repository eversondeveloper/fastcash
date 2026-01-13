// hooks/useDragReorder.js
import { useState, useCallback } from 'react';

export const useArrastaSolta = (produtos, setProdutos) => {
    // Estado para armazenar o ID do produto que está sendo arrastado
    const [arrastandoId, setArrastandoId] = useState(null); 

    // Inicia o processo de arrastar, armazenando o ID e transferindo o dado
    const handleDragStart = useCallback((e, id) => {
        setArrastandoId(id);
        e.dataTransfer.setData("text/plain", id); 
    }, []);

    // Permite que a célula se torne um alvo válido para soltar (drop target)
    const handleDragOver = useCallback((e) => {
        e.preventDefault(); 
        if (arrastandoId) {
            // Adiciona classe de feedback visual (estilo CSS 'arrastando-sobre')
            e.currentTarget.classList.add('arrastando-sobre');
        }
    }, [arrastandoId]);

    // Remove o feedback visual ao sair da área
    const handleDragLeave = useCallback((e) => {
        e.currentTarget.classList.remove('arrastando-sobre');
    }, []);

    // Processa a soltura e reordena o array de produtos
    const handleDrop = useCallback((e, targetId) => {
        e.preventDefault();
        e.currentTarget.classList.remove('arrastando-sobre');
        
        const sourceId = arrastandoId; 
        
        // Se soltou no próprio elemento ou fora de um alvo válido, não faz nada
        if (sourceId === targetId || !sourceId) return;

        const produtosCopy = [...produtos];
        const arrastadoIndex = produtosCopy.findIndex(p => p.id_produto === sourceId);
        const alvoIndex = produtosCopy.findIndex(p => p.id_produto === targetId);

        if (arrastadoIndex === -1 || alvoIndex === -1) return;

        // Move o item de posição (splice para remover e splice para inserir)
        const [produtoArrastado] = produtosCopy.splice(arrastadoIndex, 1);
        produtosCopy.splice(alvoIndex, 0, produtoArrastado);

        // Atualiza o estado da lista no hook useProdutos
        setProdutos(produtosCopy);
        setArrastandoId(null);
    }, [arrastandoId, produtos, setProdutos]); // Depende de produtos e setProdutos do hook useProdutos

    return {
        arrastandoId,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    };
};