// hooks/useProdutos.js
import { useState, useEffect, useMemo, useCallback } from 'react';

const URL_API_PRODUTOS = 'http://localhost:3000/produtos';

export const useProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [filtroBusca, setFiltroBusca] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    
    // Estados do Modal/Formulário
    const [produtoEditando, setProdutoEditando] = useState(null); 
    const [dadosFormulario, setDadosFormulario] = useState({});
    const [exibirFormulario, setExibirFormulario] = useState(false);
    
    // Funções de Reset
    const resetarFormulario = useCallback(() => {
        setProdutoEditando(null);
        setDadosFormulario({
            categoria: '',
            descricao: '',
            preco: 0.00,
            tipoItem: 'Serviço',
            custoUnitario: 0.00,
            estoqueAtual: 0,
            codigoBarra: ''
        });
        setExibirFormulario(false);
    }, []);

    const iniciarNovoCadastro = useCallback(() => {
        resetarFormulario();
        setExibirFormulario(true);
    }, [resetarFormulario]);

    // Funções de CRUD (Create, Read, Update, Delete)
    const buscarProdutos = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            const resposta = await fetch(URL_API_PRODUTOS);
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
            
            const dados = await resposta.json();
            setProdutos(dados);
        } catch (error) {
            setErro("Erro ao carregar produtos. API fora do ar ou URL incorreta.");
        } finally {
            setCarregando(false);
        }
    }, []);

    const salvarProduto = useCallback(async (evento) => {
        evento.preventDefault();
        
        // Se a lógica 'podeSalvar' estivesse aqui, ela garantiria que o botão estava habilitado.
        // No entanto, assumimos que o botão está desabilitado se não puder salvar.
        
        const metodo = produtoEditando ? 'PATCH' : 'POST';
        const url = produtoEditando ? `${URL_API_PRODUTOS}/${produtoEditando.id_produto}` : URL_API_PRODUTOS;

        try {
            const resposta = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                // Certifica que estoqueAtual e custoUnitario são passados como números
                body: JSON.stringify({
                    ...dadosFormulario,
                    estoqueAtual: parseFloat(dadosFormulario.estoqueAtual) || 0,
                    custoUnitario: parseFloat(dadosFormulario.custoUnitario) || 0,
                }),
            });

            if (!resposta.ok) throw new Error(`Falha ao salvar. Status: ${resposta.status}`);

            alert(`Produto ${produtoEditando ? 'atualizado' : 'cadastrado'} com sucesso!`);
            resetarFormulario();
            buscarProdutos();
        } catch (error) {
            alert(`Erro ao salvar produto: ${error.message}`);
        }
    }, [produtoEditando, dadosFormulario, resetarFormulario, buscarProdutos]);

    const desativarProduto = useCallback(async (idProduto) => {
        if (!window.confirm("Tem certeza que deseja desativar este produto?")) return;

        try {
            const resposta = await fetch(`${URL_API_PRODUTOS}/${idProduto}`, {
                method: 'DELETE',
            });
            
            if (resposta.status === 200) {
                alert("Produto desativado com sucesso.");
                buscarProdutos();
            } else {
                const erroDados = await resposta.json();
                throw new Error(erroDados.mensagem || 'Falha ao desativar.');
            }
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    }, [buscarProdutos]);

    // Efeito para carregar dados iniciais e resetar o formulário no carregamento
    useEffect(() => {
        buscarProdutos();
        resetarFormulario();
    }, [buscarProdutos, resetarFormulario]);
    
    const iniciarEdicao = useCallback((produto) => {
        setProdutoEditando(produto);
        setDadosFormulario({
            categoria: produto.categoria,
            descricao: produto.descricao,
            preco: parseFloat(produto.preco),
            tipoItem: produto.tipo_item,
            custoUnitario: parseFloat(produto.custo_unitario),
            estoqueAtual: produto.estoque_atual,
            codigoBarra: produto.codigo_barra
        });
        setExibirFormulario(true);
    }, []);

    const manipularMudanca = useCallback((evento) => {
        const { name, value } = evento.target;
        // Lógica de conversão para float para campos numéricos, incluindo 'estoqueAtual' (que é int, mas float garante segurança na entrada)
        const parsedValue = (name === 'preco' || name === 'custoUnitario' || name === 'estoqueAtual') 
                           ? parseFloat(value) || 0 
                           : value;

        setDadosFormulario(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    }, []);

    const produtosFiltrados = useMemo(() => {
        const termo = filtroBusca.toLowerCase().trim();
        if (!termo) return produtos;

        return produtos.filter(produto => 
            produto.descricao.toLowerCase().includes(termo) ||
            produto.categoria.toLowerCase().includes(termo) ||
            produto.id_produto.toString().includes(termo)
        );
    }, [produtos, filtroBusca]);

    // ==========================================================
    // LÓGICA DE VALIDAÇÃO PARA HABILITAR O BOTÃO SALVAR (useMemo)
    // ==========================================================

    const isFormularioValido = useMemo(() => {
        // Valida campos obrigatórios não nulos ou zero
        return dadosFormulario.descricao &&
               dadosFormulario.categoria &&
               (dadosFormulario.preco >= 0); // Preço pode ser zero, mas não nulo/vazio
    }, [dadosFormulario]);

    const temDadosAlterados = useMemo(() => {
        if (!produtoEditando) {
            // Se for novo cadastro, o botão é habilitado se o formulário for válido.
            return isFormularioValido; 
        }

        // 1. Constrói o objeto original com os dados prontos para comparação
        const original = {
            categoria: produtoEditando.categoria,
            descricao: produtoEditando.descricao,
            preco: parseFloat(produtoEditando.preco),
            tipoItem: produtoEditando.tipo_item,
            custoUnitario: parseFloat(produtoEditando.custo_unitario),
            estoqueAtual: produtoEditando.estoque_atual,
            codigoBarra: produtoEditando.codigo_barra
        };

        // 2. Compara cada campo relevante do formulário com o original
        const houveAlteracao = Object.keys(dadosFormulario).some(key => {
            const valorForm = dadosFormulario[key];
            const valorOrig = original[key];
            
            // Tratamento especial para valores numéricos para evitar erro de float/string
            if (typeof valorForm === 'number' || typeof valorOrig === 'number') {
                // Compara valores float com uma pequena tolerância (ou apenas string/number simples)
                return String(valorForm) !== String(valorOrig);
            }

            // Compara strings
            return valorForm !== valorOrig;
        });

        return houveAlteracao;
    }, [produtoEditando, dadosFormulario, isFormularioValido]);


    // Variável final para controle do botão 'disabled'
    const podeSalvar = useMemo(() => {
        // Apenas permite salvar se o formulário for válido E houver alterações (ou se for um novo cadastro válido)
        return isFormularioValido && temDadosAlterados;
    }, [isFormularioValido, temDadosAlterados]);

    // ==========================================================


    // Lógica para fechar modal com ESC
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.keyCode === 27 && exibirFormulario) {
                resetarFormulario();
            }
        };
        
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [exibirFormulario, resetarFormulario]);

    // Lógica para prevenir scroll do body quando modal estiver aberto
    useEffect(() => {
        if (exibirFormulario) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [exibirFormulario]);

    return {
        // Estados
        produtos, setProdutos,
        filtroBusca, setFiltroBusca,
        carregando, erro,
        produtoEditando, setProdutoEditando,
        dadosFormulario,
        exibirFormulario, setExibirFormulario,
        
        // Variáveis de Habilitação
        podeSalvar, // <--- EXPORTADO PARA CONTROLAR O BOTÃO 'disabled'
        
        // Funções de CRUD/Ação
        resetarFormulario,
        iniciarNovoCadastro,
        salvarProduto,
        desativarProduto,
        iniciarEdicao,
        manipularMudanca,
        produtosFiltrados,
        buscarProdutos,
    };
};