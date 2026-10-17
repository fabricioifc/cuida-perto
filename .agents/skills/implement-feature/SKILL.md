---
name: implement-feature
description: >-
  Procedimento rigoroso para planejar, implementar, testar e documentar novas funcionalidades
  no projeto CuidaPerto. Garante conformidade com o AGENTS.md, arquitetura em 4 camadas,
  acessibilidade WCAG 2.1 AA, testes automatizados e aprovação prévia do usuário.
  Use esta skill sempre que for solicitado o desenvolvimento de uma nova funcionalidade,
  fluxo ou incremento no sistema.
---

# Procedimento: Implementação de Nova Funcionalidade (implement-feature)

Este runbook define o processo padronizado de engenharia para criar qualquer nova funcionalidade no **CuidaPerto**, assegurando alta qualidade, manutenibilidade, cobertura de testes e respeito às diretrizes do projeto.

---

## Diretrizes Obrigatórias ([AGENTS.md](file:///c:/Users/fabri/OneDrive/Documents/projetos/cuidador/AGENTS.md))

1. **Postura Sênior:** Arquitetura limpa, separação clara de responsabilidades e código autodocumentado.
2. **Aprovação Prévia Mandatória:** Apresentar plano detalhado e critérios de aceitação antes de alterar arquivos.
3. **Incrementos Pequenos:** Manter o sistema funcional e testável a cada entrega intermediária.
4. **Testes Automatizados:** Todo incremento deve conter testes unitários e/ou de integração executados com resultados reais reportados.
5. **Ética e LGPD:** Não inventar dados de cuidadores e proteger a privacidade das famílias e idosos.

---

## Fluxo de Execução em 4 Fases

### Fase 1: Análise e Planejamento (Aguardar Aprovação)
1. **Mapeamento de Requisitos:**
   - Consultar [docs/requisitos.md](file:///c:/Users/fabri/OneDrive/Documents/projetos/cuidador/docs/requisitos.md) e verificar como a funcionalidade se encaixa no escopo (MVP vs. Futuro).
2. **Definição dos Critérios de Aceitação (BDD):**
   - Escrever critérios no formato *Dado-Quando-Então* (cenários de sucesso, cenários de borda e erros esperados).
3. **Plano de Implementação em Camadas:**
   - Detalhar as alterações em Repositórios, Serviços, Controllers, Rotas e Views.
4. **Parada Obrigatória:** Apresentar o plano ao usuário e aguardar confirmação antes de alterar arquivos.

### Fase 2: Implementação em 4 Camadas
Seguir rigorosamente a arquitetura descrita em [docs/arquitetura.md](file:///c:/Users/fabri/OneDrive/Documents/projetos/cuidador/docs/arquitetura.md):

1. **Camada de Dados (`src/repositories/`):**
   - Implementar métodos no repositório (em memória para o MVP, contratos prontos para PostgreSQL).
2. **Camada de Domínio e Negócio (`src/services/`):**
   - Funções puras e regras de negócio sem acoplamento a objetos HTTP (`req`, `res`).
   - Sanitização de dados de entrada e lançamento de exceções customizadas (`NotFoundError`, `ValidationError`, `ForbiddenError`).
3. **Camada de Apresentação e Views (`src/views/` e `src/public/`):**
   - Criar templates EJS com marcação semântica HTML5.
   - Garantir acessibilidade (WCAG 2.1 AA): contraste mínimo 4.5:1, foco visível, labels explícitos em formulários e tags ARIA quando necessário.
   - Incluir o componente `disclaimer-box.ejs` sempre que perfis de cuidadores forem exibidos.
4. **Camada de Controle e Rotas (`src/controllers/` e `src/routes/`):**
   - Extrair parâmetros e validar payloads.
   - Delegar a execução para o service correspondente e invocar `res.renderWithLayout` ou retornar JSON.

### Fase 3: Testes Automatizados e Validação
1. **Testes Unitários (`tests/unit/`):**
   - Cobrir os métodos de serviço, regras de negócio e validações lógicas com repositórios mockados.
2. **Testes de Integração (`tests/integration/`):**
   - Testar rotas Express com `supertest` validando status HTTP (200, 400, 403, 404), headers de segurança e conteúdo do HTML renderizado.
3. **Execução Real:**
   - Executar os testes via terminal:
     ```powershell
     node --test tests/unit/**/*.test.js tests/integration/**/*.test.js
     ```
   - Reportar no feedback a quantidade de testes executados, tempo de execução e status de aprovação.

### Fase 4: Documentação e Guia de Validação Manual
1. Listar os arquivos alterados e criados.
2. Fornecer instruções claras para o usuário testar a funcionalidade no navegador:
   - URL a ser acessada;
   - Passos a executar;
   - Resultado esperado na interface.
3. Confirmar que nenhum deploy ou operação destrutiva foi realizada.
