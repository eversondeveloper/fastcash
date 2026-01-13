// hooks/useOrganizacao.js

import { useState } from 'react';

export const useOrganizacao = () => {
    // Define o estado inicial da organização.
    // Usamos 'mais_vendidos' como padrão, conforme sua última solicitação.
    const [modoOrganizacao, setModoOrganizacao] = useState('mais_vendidos');

    // Opções a serem exibidas no seletor do usuário
    const OPCOES_ORGANIZACAO = [
        { valor: 'mais_vendidos', label: 'Mais Vendidos' },
        { valor: 'alfabetica', label: 'Ordem Alfabética (Cat./Desc.)' },
        { valor: 'cadastro', label: 'Ordem de Cadastro (ID)' },
    ];

    return {
        modoOrganizacao,
        setModoOrganizacao,
        OPCOES_ORGANIZACAO,
    };
};