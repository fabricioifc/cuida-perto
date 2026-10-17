---
name: review-web-security
description: >-
  Procedimento de auditoria e revisão de segurança web e privacidade (LGPD) para o projeto CuidaPerto.
  Abrange análise de vulnerabilidades OWASP Top 10 (XSS, CSRF, Injeção), validação de entrada,
  sanitização, autenticação segura, controle de acesso baseado em papéis (RBAC), segurança de sessões
  e prevenção contra exposição indevida de dados de contato e dados de saúde de idosos.
  Use esta skill quando for solicitada revisão de segurança, auditoria de vulnerabilidades,
  avaliação de privacidade ou análise de conformidade de código.
---

# Procedimento: Revisão de Segurança Web e Privacidade (review-web-security)

Este runbook define o processo de auditoria técnica para identificar e mitigar vulnerabilidades de segurança da informação e riscos à privacidade (LGPD) no ecossistema da aplicação **CuidaPerto**.

---

## 1. Escopo de Auditoria no CuidaPerto

A revisão de segurança abrange 5 pilares fundamentais:
1. **Segurança de Aplicação Web (OWASP Top 10);**
2. **Validação e Sanitização de Entrada de Dados;**
3. **Autenticação, Gestão de Sessões e Cookies;**
4. **Controle de Acesso e Autorização (RBAC);**
5. **Privacidade, Minimização de Dados e Conformidade com a LGPD.**

---

## 2. Checklist Técnico de Verificação

### 2.1. Validação de Entrada e Prevenção de Injeções (XSS / SQLi)
- [ ] **Cross-Site Scripting (XSS):**
  - Todo dado fornecido pelo usuário e renderizado em templates EJS deve utilizar escape nativo (`<%= %>`), nunca interpolação não escapada (`<%- %>`), salvo para templates estáticos confiáveis.
  - Campos de texto livre (biografia, mensagens de apresentação) devem passar por sanitização rigorosa no backend antes de persistência.
- [ ] **Injeção de SQL / Comandos:**
  - Garantir que queries futuras ao PostgreSQL utilizem parâmetros vinculados (parametrized queries via `pg` com `$1, $2...`), nunca concatenação de strings.
- [ ] **Validação de Tipos e Esquemas:**
  - Parâmetros de rota (`params`), corpo de requisição (`body`) e query strings (`query`) devem ser validados quanto a tipo, comprimento máximo e caracteres esperados.

### 2.2. Autenticação e Gestão de Sessões
- [ ] **Armazenamento Seguro de Credenciais:**
  - Senhas devem utilizar algoritmo de derivação de chaves resistente (Argon2id ou bcrypt com fator de custo adequado).
  - Senhas nunca devem ser gravadas em texto puro nem logadas em arquivos.
- [ ] **Segurança dos Cookies de Sessão:**
  - `httpOnly: true`: Bloqueia acesso ao cookie via JavaScript no navegador (mitiga roubo via XSS);
  - `secure: true`: Obrigatório em ambiente de produção (HTTPS);
  - `sameSite: 'lax'` ou `'strict'`: Impede envio do cookie em requisições cross-site não autorizadas;
  - Regeneração do ID de sessão após login para mitigar fixação de sessão (*Session Fixation*).

### 2.3. Controle de Acesso e Autorização (RBAC)
- [ ] **Proteção de Rotas:**
  - Toda rota administrativa (`/admin/*`) deve exigir explicitamente `ROLE_ADMIN`.
  - Rotas do cuidador (`/caregiver/*`) devem exigir `ROLE_CAREGIVER`.
  - Rotas da família (`/family/*`) devem exigir `ROLE_FAMILY`.
- [ ] **Prevenção de IDOR (Insecure Direct Object Reference):**
  - Usuários não podem editar perfis de outros cuidadores ou acessar solicitações de terceiros apenas alterando o ID na URL. O serviço deve validar que o recurso pertence ao usuário autenticado.

### 2.4. Proteção contra CSRF e Ataques de Rede
- [ ] **Cross-Site Request Forgery (CSRF):**
  - Todos os formulários com método `POST`, `PUT` ou `DELETE` devem conter tokens anti-CSRF validados por middleware.
- [ ] **Headers de Segurança HTTP (Helmet):**
  - Configuração de cabeçalhos essenciais: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security` (HSTS), e `Content-Security-Policy` (CSP).
- [ ] **Rate Limiting e Força Bruta:**
  - Rotas de login e envio de formulários devem possuir limitação de taxa por IP para barrar tentativas automatizadas.

### 2.5. Privacidade e Proteção de Dados (LGPD — Lei 13.709/2018)
- [ ] **Princípio da Minimização de Dados (Art. 6º, III):**
  - É **terminantemente proibido** solicitar ou armazenar dados clínicos sensíveis do idoso (diagnósticos médicos, prontuários, laudos, exames) na plataforma.
- [ ] **Exposição Condicional de Dados Pessoais:**
  - Telefones, WhatsApp e e-mails pessoais de famílias e cuidadores **nunca** devem ser expostos na busca pública.
  - A revelação mútua de contatos deve ocorrer **estritamente após o cuidador aceitar formalmente a solicitação** enviada pela família.
- [ ] **Tratamento de Erros sem Vazamento de Dados:**
  - Respostas de erro (404, 500) não devem expor stacktraces, versões de bibliotecas ou dados de banco de dados para o usuário final.

---

## 3. Roteiro de Execução da Auditoria

Ao invocar esta skill, execute os seguintes passos:

1. **Varredura Estática de Código:**
   - Inspecionar rotas, middlewares, controllers e templates EJS em busca de padrões de risco (interpolações `<%-`, ausência de middlewares de autenticação, etc.).
2. **Execução de Testes Automatizados de Segurança:**
   - Criar ou rodar testes de integração simulando ataques (tentativas de acesso não autenticado, payloads com `<script>`, requisições sem CSRF token, IDs inexistentes).
3. **Classificação dos Achados por Severidade:**
   - **Crítica:** Vulnerabilidade com exploração direta que compromete credenciais, executa código remoto ou vaza dados de toda a base.
   - **Alta:** Falha de controle de acesso (IDOR), ausência de proteção CSRF em ações críticas ou exposição de dados pessoais (LGPD).
   - **Média:** Ausência de sanitização em campos restritos, falta de headers de segurança ou ausência de rate limiting.
   - **Baixa / Informativa:** Mensagens de erro que podem fornecer pistas a atacantes ou boas práticas recomendadas.
4. **Relatório Estruturado de Recomendações:**
   - Apresentar tabela com: Vulnerabilidade | Arquivo/Linha | Impacto | Recomendação de Correção em Código.
