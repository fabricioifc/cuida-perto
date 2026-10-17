# Especificação Inicial de Requisitos — CuidaPerto

**Versão:** 1.0  
**Status:** Aprovada pelo Usuário  
**Autoria:** Antigravity (Engenharia de Software)  

---

## 1. Visão Geral e Objetivos do Produto

O **CuidaPerto** é uma plataforma web criada com a finalidade de conectar famílias e cuidadores de pessoas idosas com foco em transparência, simplicidade e segurança. 

O escopo desta especificação define a fundação para o **Mínimo Produto Viável (MVP)**, estabelecendo uma ponte de contato confiável, ao mesmo tempo em que prepara a arquitetura para evoluções futuras (agendamento, contratos e pagamentos) e resguarda juridicamente a plataforma quanto à veracidade de dados e privacidade (LGPD).

---

## 2. Requisitos Funcionais (RF)

### 2.1. Módulo Família (Busca e Descoberta)
- **RF01 — Busca por Localidade:** O sistema deve permitir que visitantes busquem cuidadores informando cidade e estado (UF), com suporte a seleção padronizada de municípios.
- **RF02 — Filtro por Modalidade de Atendimento:** O usuário deve poder filtrar resultados por uma ou mais modalidades:
  - Plantão 12h (Diurno / Noturno);
  - Plantão 24h;
  - Folguista (Finais de Semana);
  - Cuidador Diarista / Meio Período;
  - Acompanhamento Hospitalar / Consultas.
- **RF03 — Visualização de Perfil Detalhado:** A plataforma deve exibir os dados públicos do cuidador:
  - Nome de exibição e foto profissional;
  - Biografia resumida;
  - Cidade(s) e bairros atendidos;
  - Modalidades aceitas;
  - Faixa de valor / remuneração declarada (por hora, diária ou plantão);
  - Disponibilidade geral declarada (dias da semana e períodos);
  - Experiência e qualificações autodeclaradas.
- **RF04 — Solicitação de Contato (Exige Login de Família):** Para solicitar contato, a família deve possuir cadastro e login na plataforma. O formulário deve conter:
  - Identificação da família logada;
  - Bairro e cidade onde o atendimento é necessário;
  - Modalidade desejada e frequência prevista;
  - Mensagem contextual de apresentação (sem expor prontuários ou dados clínicos sensíveis do idoso).

### 2.2. Módulo Cuidador (Gestão de Perfil)
- **RF05 — Cadastro e Autenticação de Cuidador:** O cuidador deve poder criar conta via e-mail e senha com validação de força de senha e confirmação de e-mail.
- **RF06 — Edição de Perfil Profissional:** O cuidador deve poder gerenciar:
  - Foto de perfil (com restrições de formato e tamanho);
  - Descrição textual da sua experiência e histórico profissional (cursos e atuações informadas em texto);
  - Cidades e regiões de cobertura;
  - Modalidades de atendimento que presta;
  - Valores informados (valor hora, valor plantão ou faixa estimada);
  - Agenda indicativa de disponibilidade (dias da semana e períodos).
- **RF07 — Gestão de Solicitações de Contato e Liberação Mútua:** O cuidador visualiza as solicitações recebidas em seu painel:
  - Ao clicar em **Aceitar**, o canal de contato direto (telefone/WhatsApp) é mutuamente liberado entre a família solicitante e o profissional;
  - Ao clicar em **Recusar**, a solicitação é encerrada sem exposição dos contatos diretos.

### 2.3. Módulo de Moderação e Administração
- **RF08 — Moderação Prévia Obrigatória:** Nenhum perfil recém-criado ou com alterações em campos públicos (biografia, dados pessoais, modalidades) é publicado na busca sem prévia análise e aprovação de um administrador.
- **RF09 — Painel de Aprovação de Perfis:** Moderadores analisam a fila de submissões pendentes, podendo:
  - **Aprovar:** Torna o perfil ativo e visível na busca pública;
  - **Solicitar Ajustes:** Notifica o cuidador indicando correções necessárias;
  - **Rejeitar:** Mantém o perfil bloqueado em caso de infração às diretrizes.
