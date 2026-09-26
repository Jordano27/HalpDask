# HalpDask

API REST de HelpDesk implementada em Node.js, Express e MySQL, seguindo arquitetura em camadas e autenticação JWT:

`routes -> controllers -> services -> models -> database`

As senhas de solicitantes e técnicos são armazenadas somente como hash `bcryptjs` na respectiva tabela. As rotas de negócio exigem um token JWT no header `Authorization`.

## Requisitos

- Node.js
- MySQL 

## Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e ajuste as credenciais do MySQL:

```
RODE  PARA CRIAR A CHAVE SECRETA JWT:
 `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

Depois, execute no MySQL, nesta ordem:

1. `database/create_database.sql`
2. `database/popular_BD.sql`


## Execução

```bash
npm run dev
```
A API ficará disponível em `http://localhost:3000`.
```

Exemplos completos para o REST Client estão em `requests/api.rest`.
