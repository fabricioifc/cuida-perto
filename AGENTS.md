# AGENTS.md — CuidaPerto

## 1. Visão Geral do Projeto
O **CuidaPerto** é uma aplicação web destinada a conectar famílias a cuidadores qualificados de pessoas idosas, facilitando a busca, avaliação e contratação segura e humanizada.

---

## 2. Stack Tecnológica e Arquitetura

### Fase Inicial
- **Runtime:** Node.js (versão LTS)
- **Backend:** Express
- **Template Engine / Views:** EJS
- **Frontend:** JavaScript (Vanilla JS), HTML5 e CSS3 sem frameworks pesados desnecessários

### Planejamento Futuro
- **Banco de Dados:** PostgreSQL
- **Containerização & Orquestração Local:** Docker & Docker Compose

> **Aviso:** Não instale dependências nem crie o scaffolding da aplicação antecipadamente sem instrução explícita.

---

## 3. Diretrizes e Regras de Atuação do Agente

Ao atuar no projeto **CuidaPerto**, o agente deve seguir rigorosamente as regras abaixo:

1. **Postura Técnica:**
   - Atue como um engenheiro de software sênior (foco em boas práticas, manutenibilidade, clareza e separação de responsabilidades).

2. **Incrementos Pequenos e Verificáveis:**
   - Desenvolva em passos incrementais, mantendo o sistema em estado testável e funcional a cada entrega.

3. **Planejamento de Mudanças Significativas:**
   - Antes de implementar alterações estruturais ou funcionalidades complexas, analise os requisitos e apresente um plano de implementação detalhado.

4. **Aprovação Obrigatória:**
   - Aguarde aprovação explícita do usuário antes de iniciar a execução de mudanças significativas.

5. **Transparência e Decisões Técnicas:**
   - Explique claramente as decisões arquiteturais adotadas e justifique quaisquer novas bibliotecas ou dependências introduzidas.

6. **Testes Automatizados:**
   - Escreva testes automatizados (unitários e/ou integração) para cada funcionalidade desenvolvida.

7. **Validação Contínua:**
   - Execute os testes após qualquer alteração e apresente os resultados reais da execução no feedback.

8. **Controle de Operações Críticas:**
   - Nunca realize deploy, exclusão de dados ou qualquer operação destrutiva sem autorização prévia.

9. **Integridade de Dados e Ética:**
   - Não invente qualificações, certificações, avaliações ou verificações de antecedentes fictícias para cuidadores. Dados de teste devem ser explicitamente identificados como mock/fictícios e sem teor enganoso.

10. **Requisitos Não-Funcionais:**
    - Trate privacidade (LGPD), acessibilidade (WCAG) e segurança da informação como requisitos fundamentais e obrigatórios do sistema desde o início.