- **RF10 — Gestão de Denúncias e Bloqueio:** O sistema deve permitir que usuários denunciem perfis suspeitos, e moderadores possam suspender temporariamente ou banir contas infratoras.
- **RF11 — Registro de Auditoria (Logs):** Ações administrativas de aprovação, suspensão ou exclusão de perfis devem ser registradas em trilha de auditoria.

---

## 3. Requisitos Não Funcionais (RNF)

- **RNF01 — Desempenho e Eficiência:** As pesquisas e listagens de cuidadores devem retornar em menos de 300ms sob carga normal, utilizando paginação e indexação em banco de dados.
- **RNF02 — Acessibilidade Digital (WCAG 2.1 Nível AA):** A interface deve atender familiares e usuários idosos:
  - Contraste visual mínimo de 4.5:1 para texto normal;
  - Suporte integral a navegação por teclado (tabulação e foco visível);
  - Compatibilidade com leitores de tela semânticos (ARIA tags onde necessário);
  - Tamanho de fontes escalável e legível.
- **RNF03 — Responsividade:** O layout deve adotar abordagem *mobile-first*, operando perfeitamente em telas móveis (smartphones), tablets e desktops.
- **RNF04 — Stack Tecnológica e Simplicidade:** 
  - Backend em Node.js LTS com Express;
  - Renderização no servidor (SSR) com EJS para SEO e carregamento leve;
  - Vanilla JavaScript sem frameworks pesados de frontend no MVP.
- **RNF05 — Testabilidade:** Mínimo de 80% de cobertura nos serviços de domínio, regras de negócio e validações de dados.

---

## 4. Regras de Negócio (RN)

- **RN01 — Princípio da Qualificação Declarada e Isenção de Avaliação Pericial:**
  > [!IMPORTANT]
  > Todo perfil de cuidador exibirá em destaque obrigatório:
  > *"As informações de formação, experiência e disponibilidade são declaradas exclusivamente pelo profissional. A CuidaPerto não atesta, homologa nem valida pericialmente antecedentes ou qualificações."*
  > A plataforma não utilizará termos enganosos como "Cuidador 100% Verificado", "Profissional Certificado pela Plataforma" ou selos de garantia de qualidade sem que haja processo formal auditável de verificação.

- **RN02 — Vedação de Anúncio de Procedimentos Médicos Privativos:**
  Cuidadores não podem anunciar serviços exclusivos de enfermagem de nível técnico/superior (ex: punção venosa profunda, administração de quimioterápicos) sem a comprovação formal de inscrição ativa nos conselhos competentes (COREN), e mesmo assim a plataforma deixará claro que se trata de cuidado domiciliar e não serviço hospitalar.

- **RN03 — Modelo de Descoberta e Ausência de Cobrança Financeira no MVP:**
  No MVP, a plataforma atua estritamente como ponte de conexão e diretório qualificado. Os acordos contratuais, financeiros e acertos de diárias ocorrem diretamente entre família e cuidador, sem transação de valores pelo CuidaPerto.

- **RN04 — Visibilidade Condicional do Perfil:**
  Apenas perfis completos (foto, cidade, modalidades, valores e disponibilidade preenchidos) e em conformidade com as regras de moderação estarão visíveis nas buscas públicas.

- **RN05 — Proteção de Dados de Contato:**
  Telefones, WhatsApp e e-mails pessoais de cuidadores e familiares não devem ser expostos publicamente na listagem geral para evitar robôs de spam e assédio. A troca de dados é viabilizada através da solicitação de contato intermediada pela plataforma.

---

## 5. Requisitos de Segurança e Privacidade (LGPD & InfoSec)

### 5.1. Conformidade com a LGPD (Lei 13.709/2018)
- **Minimização de Dados (Art. 6º, III):**
  - No MVP, é terminantemente proibido cadastrar ou armazenar prontuários médicos, dados genéticos, laudos de saúde ou diagnósticos do idoso (dados sensíveis, Art. 11 da LGPD).
  - A solicitação de contato deve focar nas características da rotina (ex: auxílio locomoção, companhia, horário) e não em registros clínicos detalhados.
- **Bases Legais Claras:**
  - Tratamento fundamentado na execução de procedimentos preliminares a pedido do titular (Art. 7º, V) e consentimento explícito para divulgação do perfil público do cuidador (Art. 7º, I).
