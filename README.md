# HalpDask

API REST de HelpDesk desenvolvida em Node.js, Express e MySQL, seguindo a arquitetura:

`routes -> controllers -> services -> models -> database`

As senhas de solicitantes, técnicos e administradores são armazenadas somente como hash
`bcryptjs`. As rotas protegidas usam JWT no header `Authorization: Bearer <token>`.

## Requisitos

- Node.js
- MySQL

## Instalação

```bash
npm install
```

Copie `.env.example` para `.env`, configure a conexão do MySQL e gere uma chave JWT forte:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Depois, execute no MySQL, nesta ordem:

1. `database/create_database.sql`
2. `database/popular_BD.sql`

## Criar o primeiro administrador

O projeto não mantém uma senha administrativa padrão no repositório. Defina os dados
temporariamente no ambiente e execute o bootstrap:

```powershell
$env:ADMIN_NAME = 'Administrador do Sistema'
$env:ADMIN_EMAIL = 'admin@empresa.com'
$env:ADMIN_PASSWORD = 'informe-uma-senha-forte'
npm run admin:create
```

O comando recusa e-mails já usados por solicitantes, técnicos ou administradores.

## Permissões

- `SOLICITANTE`: cria e consulta somente os próprios chamados.
- `TECNICO`: atribui técnicos, altera status, registra soluções e exclui chamados.
- `ADMIN`: cadastra, edita e exclui técnicos e solicitantes.
- O cadastro público de técnico não é permitido.
- `POST /solicitantes` permanece público para permitir o auto cadastro de solicitantes.

## Contrato de autenticação

O login é feito por `POST /auth/login` e retorna um token JWT. Envie esse token nas
rotas protegidas:

```http
Authorization: Bearer <token>
```

Rotas públicas:

- `GET /` e `GET /health`
- `POST /auth/login`
- `POST /solicitantes`

Rotas protegidas:

- `GET /auth/me` e `PATCH /auth/password`: qualquer usuário autenticado.
- `GET /categorias` e `GET /categorias/:id`: qualquer usuário autenticado.
- `GET /tecnicos` e `GET /tecnicos/:id`: qualquer usuário autenticado.
- `GET`, `PUT` e `DELETE /solicitantes`: somente `ADMIN`.
- `POST`, `PUT` e `DELETE /tecnicos`: somente `ADMIN`.
- `GET /chamados` e `GET /chamados/:id`: técnicos e administradores consultam todos; solicitantes consultam somente os próprios.
- `POST /chamados`: somente `SOLICITANTE`; o solicitante é obtido do token.
- `PUT` e `DELETE /chamados/:id`: somente `TECNICO`.
- `GET /relatorios/chamados-por-status`: somente `TECNICO`.

## Fluxo recomendado

1. Criar o banco e executar os scripts SQL.
2. Criar o primeiro administrador com `npm run admin:create`.
3. Fazer login como `ADMIN` e cadastrar os técnicos.
4. Cadastrar um solicitante publicamente e fazer login como `SOLICITANTE`.
5. Criar o chamado como solicitante.
6. Fazer login como `TECNICO`, atribuir o técnico e atualizar o status/solução.
7. Consultar filtros e relatório usando o token do técnico.

Os casos de sucesso e de acesso negado (`401` e `403`) estão organizados em
`requests/api.rest`. Os tokens precisam ser copiados manualmente nas variáveis do arquivo.

## Execução

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

Exemplos de requisições REST estão em `requests/api.rest`.
