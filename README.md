# EversCash - Gestão e Análise de Dados para Pequenos Negócios

Este repositório documenta o desenvolvimento e a aplicação do **EversCash**, um ecossistema de software projetado para transformar a gestão operacional de micro e pequenas empresas por meio da análise de dados estruturada.

> **Nota de Direitos:** Este projeto foi desenvolvido exclusivamente como parte do componente extensionista da disciplina de Análise de Dados (Engenharia de Software - Estácio). O código e a lógica aqui apresentados são de autoria de **Everson Silva de Souza** e não se destinam à redistribuição, instalação ou uso comercial por terceiros.

---

## 🚀 Propósito e Problema Social

O **EversCash** nasce de uma necessidade crítica identificada no comércio local: a ausência de ferramentas de gestão que sejam acessíveis e, ao mesmo tempo, respeitem a soberania de dados do pequeno empresário.

Muitos empreendedores recorrem a softwares gratuitos que coletam informações comerciais sensíveis ou permanecem na informalidade do papel, o que impede uma visão estratégica do negócio. O **EversCash** resolve isso ao fornecer uma estrutura técnica profissional que permite ao dono do negócio ser o único proprietário de sua inteligência comercial.

---

## ⚙️ Funcionamento e Lógica do Sistema

O projeto opera sob uma arquitetura de três camadas (**Frontend**, **Backend** e **Banco de Dados**), com foco em integridade referencial e processamento analítico.

### 1. Camada de Dados (PostgreSQL)

A espinha dorsal do projeto utiliza um banco de dados relacional para garantir que nenhuma transação seja perdida. A lógica de banco inclui:

- **Relacionamentos Complexos:** Vinculação entre sessões de caixa, vendas individuais e métodos de pagamento.
- **Consistência Financeira:** Estrutura que diferencia "Valor Recebido", "Troco" e "Sangrias", permitindo uma auditoria precisa ao final de cada jornada.

### 2. Processamento e Regras de Negócio (Node.js)

O backend atua como o motor analítico, transformando dados brutos em indicadores:

- **Cálculo de Indicadores:** Algoritmos que processam o volume de transações para gerar o **Ticket Médio** e o **Lucro Bruto** em tempo real.
- **Gestão de Sessão:** Lógica de controle que impede discrepâncias financeiras através do monitoramento rigoroso de aberturas e fechamentos de caixa.

### 3. Interface e Usabilidade (React)

A interface foi projetada para o ambiente de balcão (alta velocidade):

- **Experiência do Usuário (UX):** Suporte a **Dark Mode** para conforto visual em longas jornadas e busca rápida de itens.
- **Versatilidade:** Módulo que gerencia de forma distinta produtos em estoque e serviços sob demanda (comum no setor de comunicação visual).

---

## 📊 Aplicação no Projeto de Extensão

O sistema foi aplicado e validado na microempresa **Yakov Letreiros e Comunicação Visual**, funcionando como instrumento de coleta e análise para a disciplina acadêmica.

**Impactos Analisados:**

- **Volume de Dados:** Processamento de **1.006 transações reais** durante o período de monitoramento.
- **Descoberta de Gargalos:** Através do controle de retiradas, identificou-se que os custos logísticos (deslocamentos externos) representavam um dos maiores impactos na margem de lucro.
- **Sazonalidade:** Identificação técnica de um **aumento de 28% na demanda** no início de janeiro, permitindo uma previsão de insumos para anos futuros.

---

## 🛠️ Stack Técnica

- **Linguagens:** JavaScript (ES6+), SQL.
- **Frameworks/Bibliotecas:** React, Node.js, Express, jspdf.
- **Banco de Dados:** PostgreSQL.

---

## ✒️ Autor e Desenvolvedor

**Everson Silva de Souza**

- **Curso:** Engenharia de Software
- **Instituição:** Universidade Estácio de Sá
- **Matrícula:** 20230503234

> Este documento serve para fins informativos e acadêmicos, demonstrando a evolução de um projeto pessoal voltado para o impacto social e a excelência técnica em Engenharia de Software.
