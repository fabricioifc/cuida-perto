# Guia de Execução Local com Docker Compose — CuidaPerto

Este documento descreve como executar a aplicação localmente utilizando contêineres Docker e proxy reverso NGINX com isolamento de rede e segurança por padrão.

---

## 1. Arquitetura Local de Contêineres

```text
Host (Desenvolvedor)
  └── Navegador: http://127.0.0.1:8080
          │
          ▼ (Exclusivamente em Loopback 127.0.0.1)
  ┌────────────────────────────────────────────────────────┐
  │ Docker Network: cuidaperto-net                         │
  │                                                        │
  │   [cuidaperto-nginx:80]                                │
  │          │                                             │
  │          ▼ (Rede interna http://app:3000)              │
  │   [cuidaperto-app:3000] (Node 22 LTS / Usuário 'node') │
  └────────────────────────────────────────────────────────┘
```

- **Sem exposição à internet:** O NGINX está explicitamente vinculado ao IP `127.0.0.1`.
- **Zero segredos no repositório:** As variáveis são definidas em `.env` (ignorado pelo Git).
- **Sem PostgreSQL no momento:** O banco de dados relacional só será adicionado quando a camada de persistência definitiva for implementada.

---

## 2. Pré-requisitos

- Docker Desktop instalado e em execução;
- Docker Compose v2+ (`docker compose version`).

---

## 3. Comandos de Operação

### 3.1. Subir os Serviços em Segundo Plano
```bash
docker compose up -d --build
```

### 3.2. Verificar Status e Saúde dos Contêineres
```bash
docker compose ps
```
*Ambos os serviços devem apresentar o status `healthy`.*

### 3.3. Testar a Conexão Local e Healthcheck
No terminal:
```bash
curl http://127.0.0.1:8080/health
```
Resposta esperada:
```json
{"status":"ok","timestamp":"2026-...","service":"CuidaPerto Web App"}
```

No navegador:
- **Aplicação Completa:** [http://127.0.0.1:8080](http://127.0.0.1:8080)
- **Busca por Cidade:** [http://127.0.0.1:8080/search?city=São+Paulo](http://127.0.0.1:8080/search?city=São+Paulo)
- **Detalhes do Cuidador:** [http://127.0.0.1:8080/cuidadores/cuid-001](http://127.0.0.1:8080/cuidadores/cuid-001)

### 3.4. Visualizar Logs em Tempo Real
```bash
docker compose logs -f
```
Ou filtrar apenas logs do NGINX ou da aplicação:
```bash
docker compose logs -f app
docker compose logs -f web
```

### 3.5. Parar e Remover os Contêineres
```bash
docker compose down
```

---

## 4. Ponto de Extensão Futura: PostgreSQL

Quando a camada de persistência em banco de dados for desenvolvida, o serviço do PostgreSQL será adicionado ao `docker-compose.yml` da seguinte forma:

```yaml
  db:
    image: postgres:16-alpine
    container_name: cuidaperto-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-cuidaperto}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-cuidaperto_local_pass}
      POSTGRES_DB: ${DB_NAME:-cuidaperto_db}
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - cuidaperto-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cuidaperto -d cuidaperto_db"]
      interval: 10s
      timeout: 5s
      retries: 5
```
*(Volumes nomeados `pgdata` garantirão a persistência dos dados).*
