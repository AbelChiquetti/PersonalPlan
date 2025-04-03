# PersonalPlan - Sistema de Controle Financeiro Pessoal

Uma aplicação web moderna para gerenciar suas finanças pessoais, com suporte a transações em Real (BRL) e Dólar (USD).

## Características

- Cadastro de receitas e despesas
- Suporte a múltiplas moedas (BRL e USD) com conversão automática
- Marcação de transações recorrentes
- Visualização de saldo e histórico de transações
- Dashboard com resumo financeiro
- Atualização automática da cotação do dólar
- Interface responsiva e amigável

## Tecnologias Utilizadas

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite (desenvolvimento)
- Axios
- React Hook Form + Zod
- date-fns

## Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório

```bash
git clone https://github.com/seuusuario/personalplan.git
cd personalplan
```

2. Instale as dependências

```bash
npm install
# ou
yarn install
```

3. Configure o banco de dados

```bash
npx prisma migrate dev
```

4. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

5. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

- `/src/app` - Páginas da aplicação (Next.js App Router)
- `/src/components` - Componentes React
- `/src/lib` - Utilitários e configurações
- `/prisma` - Esquema e migrações do banco de dados

## Licença

Este projeto está licenciado sob a licença MIT.