- **Direitos dos Titulares (Art. 18):**
  - Canal para exclusão definitiva de conta (direito à eliminação dos dados);
  - Opção para o cuidador ocultar ou desativar o perfil temporariamente a qualquer momento sem perder os dados.
- **Transparência:** Política de Privacidade em linguagem clara e acessível, separada dos Termos de Uso.

### 5.2. Segurança da Informação (InfoSec)
- **Armazenamento de Credenciais:** Senhas com hash criptográfico forte utilizando Argon2id ou bcrypt com custo configurável.
- **Proteção contra Ameaças Web (OWASP):**
  - Sanitização rigorosa contra Cross-Site Scripting (XSS) em campos de texto livre do perfil;
  - Proteção contra Cross-Site Request Forgery (CSRF) em todas as submissões de formulário;
  - Defesa contra Brute Force através de Rate Limiting por IP/rota nas telas de login e envio de mensagens;
  - Headers HTTP seguros configurados com Helmet.
- **Comunicação Segura:** HTTPS obrigatório em produção com política HSTS ativa.

---

## 6. Critérios de Aceitação (Exemplos BDD / Cenários de Teste)

### Cenário 1: Busca de cuidadores por cidade com resultados
- **Dado** que existem cuidadores com perfis aprovados e ativos na cidade de "São Paulo - SP";
- **Quando** o usuário selecionar a cidade "São Paulo - SP" e clicar em "Pesquisar";
- **Então** o sistema deve listar apenas os cuidadores ativos pertencentes a essa cidade;
- **E** cada cartão deve exibir a foto, modalidades, valor/hora declarado e o aviso de qualificação declarada.

### Cenário 2: Filtragem por modalidade de atendimento
- **Dado** que o usuário está na tela de resultados da cidade "Campinas - SP";
- **Quando** o usuário marcar o filtro "Plantão 12h Noturno";
- **Então** a lista deve atualizar exibindo somente profissionais que declararam atender essa modalidade específica.

### Cenário 3: Exibição obrigatória do disclaimer de veracidade declarada
- **Dado** que qualquer usuário acesse a página de perfil público de um cuidador;
- **Quando** a página for renderizada;
- **Então** o aviso informando que as informações são autodeclaradas pelo profissional deve estar visível e destacado antes da seção de solicitação de contato.

### Cenário 4: Solicitação de contato sem exposição pública de dados
- **Dado** que uma família encontrou um perfil de cuidador de seu interesse;
- **Quando** preencher o formulário de solicitação de contato com seus dados e necessidades de rotina e submeter;
- **Então** uma notificação/registro deve ser gerado no painel do cuidador;
- **E** os telefones de ambas as partes permanecem ocultos até que o cuidador aprove a solicitação.

---

## 7. Fora do Escopo do MVP (Fase 2 / Futuro)

Para manter o lançamento rápido, seguro e testável, as seguintes funcionalidades ficam formalmente postergadas para fases futuras:

1. **Agendamento e Calendário Interativo em Tempo Real:** Agendamento de turnos e sincronização com Google Calendar / iCal.
2. **Processamento de Pagamentos e Split Financeiro:** Gateway de pagamento (cartão/PIX), custódia e cobrança de taxas de comissão.
3. **Contratos Digitais e Assinatura Eletrônica:** Geração de contrato de prestação de serviços com validade jurídica integrada.
4. **Verificação Documental em Bureaus de Antecedentes:** Integração com APIs externas de consulta de certidões judiciais e antecedentes criminais.
5. **Avaliações e Reviews com Notas:** Sistema de notas de 1 a 5 estrelas — só deve ser implementado quando houver garantia de que o serviço foi efetivamente contratado e prestado através da plataforma, prevenindo difamação e avaliações falsas.
6. **Chat Interno em Tempo Real (WebSockets):** Troca de mensagens instantâneas dentro da aplicação (no MVP, o fluxo orienta o contato para telefone/WhatsApp/e-mail após autorização mútua).
7. **Upload e Armazenamento de Arquivos de Certificados/Diplomas (PDF/Imagem):** No MVP, a qualificação é estritamente textual e autodeclarada pelo profissional com aviso legal obrigatório. Validação documental fica para fases futuras.
