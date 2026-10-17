# ==============================================================================
# Dockerfile Multi-Stage — CuidaPerto
# Base: Node.js 22 LTS Alpine (Enxuta, Segura e Rápida)
# ==============================================================================

# ------------------------------------------------------------------------------
# Estágio 1: Dependências de Produção
# ------------------------------------------------------------------------------
FROM node:22-alpine AS dependencies

WORKDIR /app

# Copia manifestos de pacotes
COPY package.json package-lock.json* ./

# Instala estritamente as dependências de produção sem scripts arbitrários
RUN npm ci --omit=dev --ignore-scripts

# ------------------------------------------------------------------------------
# Estágio 2: Execução da Aplicação (Runner)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Cria diretório da aplicação e define permissões para o usuário não-root 'node'
RUN chown -R node:node /app

# Copia dependências de produção do estágio anterior
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./

# Copia o código-fonte da aplicação
COPY --chown=node:node src/ ./src/

# Executa com usuário não-privilegiado (mitigação de escape de contêiner)
USER node

# Porta interna do container (não exposta diretamente para o host externo)
EXPOSE 3000

# Healthcheck interno utilizando a API fetch nativa do Node.js 22
HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Comando de inicialização
CMD ["node", "src/server.js"]
