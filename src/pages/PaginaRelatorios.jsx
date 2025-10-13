import React, { useState, useEffect, useMemo } from 'react';
import { RelatoriosStyled, TabelaVendas } from './RelatoriosStyled';

const URL_API_VENDAS = 'http://localhost:3000/vendas';
const URL_API_DELETAR_EM_MASSA = 'http://localhost:3000/vendas/deletar-periodo';

export const PaginaRelatorios = () => {
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const [filtroDataInicio, setFiltroDataInicio] = useState('');
    const [filtroDataFim, setFiltroDataFim] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    const buscarVendas = async () => {
        setCarregando(true);
        setErro(null);
        try {
            const resposta = await fetch(URL_API_VENDAS);
            
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            const dados = await resposta.json();
            setVendas(dados);
        } catch (error) {
            console.error("Erro ao buscar vendas:", error);
            setErro("Erro ao carregar dados. Verifique a conexão com a API (porta 3000).");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarVendas();
    }, []);

    const vendasFiltradas = useMemo(() => {
        let listaFiltrada = vendas;

        if (filtroStatus && filtroStatus !== 'Todos') {
            listaFiltrada = listaFiltrada.filter(v => v.status_venda === filtroStatus);
        }

        if (filtroDataInicio) {
            const dataInicio = new Date(filtroDataInicio).getTime();
            listaFiltrada = listaFiltrada.filter(v => new Date(v.data_hora).getTime() >= dataInicio);
        }

        if (filtroDataFim) {
            const dataFim = new Date(filtroDataFim);
            dataFim.setHours(23, 59, 59, 999);
            const tempoFim = dataFim.getTime();
            
            listaFiltrada = listaFiltrada.filter(v => new Date(v.data_hora).getTime() <= tempoFim);
        }

        listaFiltrada.sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));

        return listaFiltrada;
    }, [vendas, filtroStatus, filtroDataInicio, filtroDataFim]);

    const totalVendasBruto = useMemo(() => {
        return vendasFiltradas.reduce((acc, venda) => 
            acc + parseFloat(venda.valor_total_bruto || 0), 0
        );
    }, [vendasFiltradas]);
    
    const limparFiltros = () => {
        setFiltroDataInicio('');
        setFiltroDataFim('');
        setFiltroStatus('Todos');
    };
    
    const processarDelecaoEmMassa = async (idsParaDeletar, mensagemSucesso) => {
        try {
            const resposta = await fetch(URL_API_DELETAR_EM_MASSA, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idsVendas: idsParaDeletar })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert(mensagemSucesso);
                buscarVendas();
            } else {
                alert(`Erro ao deletar: ${dados.mensagem || 'Falha desconhecida.'}`);
            }
        } catch (error) {
            alert("Erro de comunicação com a API ao deletar.");
        }
    };

    const deletarVendasPorId = async (idVenda) => {
        if (!window.confirm(`Tem certeza que deseja deletar a Venda ID: ${idVenda}?`)) return;

        try {
            const resposta = await fetch(`${URL_API_VENDAS}/${idVenda}`, {
                method: 'DELETE',
            });
            
            if (resposta.ok) {
                alert(`Venda ${idVenda} deletada com sucesso.`);
                buscarVendas();
            } else {
                const erroDados = await resposta.json();
                alert(`Erro ao deletar: ${erroDados.mensagem || 'Falha desconhecida.'}`);
            }
        } catch (error) {
            alert("Erro de comunicação com a API ao deletar.");
        }
    };

    const deletarVendasPorFiltro = async () => {
        const numVendas = vendasFiltradas.length;
        if (numVendas === 0) {
            return alert("Nenhuma venda para deletar com os filtros atuais.");
        }
        
        if (!window.confirm(`Tem certeza que deseja deletar as ${numVendas} vendas exibidas com os filtros atuais?`)) return;

        const idsParaDeletar = vendasFiltradas.map(v => v.id_venda);
        await processarDelecaoEmMassa(idsParaDeletar, `${numVendas} vendas deletadas com sucesso.`);
    };
    
    const deletarTodasVendas = async () => {
        const numTotalVendas = vendas.length;
        if (numTotalVendas === 0) return alert("Não há vendas registradas para deletar.");

        if (!window.confirm(`ATENÇÃO: Tem certeza que deseja deletar TODAS as ${numTotalVendas} vendas registradas no sistema?`)) return;
        
        const idsParaDeletar = vendas.map(v => v.id_venda);
        await processarDelecaoEmMassa(idsParaDeletar, `Todas as ${numTotalVendas} vendas foram deletadas.`);
    };

    if (carregando) {
        return <RelatoriosStyled><h1>Carregando Vendas...</h1></RelatoriosStyled>;
    }

    if (erro) {
        return <RelatoriosStyled><h1 style={{ color: 'red' }}>{erro}</h1></RelatoriosStyled>;
    }

    const SecaoFiltros = (
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', padding: '15px', border: '1px solid #3b3b3b', borderRadius: '8px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Data Início:</label>
                <input 
                    type="date"
                    value={filtroDataInicio}
                    onChange={(e) => setFiltroDataInicio(e.target.value)}
                    style={{ padding: '8px', backgroundColor: '#1e1e1e', color: '#BACBD9', border: '1px solid #555' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Data Fim:</label>
                <input 
                    type="date"
                    value={filtroDataFim}
                    onChange={(e) => setFiltroDataFim(e.target.value)}
                    style={{ padding: '8px', backgroundColor: '#1e1e1e', color: '#BACBD9', border: '1px solid #555' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Status:</label>
                <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    style={{ padding: '8px', backgroundColor: '#1e1e1e', color: '#BACBD9', border: '1px solid #555' }}
                >
                    <option value="Todos">Todos</option>
                    <option value="Finalizada">Finalizada</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
            </div>
            <button 
                onClick={limparFiltros}
                style={{ alignSelf: 'flex-end', padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
            >
                Limpar Filtros
            </button>
        </div>
    );
    
    const SecaoResumo = (
        <div style={{ backgroundColor: '#3b3b3b', padding: '15px', marginBottom: '20px', borderRadius: '8px', fontWeight: 'bold', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            Total Bruto de Vendas ({vendasFiltradas.length} Registros): 
            <span style={{ color: '#64ff8a', fontSize: '20px' }}>
                R$ {totalVendasBruto.toFixed(2).replace('.', ',')}
            </span>
        </div>
    );
    
    const SecaoDelecao = (
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginBottom: '20px', width: '100%' }}>
            <button 
                onClick={deletarVendasPorFiltro}
                disabled={vendasFiltradas.length === 0}
                style={{ padding: '10px 15px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
                Deletar Vendas Filtradas ({vendasFiltradas.length})
            </button>
            <button 
                onClick={deletarTodasVendas}
                disabled={vendas.length === 0}
                style={{ padding: '10px 15px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
                Deletar TODAS Vendas
            </button>
        </div>
    );

    return (
        <RelatoriosStyled>
            <h1>Relatório de Vendas</h1>
            
            {SecaoFiltros}
            {SecaoResumo}
            {SecaoDelecao}

            {vendasFiltradas.length === 0 ? (
                <p>Nenhuma venda encontrada com os filtros atuais.</p>
            ) : (
                <TabelaVendas>
                    <thead>
                        <tr>
                            <th>ID Venda</th>
                            <th>Data/Hora</th>
                            <th>Total Bruto</th>
                            <th>Valor Pago</th>
                            <th>Troco</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendasFiltradas.map((venda) => (
                            <tr key={venda.id_venda}>
                                <td>{venda.id_venda}</td>
                                <td>{new Date(venda.data_hora).toLocaleString('pt-BR')}</td>
                                <td>R$ {parseFloat(venda.valor_total_bruto).toFixed(2).replace('.', ',')}</td>
                                <td>R$ {parseFloat(venda.valor_pago_total).toFixed(2).replace('.', ',')}</td>
                                <td>R$ {parseFloat(venda.valor_troco).toFixed(2).replace('.', ',')}</td>
                                <td>{venda.status_venda}</td>
                                <td>
                                    <button 
                                        onClick={() => deletarVendasPorId(venda.id_venda)}
                                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </TabelaVendas>
            )}
        </RelatoriosStyled>
    );
};