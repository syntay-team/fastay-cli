import prompts from "prompts";
export async function promptProjectInfo(initialName) {
    const questions = [
        {
            type: initialName ? null : "text",
            name: "name",
            message: "What is your project name?",
            initial: "fastay-app"
        },
        {
            type: "select",
            name: "orm",
            message: "Choose an ORM:",
            choices: [
                { title: "Prisma", value: "prisma" },
                { title: "Drizzle", value: "drizzle" },
                { title: "Sequelize", value: "sequelize" },
                { title: "None", value: "none" }
            ]
        },
        {
            type: "select",
            name: "database",
            message: "Choose a database:",
            choices: [
                { title: "PostgreSQL", value: "postgres" },
                { title: "MySQL", value: "mysql" },
                { title: "SQLite", value: "sqlite" },
                { title: "MongoDB", value: "mongo" },
                { title: "None", value: "none" }
            ]
        },
        {
            type: "select",
            name: "typescript",
            message: "Use TypeScript?",
            initial: 0,
            choices: [
                { title: "Yes", value: true },
                { title: "No", value: false }
            ]
        }
    ];
    const result = await prompts(questions);
    return {
        name: initialName || result.name,
        ...result
    };
}
//# sourceMappingURL=prompts.js.map