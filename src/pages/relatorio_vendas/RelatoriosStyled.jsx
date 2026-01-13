import styled from 'styled-components';

// Paleta Minimalista:
// Primário/Fundo: #1e1e1e
// Secundário/Card: #2d2d2d
// Texto Principal: #E0E0E0
// Destaque (Ação/Primário): #FF9800
// Destaque (Sucesso): #64ff8a
// Destaque (Erro/Perigo): #E53935

export const RelatoriosStyled = styled.div`
    width: 98%;
    height: 100%;
    margin: 20px auto;
    padding: 25px;
    background-color: #1e1e1e; /* Ultra escuro */
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6); /* Sombra mais profunda */
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    color: #E0E0E0;

    h1 {
        margin-bottom: 30px;
        color: #E0E0E0;
        font-size: 32px;
        font-weight: 300;
    }

    p {
        color: #A0A0A0;
        font-size: 16px;
    }

    /* ====================================================================
       ESTILOS PARA O NOVO CABEÇALHO DA EMPRESA (SecaoResumo)
    ==================================================================== */
    .cabecalho-empresa {
        padding-bottom: 15px;
        border-bottom: 1px solid #333;
        margin-bottom: 25px;
        width: 100%;

        h2 {
            font-size: 20px;
            color: #E0E0E0;
            font-weight: 500;
        }
        
        .titulo-relatorio {
            font-weight: bold;
            font-size: 16px;
            color: #2196F3;
            margin-top: 10px;
        }

        .periodo-relatorio {
            font-size: 14px;
            color: #A0A0A0;
            margin-top: 5px;
        }
    }

    /* ====================================================================
       SEÇÕES
    ==================================================================== */

    /* Seção de Filtros */
    .secao-filtros {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 30px;
        padding: 20px;
        background-color: #2d2d2d;
        border-radius: 8px;
        width: 100%;

        .filtro-datas {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            min-width: 180px;

            label {
                color: #E0E0E0;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 300;
            }

            input, textarea {
                padding: 10px;
                background-color: #1e1e1e;
                color: #E0E0E0;
                border: 1px solid #444;
                border-radius: 4px;
                font-size: 14px;

                &:focus {
                    outline: none;
                    border-color: #FF9800;
                }
            }
        }

        .filtro-metodos {
            border-top: 1px solid #444;
            padding-top: 15px;

            .metodos-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;

                label {
                    font-weight: 500;
                    color: #E0E0E0;
                    font-size: 15px;
                }
            }
        }

        .acoes-filtros {
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            padding-top: 10px;
            border-top: 1px solid #444;
        }
    }

    /* ====================================================================
       NOVA SEÇÃO: OBSERVAÇÕES DIÁRIAS
    ==================================================================== */
    .secao-observacoes {
        background-color: #2d2d2d;
        padding: 20px;
        margin-bottom: 30px;
        border-radius: 8px;
        width: 100%;
        border: 1px solid #333;

        .obs-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;

            h3 {
                color: #BACBD9;
                font-size: 16px;
                margin: 0;
            }
        }

        textarea {
            width: 100%;
            min-height: 120px;
            background-color: #1e1e1e;
            color: #64ff8a; /* Texto em verde neon suave para facilitar leitura */
            border: 1px solid #444;
            border-radius: 4px;
            padding: 12px;
            font-size: 14px;
            resize: vertical;
            outline: none;

            &:focus {
                border-color: #2196F3;
            }

            &::placeholder {
                color: #555;
            }
        }

        .obs-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }
    }

    /* Seção de Resumo */
    .secao-resumo {
        background-color: #2d2d2d;
        padding: 20px;
        margin-bottom: 30px;
        border-radius: 8px;
        width: 100%;
        color: #E0E0E0;

        .resumo-superior {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px dashed #444;
            flex-wrap: wrap;

            .info-filtros {
                .filtros-ativos {
                    font-size: 13px;
                    color: #A0A0A0;
                    margin-bottom: 10px;
                }
            }

            .totais-rapidos {
                display: flex;
                gap: 30px;
                flex-wrap: wrap;
                font-size: 15px;
            }
        }

        .resumo-financeiro {
            border-top: 1px solid #444;
            padding-top: 15px;
            margin-top: 15px;

            .titulo-resumo {
                color: #A0A0A0;
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: 500;
            }

            .valores-resumo {
                display: flex;
                gap: 30px;
                flex-wrap: wrap;
                font-size: 15px;
            }
        }

        .totais-metodos {
            border-top: 1px solid #444;
            padding-top: 15px;
            margin-top: 15px;

            .titulo-metodos {
                color: #A0A0A0;
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: 500;
            }

            .lista-metodos {
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
                font-size: 15px;
            }
        }
    }

    /* Seção de Deleção/Ações */
    .secao-delecao {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        margin-bottom: 30px;
        width: 100%;
    }

    /* ====================================================================
       DESTAQUES E TEXTOS
    ==================================================================== */
    .destaque {
        color: #64ff8a !important; /* Sucesso */
        font-weight: bold;
    }

    .destaque-negativo {
        color: #FF9800 !important; /* Alerta/Retiradas */
        font-weight: bold;
    }

    .destaque-liquido {
        font-size: 20px;
        font-weight: bold;

        &.positivo {
            color: #64ff8a;
        }

        &.negativo {
            color: #E53935; /* Vermelho mais forte para prejuízo */
        }
    }

    /* ====================================================================
       ESTILOS PARA BOTÕES PADRÃO (Minimalista)
    ==================================================================== */

    .btn-metodo,
    .btn-limpar-metodos,
    .btn-limpar-todos,
    .btn-retirada,
    .btn-pdf,
    .btn-deletar-filtrados,
    .btn-deletar-tudo,
    .btn-salvar-obs,
    .btn-excluir-obs {
        padding: 8px 14px;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s, opacity 0.2s;
        font-size: 13px;
    }

    .btn-salvar-obs {
        background-color: #2196F3;
        color: white;
        &:hover { background-color: #1976D2; }
    }

    .btn-excluir-obs {
        background-color: transparent;
        color: #E53935;
        border: 1px solid #E53935 !important;
        &:hover { background-color: rgba(229, 57, 53, 0.1); }
    }

    /* Botões de Métodos de Pagamento */
    .btn-metodo {
        background-color: #333;
        color: #E0E0E0;
        border: 1px solid #444;

        &:hover {
            background-color: #444;
        }

        &.ativo {
            background-color: #64ff8a; /* Verde Ativo */
            color: #1e1e1e;
            font-weight: bold;
            border-color: #64ff8a;
        }
    }

    /* Botão Limpar Métodos */
    .btn-limpar-metodos {
        background-color: transparent;
        color: #A0A0A0;
        font-weight: 300;
        padding: 4px 8px;

        &:hover {
            color: #E0E0E0;
        }
    }

    /* Botão Limpar Todos os Filtros */
    .btn-limpar-todos {
        background-color: #444;
        color: #E0E0E0;

        &:hover {
            background-color: #555;
        }
    }

    /* Botões de Ação Principal */
    .btn-retirada {
        background-color: #FF9800; /* Laranja Principal */
        color: #1e1e1e;
    }

    .btn-pdf {
        background-color: #2196F3; /* Azul Info */
        color: #1e1e1e;
    }

    .btn-deletar-filtrados {
        background-color: #E53935; /* Vermelho */
        color: #1e1e1e;
    }

    .btn-deletar-tudo {
        background-color: #8E24AA; /* Roxo */
        color: #1e1e1e;
    }

    /* Estilo para Deletar/Editar na Tabela */
    .btn-deletar,
    .btn-editar {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        font-weight: 500;
        color: white;
    }

    .btn-editar {
        background-color: #2196F3;
        &:hover {
            background-color: #1976D2;
        }
    }

    .btn-deletar {
        background-color: #E53935;
        &:hover {
            background-color: #C62828;
        }
    }

    /* Estilos para Botões Desabilitados */
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    /* ====================================================================
       MODAIS E OVERLAY (CORREÇÃO DO PROBLEMA DE FOCALIZAÇÃO)
    ==================================================================== */
    .modal-overlay {
        position: fixed; /* CORREÇÃO 1: Garante que cobre a tela toda */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999; 
        padding: 20px;
        animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .modal-content {
        background-color: #2d2d2d;
        padding: 24px;
        border-radius: 8px;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        border: 1px solid #444;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        
        h3 {
            color: #E0E0E0;
            margin-top: 0;
            border-bottom: 1px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 500;
        }
    }

    .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        border-top: 1px solid #333;
        padding-top: 20px;
        margin-top: 20px;
    }
    
    .btn-primary,
    .btn-secondary {
        padding: 10px 18px;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
        border: none;
    }

    .btn-primary {
        background-color: #FF9800;
        color: #1e1e1e;
        font-weight: bold;
        &:hover { background-color: #e68900; }
    }

    .btn-secondary {
        background-color: #444;
        color: #E0E0E0;
        &:hover { background-color: #555; }
    }

`;

export const TabelaVendas = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #E0E0E0;
    font-size: 14px;
    margin-top: 20px;

    th, td {
        border-bottom: 1px solid #333;
        padding: 12px 10px;
        text-align: left;
    }
    
    th:first-child, td:first-child {
        padding-left: 0;
    }

    th {
        background-color: #2d2d2d;
        color: #A0A0A0;
        font-weight: 500;
        text-transform: uppercase;
        border-top: 1px solid #333;
    }

    tr:nth-child(even) {
        background-color: #232323;
    }

    tr:hover {
        background-color: #333;
    }

    .linha-total {
        background-color: #2d2d2d;
        font-weight: bold;
        border-top: 2px solid #64ff8a;
        
        td {
            color: #64ff8a;
            font-size: 16px;
        }
    }
    
    .label-total {
        text-align: right;
        font-weight: 500;
        color: #E0E0E0;
        font-size: 16px;
    }
`;