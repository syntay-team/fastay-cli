# 🚀 Fastay CLI

`fastay` é uma ferramenta de linha de comando (CLI) para criar e gerenciar projetos backend modernos com **Fastay.js**, permitindo gerar rapidamente aplicações configuradas com TypeScript, ORMs e muito mais.

---

## 🔹 Instalação

Você pode instalar globalmente via npm:

```bash
npm install -g fastay
```

Ou usar diretamente com `npx` sem instalar:

```bash
npx fastay <comando>
```

---

## 🔹 Comandos

| Comando                    | Descrição                                                                        |
| -------------------------- | -------------------------------------------------------------------------------- |
| `fastay create-app <nome>` | Cria um novo projeto Fastay com base em templates.                               |
| `fastay dev`               | Inicia o servidor de desenvolvimento.                                            |
| `fastay dev:watch`         | Inicia o servidor de desenvolvimento com watch mode (recarrega automaticamente). |
| `fastay build`             | Compila o projeto para produção (TypeScript → JavaScript).                       |
| `fastay start`             | Inicia o projeto compilado em produção.                                          |

---

## 🔹 Exemplos

Criar um novo projeto:

```bash
fastay create-app my-api
# ou usando npx
npx fastay create-app my-api
```

Rodar o servidor de desenvolvimento:

```bash
cd my-api
fastay dev
```

Compilar para produção:

```bash
fastay build
fastay start
```

---

## 🔹 Funcionalidades

- Geração automática de projetos backend modernos.
- Suporte completo a TypeScript.
- Integração com ORMs (Prisma, Drizzle, Kysely, TypeORM, Sequelize) ou acesso direto a SQL.
- Templates prontos para APIs REST.
- Fácil uso via `npx` sem necessidade de instalação global.

---

## 🔹 Contribuição

Contribuições são bem-vindas!

1. Faça um fork do projeto.
2. Crie uma branch (`git checkout -b minha-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Push para a branch (`git push origin minha-feature`).
5. Abra um Pull Request.

---

## 🔹 Licença

MIT © Syntay Team

---
