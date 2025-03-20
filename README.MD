## API Solid GymPass
   Bem-vindo ao repositório da API Solid GymPass, uma aplicação desenvolvida para gerenciar check-ins em academias, inspirada no modelo do Gympass. Este projeto foi construído com foco em boas práticas de desenvolvimento, como os princípios SOLID, DDD (Domain-Driven Design) e TDD (Test-Driven Development), utilizando Node.js e TypeScript.

## Sobre o Projeto
   A API Solid GymPass permite que usuários realizem check-ins em academias, com validações específicas, como a restrição de distância (ex.: check-in permitido apenas se o usuário estiver a até 100 metros da academia). Além disso, oferece funcionalidades para cadastro de usuários e academias, busca por academias próximas e gerenciamento de atividades físicas.

## Funcionalidades Principais

- **Registro e Autenticação de Usuários**: Cadastro de novos usuários e autenticação segura com JWT (JSON Web Token).
- **Gerenciamento de Academias**: Busca por academias próximas (até 10 km) e registro de novas academias (restrito a administradores).
- **Check-ins**: Permite que usuários realizem check-ins em academias, com validação de distância (máximo de 100 metros).
- **Histórico e Métricas**: Consulta do histórico de check-ins e métricas relacionadas às atividades do usuário.
- **Segurança**: Senhas criptografadas e controle de acesso baseado em papéis (RBAC).

## Tecnologias Utilizadas

- **Node.js**: Plataforma principal para o backend.
- **TypeScript**: Adiciona tipagem estática ao JavaScript para maior robustez.
- **Fastify**: Framework web leve e performático.
- **Prisma**: ORM para interação com o banco de dados PostgreSQL.
- **PostgreSQL**: Banco de dados relacional (utilizado via Docker).
- **Zod**: Validação de esquemas para dados de entrada.
- **Vitest**: Ferramenta de testes unitários e end-to-end.
- **Docker**: Containerização do banco de dados.
- **JWT**: Autenticação baseada em tokens.
- **Bcrypt**: Criptografia de senhas.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão 20.17 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/get-started) (para o banco de dados PostgreSQL)
- [Git](https://git-scm.com/)

## Como Configurar e Executar

Siga os passos abaixo para rodar a API localmente:

1. **Clone o Repositório**
   ```bash
   git clone https://github.com/RichardLirio/api_solid_GymPass.git
   cd api_solid_GymPass
   ```

2. **Instale as Dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   - Renomeie o arquivo `.env.example` para `.env`.
   - Preencha as variáveis necessárias, como:
     ```
     NODE_ENV=dev
     JWT_SECRET=sua_chave_secreta_aqui
     DATABASE_URL="postgresql://user:password@localhost:5432/gympass?schema=public"
     ```

4. **Inicie o Banco de Dados com Docker**
   ```bash
   docker compose up -d
   ```

5. **Execute as Migrações do Prisma**
   ```bash
   npx prisma migrate dev
   ```

6. **Inicie a API**
   ```bash
   npm run dev
   ```
   A API estará disponível em `http://localhost:3333`.

## Testes

O projeto inclui testes unitários e end-to-end para garantir a robustez da aplicação.

- **Rodar Testes Unitários**
  ```bash
  npm run test
  ```

- **Rodar Testes End-to-End**
  ```bash
  npm run test:e2e
  ```

## Rotas Principais

Aqui estão algumas das principais rotas disponíveis na API:

- **POST /users**: Registra um novo usuário.
- **POST /sessions**: Autentica um usuário e retorna um token JWT.
- **PATCH /token/refresh**: Renova o token JWT.
- **GET /gyms/nearby**: Busca academias próximas (até 10 km).
- **POST /gyms**: Cria uma nova academia (apenas administradores).
- **POST /check-ins**: Realiza um check-in em uma academia.
- **GET /check-ins/history**: Retorna o histórico de check-ins do usuário.

Para detalhes completos das rotas e payloads, consulte a documentação ou utilize uma ferramenta como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/).

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias ou correções.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

