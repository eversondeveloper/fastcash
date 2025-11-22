import React, { useState, useEffect, useMemo } from 'react';
import { RelatoriosStyled, TabelaVendas } from './RelatoriosStyled';

const URL_API_VENDAS = 'http://localhost:3000/vendas';
const URL_API_DELETAR_EM_MASSA = 'http://localhost:3000/vendas/deletar-periodo';

export const PaginaRelatorios = (props) => {
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [gerandoPDF, setGerandoPDF] = useState(false);

    const [filtroDataInicio, setFiltroDataInicio] = useState('');
    const [filtroDataFim, setFiltroDataFim] = useState('');
    const [filtroMetodosPagamento, setFiltroMetodosPagamento] = useState([]);

    const METODOS_PAGAMENTO = ['Dinheiro', 'PIX', 'Crédito', 'Débito', 'Misto'];

    const buscarVendas = async () => {
        setCarregando(true);
        setErro(null);
        try {
            const resposta = await fetch(URL_API_VENDAS);
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

            const dados = await resposta.json();

            const vendasComDetalhes = await Promise.all(
                dados.map(async (venda) => {
                    try {
                        const respostaDetalhes = await fetch(`${URL_API_VENDAS}/${venda.id_venda}`);
                        if (respostaDetalhes.ok) {
                            const detalhes = await respostaDetalhes.json();
                            return {
                                ...venda,
                                pagamentos: detalhes.pagamentos || [],
                                itens: detalhes.itens || []
                            };
                        }
                        return venda;
                    } catch {
                        return venda;
                    }
                })
            );

            setVendas(vendasComDetalhes);
        } catch {
            setErro("Erro ao carregar dados. Verifique a conexão com a API (porta 3000).");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarVendas();
    }, []);

    const toggleMetodoPagamento = (metodo) => {
        setFiltroMetodosPagamento(prev => 
            prev.includes(metodo) 
                ? prev.filter(m => m !== metodo)
                : [...prev, metodo]
        );
    };

    const limparFiltrosMetodos = () => {
        setFiltroMetodosPagamento([]);
    };

    const vendasFiltradas = useMemo(() => {
        let lista = vendas;

        // Filtro por data
        const inicioStr = filtroDataInicio ? filtroDataInicio : null;
        const fimStr = filtroDataFim ? filtroDataFim : null;

        lista = lista.filter(v => {
            const dataVendaStr = v.data_hora.slice(0, 10);

            if (inicioStr && dataVendaStr < inicioStr) return false;
            if (fimStr && dataVendaStr > fimStr) return false;

            return true;
        });

        // Filtro por métodos de pagamento (se algum método foi selecionado)
        if (filtroMetodosPagamento.length > 0) {
            lista = lista.filter(venda => {
                // Verifica se a venda tem pelo menos um pagamento que corresponde aos métodos selecionados
                if (!venda.pagamentos || venda.pagamentos.length === 0) return false;
                
                return venda.pagamentos.some(pagamento => 
                    filtroMetodosPagamento.includes(pagamento.metodo)
                );
            });
        }

        return lista.sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
    }, [vendas, filtroDataInicio, filtroDataFim, filtroMetodosPagamento]);

    const totaisPorMetodo = useMemo(() => {
        const tot = {};
        vendasFiltradas.forEach(v => {
            if (v.pagamentos?.length) {
                v.pagamentos.forEach(p => {
                    if (!tot[p.metodo]) tot[p.metodo] = 0;
                    tot[p.metodo] += parseFloat(p.valor_pago || 0);
                });
            }
        });
        return tot;
    }, [vendasFiltradas]);

    const totalVendasBruto = useMemo(() => {
        return vendasFiltradas.reduce((acc, v) => acc + parseFloat(v.valor_total_bruto || 0), 0);
    }, [vendasFiltradas]);

    const totalValorPago = useMemo(() => {
        return vendasFiltradas.reduce((acc, v) => acc + parseFloat(v.valor_pago_total || 0), 0);
    }, [vendasFiltradas]);

    const totalTroco = useMemo(() => {
        return vendasFiltradas.reduce((acc, v) => acc + parseFloat(v.valor_troco || 0), 0);
    }, [vendasFiltradas]);

    const quantidadeVendas = vendasFiltradas.length;

    const gerarPDF = async () => {
        if (quantidadeVendas === 0) {
            alert('Não há dados para exportar com os filtros atuais.');
            return;
        }

        setGerandoPDF(true);

        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let y = 15;
            let currentPage = 1;

            const adicionarCabecalhoPagina = () => {
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(40, 40, 40);
                doc.text('Relatório de Vendas - EversCash', pageWidth / 2, y, { align: 'center' });
                y += 8;

                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                
                let periodo = 'Período: Todos os registros';
                if (filtroDataInicio || filtroDataFim) {
                    periodo = `Período: ${filtroDataInicio || 'Início'} à ${filtroDataFim || 'Fim'}`;
                }
                if (filtroMetodosPagamento.length > 0) {
                    periodo += ` | Métodos: ${filtroMetodosPagamento.join(', ')}`;
                }

                doc.text(periodo, 14, y);
                y += 4;
                doc.text(`Data de geração: ${new Date().toLocaleString('pt-BR')} | Página ${currentPage}`, 14, y);
                y += 8;

                doc.setFillColor(41, 128, 185);
                doc.rect(10, y, pageWidth - 20, 7, 'F');
                doc.setFontSize(10);
                doc.setTextColor(255, 255, 255);
                doc.text('ID', 12, y + 5);
                doc.text('Data/Hora', 25, y + 5);
                doc.text('Pagamento', 60, y + 5);
                doc.text('Total Bruto', 160, y + 5);
                doc.text('Ações', 185, y + 5);
                y += 10;
            };

            adicionarCabecalhoPagina();

            const maxLinhasPorPagina = 20;
            let linhaCount = 0;

            vendasFiltradas.forEach((venda, index) => {
                if (linhaCount >= maxLinhasPorPagina || y > pageHeight - 30) {
                    doc.addPage();
                    currentPage++;
                    y = 15;
                    linhaCount = 0;
                    adicionarCabecalhoPagina();
                }

                const metodos = venda.pagamentos || [];
                const alturaLinha = Math.max(12, metodos.length * 3 + 12);

                if (index % 2 === 0) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(10, y, pageWidth - 20, alturaLinha, 'F');
                }

                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0);

                doc.text(venda.id_venda.toString(), 12, y + 4);
                doc.text(new Date(venda.data_hora).toLocaleString('pt-BR').slice(0, 16), 25, y + 4);

                let py = y + 4;
                
                if (metodos.length > 0) {
                    metodos.forEach((pagamento, pIndex) => {
                        doc.text(`${pagamento.metodo}: R$ ${parseFloat(pagamento.valor_pago).toFixed(2)}`, 60, py);
                        py += 3;
                    });
                } else {
                    doc.text('N/A', 60, py);
                    py += 3;
                }

                doc.text(`Valor Pago: R$ ${parseFloat(venda.valor_pago_total).toFixed(2)}`, 60, py);
                py += 3;
                doc.text(`Troco: R$ ${parseFloat(venda.valor_troco).toFixed(2)}`, 60, py);
                
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(0, 100, 0);
                doc.text(`R$ ${parseFloat(venda.valor_total_bruto).toFixed(2)}`, 160, y + 8);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 0);
                doc.text('Deletar', 185, y + 8);

                y += alturaLinha;
                linhaCount++;
            });

            const adicionarRodape = () => {
                if (y > pageHeight - 50) {
                    doc.addPage();
                    currentPage++;
                    y = 15;
                    adicionarCabecalhoPagina();
                }

                doc.setFillColor(46, 204, 113);
                doc.rect(10, y, pageWidth - 20, 8, 'F');
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(255, 255, 255);
                doc.text(`TOTAL GERAL (${quantidadeVendas} vendas):`, 12, y + 6);
                doc.text(`R$ ${totalVendasBruto.toFixed(2)}`, 160, y + 6);
                y += 12;

                doc.setTextColor(0, 0, 0);
                doc.text('Resumo Financeiro:', 12, y);
                y += 6;
                doc.setFont('helvetica', 'normal');
                doc.text(`• Valor Bruto Total: R$ ${totalVendasBruto.toFixed(2)}`, 12, y);
                y += 5;
                doc.text(`• Valor Recebido Total: R$ ${totalValorPago.toFixed(2)}`, 12, y);
                y += 5;
                doc.text(`• Troco Total: R$ ${totalTroco.toFixed(2)}`, 12, y);
                y += 8;

                if (Object.keys(totaisPorMetodo).length > 0) {
                    doc.setFont('helvetica', 'bold');
                    doc.text('Totais por Método de Pagamento:', 12, y);
                    doc.setFont('helvetica', 'normal');
                    y += 6;

                    Object.entries(totaisPorMetodo).forEach(([metodo, total]) => {
                        if (y > pageHeight - 10) {
                            doc.addPage();
                            currentPage++;
                            y = 15;
                            adicionarCabecalhoPagina();
                            doc.setFont('helvetica', 'normal');
                            doc.text('Totais por Método de Pagamento (cont.):', 12, y);
                            y += 6;
                        }
                        doc.text(`• ${metodo}: R$ ${total.toFixed(2)}`, 12, y);
                        y += 5;
                    });
                }
            };

            adicionarRodape();

            const nomeArquivo = `relatorio_vendas_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(nomeArquivo);

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF. Verifique o console para mais detalhes.');
        } finally {
            setGerandoPDF(false);
        }
    };

    const limparFiltros = () => {
        setFiltroDataInicio('');
        setFiltroDataFim('');
        setFiltroMetodosPagamento([]);
    };

    const processarDelecaoEmMassa = async (ids, msg) => {
        try {
            const resp = await fetch(URL_API_DELETAR_EM_MASSA, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idsVendas: ids })
            });

            const dados = await resp.json();

            if (resp.ok) {
                alert(msg);
                buscarVendas();
            } else {
                alert(dados.mensagem || 'Falha desconhecida.');
            }
        } catch {
            alert("Erro de comunicação com a API ao deletar.");
        }
    };

    const deletarVendasPorId = async (id) => {
        if (!window.confirm(`Tem certeza que deseja deletar a Venda ID: ${id}?`)) return;

        try {
            const resp = await fetch(`${URL_API_VENDAS}/${id}`, { method: 'DELETE' });
            if (resp.ok) {
                alert(`Venda ${id} deletada com sucesso.`);
                buscarVendas();
            } else {
                const dados = await resp.json();
                alert(dados.mensagem || 'Falha desconhecida.');
            }
        } catch {
            alert("Erro de comunicação com a API ao deletar.");
        }
    };

    const deletarVendasPorFiltro = async () => {
        if (quantidadeVendas === 0) return alert("Nenhuma venda para deletar com os filtros atuais.");

        const filtrosAtivos = [];
        if (filtroDataInicio || filtroDataFim) filtrosAtivos.push('período selecionado');
        if (filtroMetodosPagamento.length > 0) filtrosAtivos.push(`métodos: ${filtroMetodosPagamento.join(', ')}`);

        const mensagemFiltros = filtrosAtivos.length > 0 
            ? ` com os filtros: ${filtrosAtivos.join(', ')}`
            : '';

        if (!window.confirm(`Tem certeza que deseja deletar as ${quantidadeVendas} vendas${mensagemFiltros}?`)) return;

        const ids = vendasFiltradas.map(v => v.id_venda);
        await processarDelecaoEmMassa(ids, `${quantidadeVendas} vendas deletadas com sucesso.`);
    };

    const deletarTodasVendas = async () => {
        const total = vendas.length;
        if (total === 0) return alert("Não há vendas registradas.");

        if (!window.confirm(`ATENÇÃO: Deseja deletar TODAS as ${total} vendas?`)) return;

        const ids = vendas.map(v => v.id_venda);
        await processarDelecaoEmMassa(ids, `Todas as ${total} vendas foram deletadas.`);
    };

    if (carregando) {
        return <RelatoriosStyled><h1>Carregando Vendas...</h1></RelatoriosStyled>;
    }

    if (erro) {
        return <RelatoriosStyled><h1 style={{ color: 'red' }}>{erro}</h1></RelatoriosStyled>;
    }

    const SecaoFiltros = (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '15px', 
            marginBottom: '25px', 
            padding: '15px', 
            border: '1px solid #3b3b3b', 
            borderRadius: '8px', 
            width: '100%' 
        }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
                    <label>Data Início:</label>
                    <input 
                        type="date"
                        value={filtroDataInicio}
                        onChange={(e) => setFiltroDataInicio(e.target.value)}
                        style={{ padding: '8px', backgroundColor: '#1e1e1e', color: '#BACBD9', border: '1px solid #555' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
                    <label>Data Fim:</label>
                    <input 
                        type="date"
                        value={filtroDataFim}
                        onChange={(e) => setFiltroDataFim(e.target.value)}
                        style={{ padding: '8px', backgroundColor: '#1e1e1e', color: '#BACBD9', border: '1px solid #555' }}
                    />
                </div>
            </div>

            <div style={{ borderTop: '1px solid #555', paddingTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <label style={{ fontWeight: 'bold', color: '#BACBD9' }}>Métodos de Pagamento:</label>
                    {filtroMetodosPagamento.length > 0 && (
                        <button 
                            onClick={limparFiltrosMetodos}
                            style={{ 
                                padding: '4px 8px', 
                                backgroundColor: '#6c757d', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '3px',
                                fontSize: '12px'
                            }}
                        >
                            Limpar Métodos
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {METODOS_PAGAMENTO.map(metodo => (
                        <button
                            key={metodo}
                            type="button"
                            onClick={() => toggleMetodoPagamento(metodo)}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: filtroMetodosPagamento.includes(metodo) ? '#4CAF50' : '#333',
                                color: 'white',
                                border: `1px solid ${filtroMetodosPagamento.includes(metodo) ? '#45a049' : '#555'}`,
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: filtroMetodosPagamento.includes(metodo) ? 'bold' : 'normal'
                            }}
                        >
                            {metodo}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                    onClick={limparFiltros}
                    style={{ 
                        padding: '8px 15px', 
                        backgroundColor: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px' 
                    }}
                >
                    Limpar Todos os Filtros
                </button>
            </div>
        </div>
    );
    
    const SecaoResumo = (
        <div style={{ backgroundColor: '#3b3b3b', padding: '15px', marginBottom: '20px', borderRadius: '8px', fontWeight: 'bold', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                    <div style={{ fontSize: '14px', color: '#BACBD9', marginBottom: '5px' }}>
                        Filtros Ativos: 
                        {filtroDataInicio || filtroDataFim ? ` Período ${filtroDataInicio || ''} ${filtroDataFim ? 'à ' + filtroDataFim : ''}` : ' Todos os dias'}
                        {filtroMetodosPagamento.length > 0 ? ` | Métodos: ${filtroMetodosPagamento.join(', ')}` : ''}
                    </div>
                    Total de Vendas: <span style={{ color: '#64ff8a' }}>{quantidadeVendas}</span> registro(s)
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span>
                        Total Bruto: <span style={{ color: '#64ff8a' }}>R$ {totalVendasBruto.toFixed(2).replace('.', ',')}</span>
                    </span>
                    <span>
                        Total Pago: <span style={{ color: '#64ff8a' }}>R$ {totalValorPago.toFixed(2).replace('.', ',')}</span>
                    </span>
                    <span>
                        Total Troco: <span style={{ color: '#64ff8a' }}>R$ {totalTroco.toFixed(2).replace('.', ',')}</span>
                    </span>
                </div>
            </div>
            
            <div style={{ borderTop: '1px solid #555', paddingTop: '10px' }}>
                <div style={{ color: '#BACBD9', marginBottom: '5px' }}>Totais por Método de Pagamento:</div>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {Object.entries(totaisPorMetodo).map(([metodo, total]) => (
                        <span key={metodo}>
                            {metodo}: <span style={{ color: '#64ff8a' }}>R$ {total.toFixed(2).replace('.', ',')}</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
    
    const SecaoDelecao = (
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginBottom: '20px', width: '100%' }}>
            <button 
                onClick={gerarPDF}
                disabled={vendasFiltradas.length === 0 || gerandoPDF}
                style={{ 
                    padding: '10px 15px', 
                    backgroundColor: '#2196F3', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    opacity: (vendasFiltradas.length === 0 || gerandoPDF) ? 0.6 : 1
                }}
            >
                {gerandoPDF ? 'Gerando...' : 'Gerar PDF'}
            </button>

            <button 
                onClick={deletarVendasPorFiltro}
                disabled={vendasFiltradas.length === 0}
                style={{ 
                    padding: '10px 15px', 
                    backgroundColor: '#E53935', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    opacity: vendasFiltradas.length === 0 ? 0.6 : 1
                }}
            >
                Deletar Filtrados
            </button>

            <button 
                onClick={deletarTodasVendas}
                disabled={vendas.length === 0}
                style={{ 
                    padding: '10px 15px', 
                    backgroundColor: '#8E24AA', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    opacity: vendas.length === 0 ? 0.6 : 1
                }}
            >
                Deletar Tudo
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
                <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    Nenhuma venda encontrada com os filtros atuais.
                </p>
            ) : (
                <TabelaVendas>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data/Hora</th>
                            <th>Pagamento</th>
                            <th>Total Bruto</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {vendasFiltradas.map(venda => (
                            <tr key={venda.id_venda}>
                                <td>{venda.id_venda}</td>
                                <td>{new Date(venda.data_hora).toLocaleString('pt-BR')}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        {venda.pagamentos && venda.pagamentos.length > 0 ? (
                                            venda.pagamentos.map((pagamento, index) => (
                                                <div key={index} style={{ 
                                                    fontSize: '11px',
                                                    padding: '2px 4px',
                                                    backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#333',
                                                    borderRadius: '3px',
                                                    border: '1px solid #444'
                                                }}>
                                                    <strong>{pagamento.metodo}:</strong> R$ {parseFloat(pagamento.valor_pago).toFixed(2)}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ 
                                                fontSize: '11px',
                                                padding: '2px 4px',
                                                backgroundColor: '#2a2a2a',
                                                borderRadius: '3px'
                                            }}>
                                                N/A
                                            </div>
                                        )}
                                        <div style={{ 
                                            fontSize: '10px', 
                                            color: '#64ff8a',
                                            marginTop: '2px',
                                            padding: '1px 3px',
                                            backgroundColor: '#1a1a1a',
                                            borderRadius: '2px'
                                        }}>
                                            <strong>Valor Pago:</strong> R$ {parseFloat(venda.valor_pago_total).toFixed(2)}
                                        </div>
                                        <div style={{ 
                                            fontSize: '10px', 
                                            color: venda.valor_troco > 0 ? '#ffa500' : '#64ff8a',
                                            padding: '1px 3px',
                                            backgroundColor: '#1a1a1a',
                                            borderRadius: '2px'
                                        }}>
                                            <strong>Troco:</strong> R$ {parseFloat(venda.valor_troco).toFixed(2)}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ 
                                    fontSize: '16px', 
                                    fontWeight: 'bold', 
                                    color: '#64ff8a',
                                    textAlign: 'center'
                                }}>
                                    R$ {parseFloat(venda.valor_total_bruto).toFixed(2).replace('.', ',')}
                                </td>
                                <td>
                                    <button 
                                        onClick={() => deletarVendasPorId(venda.id_venda)}
                                        style={{ 
                                            backgroundColor: '#ff5252', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '6px 12px', 
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr style={{ backgroundColor: '#2d2d2d', fontWeight: 'bold', borderTop: '2px solid #64ff8a' }}>
                            <td colSpan="3" style={{ textAlign: 'right', color: '#64ff8a', fontSize: '16px' }}>
                                TOTAL ({quantidadeVendas} vendas):
                            </td>
                            <td style={{ 
                                color: '#64ff8a', 
                                fontSize: '18px',
                                textAlign: 'center'
                            }}>
                                R$ {totalVendasBruto.toFixed(2).replace('.', ',')}
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </TabelaVendas>
            )}
        </RelatoriosStyled>
    );
};