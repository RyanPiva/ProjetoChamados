# Chamados

Sistema de gestão de chamados com frontend em Next.js, backend em NestJS, banco MySQL e cache Redis, tudo orquestrado com Docker Compose.

## Visão geral

- Frontend: Next.js + React + TypeScript
- Backend: NestJS + Prisma + WebSocket
- Banco: MySQL 8
- Cache: Redis
- Infra: Docker Compose

## Requisitos

- Docker Desktop
- Docker Compose
- Git

## Como rodar em 3 passos

Clone o repositório:

```bash
git clone seu-repo
cd seu-repo
```

Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

Suba todos os containers:

```bash
docker compose up --build
```

## Acesso local

- Frontend: http://localhost:3000
- API: http://localhost:3001
- WebSocket: ws://localhost:3001
- MySQL: localhost:3306
- Redis: localhost:6379

## Estrutura do projeto

```bash
chamados/
├── .env.example
├── docker-compose.yml
├── apps/
│   ├── Back/
│   │   ├── Dockerfile
│   │   ├── prisma/
│   │   └── src/
│   └── Front/
│       ├── Dockerfile
│       └── src/
└── README.md
```

## Variáveis de ambiente

O arquivo [.env.example](.env.example) já contém os valores padrão para desenvolvimento local:

```env
MYSQL_ROOT_PASSWORD=root123
MYSQL_USER=chamados
MYSQL_PASSWORD=chamados123
MYSQL_DATABASE=chamados

DATABASE_URL=mysql://chamados:chamados123@mysql:3306/chamados
REDIS_URL=redis://redis:6379
PORT=3001
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
JWT_SECRET=troque-por-um-segredo-forte
```

Se quiser trocar dados sensíveis ou portas, edite o arquivo `.env` antes de subir os containers.

## Comandos úteis

Subir em background:

```bash
docker compose up --build -d
```

Parar tudo:

```bash
docker compose down
```

Ver logs:

```bash
docker compose logs -f
```

Executar migration do Prisma dentro do container da API:

```bash
docker compose exec api npx prisma migrate deploy
```

Rebuild apenas da aplicação web:

```bash
docker compose build web
```

## Observações importantes

- O projeto foi configurado para funcionar com containers e não exige instalação local do MySQL ou Redis.
- As dependências do frontend e do backend são instaladas automaticamente durante o build do Docker.
- O banco é persistido em volume Docker, então os dados continuam entre reinicializações do container.

## Troubleshooting

### Erro ao subir o container web

Se aparecer erro de `npm ci`, verifique se o arquivo `package-lock.json` existe no app. Neste projeto, o Dockerfile foi ajustado para usar `npm install` para garantir o build sem intervenção manual.

### API não conecta no banco

Verifique se o container do MySQL está saudável:

```bash
docker compose ps
```

E se necessário execute:

```bash
docker compose restart api
```

## Licença

Este projeto foi desenvolvido como aplicação interna para gestão de tickets e pode ser adaptado conforme a necessidade da equipe.

