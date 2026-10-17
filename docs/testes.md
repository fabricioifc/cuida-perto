# Estratégia de Testes Automatizados — CuidaPerto

**Versão:** 1.0  
**Status:** Aprovada pelo Usuário  
**Alinhamento:** [AGENTS.md](file:///c:/Users/fabri/OneDrive/Documents/projetos/cuidador/AGENTS.md), [docs/requisitos.md](file:///c:/Users/fabri/OneDrive/Documents/projetos/cuidador/docs/requisitos.md), [docs/arquitetura.md](file:///c:/Users/fabri/OneDrive/Documents/projetos/cuidador/docs/arquitetura.md)  

---

## 1. Visão Geral e Pirâmide de Testes

Para garantir que o **CuidaPerto** seja seguro, confiável e humanizado, a estratégia de qualidade segue a clássica **Pirâmide de Testes**, complementada por **Auditorias Automatizadas de Acessibilidade (WCAG 2.1 AA)** e **Validações Estritas de Segurança/LGPD**.

```text
               / \
              /   \
             / E2E \         ~10% (Jornadas do Usuário no Navegador com Playwright)
            /-------\
           / Integra- \      ~30% (Rotas HTTP, Middlewares, Sessões e Repositórios)
          /    ção     \
         /---------------\
        /    Unitários    \   ~60% (Regras de Negócio em Services, Utils e Validadores)
       /-------------------\
      +---------------------+
      | Acessibilidade & CI | Transversal (Axe-core em todas as páginas + GitHub Actions)
      +---------------------+
```

---

## 2. Ferramentas Recomendadas e Justificativas Técnicas

| Categoria | Ferramenta Escolhida | Justificativa Técnica |
| :--- | :--- | :--- |
| **Test Runner (Unitários e Integração)** | **`node:test` + `node:assert/strict`** *(Nativo do Node.js LTS)* | Nativo a partir do Node.js LTS 18/20. Executa em milissegundos sem adicionar centenas de MB de dependências (`node_modules`), possui suporte nativo a mocks (`mock.fn()`), spies e subtestes. *(Alternativa compatível: `vitest`).* |
| **Testes de Integração HTTP** | **`supertest`** | Padrão consolidado no ecossistema Express. Permite disparar requisições HTTP simuladas diretamente contra a instância da aplicação em memória, sem necessidade de abrir portas de rede reais. |
| **Testes End-to-End (E2E)** | **`@playwright/test`** | Rápido, resiliente (com auto-wait nativo evitando testes instáveis/flaky), roda em múltiplos navegadores (Chromium, Firefox, WebKit), captura traces e screenshots em caso de falha. |
| **Auditoria de Acessibilidade** | **`@axe-core/playwright`** | Motor padrão da indústria (Deque Systems) para verificação automatizada das diretrizes WCAG 2.1 Níveis A e AA (contraste de cores, hierarquia de cabeçalhos, formulários sem labels, foco por teclado). |
| **Cobertura de Código** | **`c8`** | Relatórios precisos de cobertura de linhas, branches e funções baseados no V8 nativo. |
| **Integração Contínua (CI)** | **GitHub Actions** | Execução automática de toda a suíte a cada Pull Request e push na branch principal. |

---

## 3. Escopo Detalhado por Nível de Teste

### 3.1. Testes Unitários (Foco em Regras de Negócio e Domínio)
Localização: `tests/unit/`  
Tempo de execução alvo: `< 2 segundos` (100% em memória, zero I/O de rede ou disco).

- **`AuthService`**:
  - Hashing seguro de senhas com salting;
  - Rejeição de senhas fracas ou fora da política de complexidade;
  - Bloqueio de login com e-mail inexistente ou senha incorreta;
  - Geração de dados de sessão e validação de papéis (`ROLE_FAMILY`, `ROLE_CAREGIVER`, `ROLE_ADMIN`).
- **`CaregiverService`**:
  - Sanitização de texto livre na biografia (remoção de tags HTML maliciosas/XSS);
  - Formatação e validação de faixas de valores (hora, diária, plantão);
  - Garantia de que qualificações declaradas não incluem alegações médicas proibidas;
  - Transição de status para `PENDING_REVIEW` sempre que o perfil for editado.
- **`ContactService`**:
  - Validação da mensagem da família: bloqueio de termos relacionados a prontuários médicos ou laudos clínicos (LGPD - minimização de dados sensíveis);
  - Bloqueio de visualização de telefone/WhatsApp quando a solicitação estiver em estado `PENDING` ou `REJECTED`;
  - Liberação mútua dos contatos estritamente quando o cuidador transitar para `ACCEPTED`.
- **`ModerationService`**:
  - Regras de aprovação prévia, solicitação de ajustes e rejeição de perfis;
  - Gravação obrigatória da trilha de auditoria para cada ação do moderador.

### 3.2. Testes de Integração (Rotas HTTP, Middlewares e Repositórios)
Localização: `tests/integration/`  
Executa a aplicação Express em memória com repositórios de teste.

- **Rotas de Autenticação (`/auth`)**:
  - Submissão de login com sucesso: verificação do cookie de sessão (`httpOnly: true`, `sameSite: 'lax'`, `secure` em produção);
  - Tentativa de login com credenciais inválidas: retorno de código HTTP correto e render da mensagem de erro amigável.
- **Pipeline de Middlewares de Segurança**:
  - `ensureAuthenticated`: Requisição sem sessão ativa para `/caregiver/dashboard` deve ser redirecionada para `/login`;
  - `ensureRole`: Usuário com papel `ROLE_FAMILY` tentando acessar `/admin/moderation` deve receber `403 Forbidden`;
  - `csrfMiddleware`: Submissões POST sem token CSRF válido devem ser rejeitadas (`403 Forbidden`).
- **Rotas Públicas e de Busca (`/` e `/search`)**:
  - Busca por cidade e filtros combinados (retorno de cuidadores ativos e aprovados);
  - Garantia de isolamento: cuidadores com status `PENDING_REVIEW` ou `REJECTED` **nunca** aparecem nos resultados de busca pública;
  - Validação da presença do componente `disclaimer-box` no HTML retornado.
- **Tratamento de Erros e Validação de Entrada**:
  - Envio de payloads corrompidos ou tipos incompatíveis: resposta `400 Bad Request` sem vazamento de stacktrace interno;
  - Rota inexistente: renderização limpa da página `404 Not Found`.

### 3.3. Testes End-to-End (E2E) com Playwright
Localização: `tests/e2e/`  
Simulam a experiência do usuário real no navegador.

- **Jornada 1 — Busca, Consulta e Solicitação de Contato (Família):**
  1. Acessa a página inicial (`/`);
  2. Digita a cidade (ex: "São Paulo") e aplica o filtro "Plantão 12h";
  3. Clica no card de um cuidador;
  4. Valida a exibição clara do **aviso legal de qualificação autodeclarada**;
  5. Clica em "Solicitar Contato" $\to$ é direcionado para login/cadastro de família;
  6. Efetua login e envia o pedido de contato;
  7. Confirma que os telefones diretos **permanecem ocultos** no status pendente.

- **Jornada 2 — Gestão e Aceite com Liberação Mútua (Cuidador):**
  1. Cuidador faz login;
  2. Acessa a aba de solicitações recebidas;
  3. Visualiza o pedido da família;
  4. Clica em "Aceitar Solicitação";
  5. Valida que o telefone/WhatsApp da família agora é exibido e que a família também passa a ver o contato do cuidador.

- **Jornada 3 — Moderação Prévia de Perfil (Admin):**
  1. Cuidador altera sua biografia $\to$ perfil fica oculto da busca pública;
  2. Moderador faz login em `/admin/moderation`;
  3. Analisa o perfil na fila e clica em "Aprovar Perfil";
  4. Valida que o perfil volta imediatamente a aparecer nos resultados da busca pública.

### 3.4. Auditoria Automatizada de Acessibilidade (WCAG 2.1 AA)
Integrada aos testes do Playwright através do `@axe-core/playwright`:

- Criação de um helper de asserção: `expectNoA11yViolations(page, context)`;
- Regras validadas automaticamente em todas as páginas renderizadas:
  - **Contraste de cor:** Mínimo de 4.5:1 para texto normal e 3:1 para texto grande;
  - **Elementos de formulário:** Todo `<input>`, `<select>` e `<textarea>` deve possuir `<label>` associado explicitamente via `for`/`id`;
  - **Navegação por teclado:** Ordem lógica de tabulação e foco visível em todos os elementos interativos;
  - **Imagens e ícones:** Atributos `alt` descritivos ou `aria-hidden="true"` para ícones decorativos;
  - **Landmarks semânticos:** `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` estruturados sem duplicidade inválida.

---

## 4. Scripts e Comandos no `package.json`

Configuração proposta para os scripts de teste:

```json
{
  "scripts": {
    "test": "node --test tests/unit/**/*.test.js tests/integration/**/*.test.js",
    "test:unit": "node --test tests/unit/**/*.test.js",
    "test:integration": "node --test tests/integration/**/*.test.js",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "playwright test tests/e2e/a11y.spec.js",
    "test:coverage": "c8 node --test tests/unit/**/*.test.js tests/integration/**/*.test.js",
    "test:ci": "npm run test:coverage && npm run test:e2e"
  }
}
```

---

## 5. Pipeline de CI no GitHub Actions (`.github/workflows/ci.yml`)

Workflow automatizado para garantir que nenhum código quebre testes ou padrões de qualidade:

```yaml
name: CI CuidaPerto

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [ 20.x, 22.x ] # Versões LTS do Node.js

    steps:
      - name: Checkout do Código
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Instalar Dependências
        run: npm ci

      - name: Executar Testes Unitários e de Integração com Cobertura
        run: npm run test:coverage

      - name: Instalar Navegadores do Playwright
        run: npx playwright install --with-deps

      - name: Executar Testes E2E e Acessibilidade (Axe-core)
        run: npm run test:e2e

      - name: Arquivar Relatórios do Playwright em caso de Falha
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```
