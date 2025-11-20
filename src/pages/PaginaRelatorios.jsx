import React, { useState, useEffect, useMemo } from 'react';
import { RelatoriosStyled, TabelaVendas } from './RelatoriosStyled';

const URL_API_VENDAS = 'http://localhost:3000/vendas';
const URL_API_DELETAR_EM_MASSA = 'http://localhost:3000/vendas/deletar-periodo';

export const PaginaRelatorios = () => {
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [gerandoPDF, setGerandoPDF] = useState(false);

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

    // Cálculos para o subtotal
    const totalVendasBruto = useMemo(() => {
        return vendasFiltradas.reduce((acc, venda) => 
            acc + parseFloat(venda.valor_total_bruto || 0), 0
        );
    }, [vendasFiltradas]);

    const totalValorPago = useMemo(() => {
        return vendasFiltradas.reduce((acc, venda) => 
            acc + parseFloat(venda.valor_pago_total || 0), 0
        );
    }, [vendasFiltradas]);

    const totalTroco = useMemo(() => {
        return vendasFiltradas.reduce((acc, venda) => 
            acc + parseFloat(venda.valor_troco || 0), 0
        );
    }, [vendasFiltradas]);

    const quantidadeVendas = vendasFiltradas.length;

    // Função para gerar PDF simplificada
    const gerarPDF = async () => {
        if (vendasFiltradas.length === 0) {
            alert('Não há dados para exportar com os filtros atuais.');
            return;
        }

        setGerandoPDF(true);

        try {
            // Importação dinâmica para evitar problemas de carregamento
            const { jsPDF } = await import('jspdf');
            
            const doc = new jsPDF();
            
            // Configurações iniciais
            const pageWidth = doc.internal.pageSize.getWidth();
            let yPosition = 20;

            // Cabeçalho
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(40, 40, 40);
            doc.text('Relatório de Vendas - EversCash', pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 10;

            // Informações de filtro
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            
            let infoFiltro = 'Período: Todos os registros';
            if (filtroDataInicio || filtroDataFim) {
                infoFiltro = `Período: ${filtroDataInicio || 'Início'} à ${filtroDataFim || 'Fim'}`;
            }
            
            if (filtroStatus !== 'Todos') {
                infoFiltro += ` | Status: ${filtroStatus}`;
            }
            
            doc.text(infoFiltro, 14, yPosition);
            yPosition += 5;
            doc.text(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, 14, yPosition);
            yPosition += 10;

            // Cabeçalho da tabela
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            
            // Fundo para cabeçalho
            doc.setFillColor(41, 128, 185);
            doc.rect(14, yPosition, pageWidth - 28, 8, 'F');
            
            // Texto do cabeçalho
            doc.text('ID', 18, yPosition + 6);
            doc.text('Data/Hora', 30, yPosition + 6);
            doc.text('Total Bruto', 80, yPosition + 6);
            doc.text('Valor Pago', 120, yPosition + 6);
            doc.text('Troco', 160, yPosition + 6);
            doc.text('Status', 180, yPosition + 6);
            
            yPosition += 12;

            // Dados da tabela
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            let linhaCount = 0;
            const maxLinhasPorPagina = 25;

            vendasFiltradas.forEach((venda, index) => {
                // Verificar se precisa de nova página
                if (linhaCount >= maxLinhasPorPagina) {
                    doc.addPage();
                    yPosition = 20;
                    linhaCount = 0;
                    
                    // Recriar cabeçalho na nova página
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(255, 255, 255);
                    doc.setFillColor(41, 128, 185);
                    doc.rect(14, yPosition, pageWidth - 28, 8, 'F');
                    doc.text('ID', 18, yPosition + 6);
                    doc.text('Data/Hora', 30, yPosition + 6);
                    doc.text('Total Bruto', 80, yPosition + 6);
                    doc.text('Valor Pago', 120, yPosition + 6);
                    doc.text('Troco', 160, yPosition + 6);
                    doc.text('Status', 180, yPosition + 6);
                    yPosition += 12;
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(0, 0, 0);
                }

                // Alternar cores das linhas
                if (index % 2 === 0) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(14, yPosition, pageWidth - 28, 6, 'F');
                }

                // Dados da linha
                doc.text(venda.id_venda.toString(), 18, yPosition + 4);
                doc.text(new Date(venda.data_hora).toLocaleString('pt-BR'), 30, yPosition + 4);
                doc.text(`R$ ${parseFloat(venda.valor_total_bruto).toFixed(2)}`, 80, yPosition + 4);
                doc.text(`R$ ${parseFloat(venda.valor_pago_total).toFixed(2)}`, 120, yPosition + 4);
                doc.text(`R$ ${parseFloat(venda.valor_troco).toFixed(2)}`, 160, yPosition + 4);
                doc.text(venda.status_venda, 180, yPosition + 4);
                
                yPosition += 6;
                linhaCount++;
            });

            // Linha de total na última página
            if (doc.internal.getNumberOfPages() > 1) {
                // Ir para a última página
                const totalPages = doc.internal.getNumberOfPages();
                doc.setPage(totalPages);
                yPosition = doc.internal.pageSize.getHeight() - 40;
            }

            // Fundo verde para o total
            doc.setFillColor(46, 204, 113);
            doc.rect(14, yPosition, pageWidth - 28, 8, 'F');
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(`TOTAL (${quantidadeVendas} vendas):`, 18, yPosition + 6);
            doc.text(`R$ ${totalVendasBruto.toFixed(2)}`, 80, yPosition + 6);
            doc.text(`R$ ${totalValorPago.toFixed(2)}`, 120, yPosition + 6);
            doc.text(`R$ ${totalTroco.toFixed(2)}`, 160, yPosition + 6);

            yPosition += 15;

            // Resumo final
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Resumo do Relatório:', 14, yPosition);
            
            doc.setFont('helvetica', 'normal');
            doc.text(`• Total de Vendas: ${quantidadeVendas}`, 14, yPosition + 6);
            doc.text(`• Valor Bruto Total: R$ ${totalVendasBruto.toFixed(2)}`, 14, yPosition + 12);
            doc.text(`• Valor Recebido Total: R$ ${totalValorPago.toFixed(2)}`, 14, yPosition + 18);
            doc.text(`• Troco Total: R$ ${totalTroco.toFixed(2)}`, 14, yPosition + 24);

            // Gerar nome do arquivo
            const dataAtual = new Date().toISOString().split('T')[0];
            const nomeArquivo = `relatorio_vendas_${dataAtual}.pdf`;
            
            // Salvar PDF
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
            <div>
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
                {gerandoPDF ? 'Gerando PDF...' : `Exportar PDF (${vendasFiltradas.length})`}
            </button>
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
                        {/* Linha de subtotal */}
                        <tr style={{ backgroundColor: '#2d2d2d', fontWeight: 'bold', borderTop: '2px solid #64ff8a' }}>
                            <td colSpan="2" style={{ textAlign: 'right', color: '#64ff8a' }}>
                                SUBTOTAL ({quantidadeVendas} vendas):
                            </td>
                            <td style={{ color: '#64ff8a' }}>
                                R$ {totalVendasBruto.toFixed(2).replace('.', ',')}
                            </td>
                            <td style={{ color: '#64ff8a' }}>
                                R$ {totalValorPago.toFixed(2).replace('.', ',')}
                            </td>
                            <td style={{ color: '#64ff8a' }}>
                                R$ {totalTroco.toFixed(2).replace('.', ',')}
                            </td>
                            <td colSpan="2"></td>
                        </tr>
                    </tbody>
                </TabelaVendas>
            )}
        </RelatoriosStyled>
    );
};