# 🚀 Fastay CLI

`fastay` is a command-line interface (CLI) tool for creating and managing modern backend projects with **Fastay.js** - a lightweight, TypeScript-first framework for building APIs quickly and predictably.

<div align="center">

**📦 Get Started**: [@syntay/fastay on npm](https://www.npmjs.com/package/@syntay/fastay) • 
**🐙 Source Code**: [GitHub Repository](https://github.com/syntay-team/fastay)

</div>

---

## 🔹 Installation

You can install it globally via npm:

```bash
npm install -g fastay
```

Or use directly with npx without installation:

```bash
npx fastay <command>
```

---

## 🔹 Commands

| Command                    | Description                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| `fastay create-app <name>` | Creates a new Fastay project based on templates.                           |
| `fastay dev`               | Starts the development server.                                              |
| `fastay dev:watch`         | Starts the development server with watch mode (auto-reload).               |
| `fastay build`             | Builds the project for production (TypeScript → JavaScript).               |
| `fastay start`             | Starts the compiled project in production mode.                            |

---

## 🔹 Examples

Create a new project:

```bash
fastay create-app my-api
# or using npx
npx fastay create-app my-api
```

Run development server:

```bash
cd my-api
fastay dev
```

Build for production:

```bash
fastay build
fastay start
```

---

## 🔹 Features

- Automatic generation of modern backend projects.
- Full TypeScript support.
- Integration with ORMs (Prisma, Drizzle, Kysely, TypeORM, Sequelize) or direct SQL access.
- Ready-to-use REST API templates.
- Easy usage via `npx` without global installation required.

---

## 🔹 Contributing

Contributions are welcome!

--

## 🔹 License

MIT © Syntay Team

---


