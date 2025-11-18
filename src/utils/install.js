import { exec } from "child_process";
import chalk from "chalk";
export async function installDependencies(projectDir, orm, database, typescript) {
    const deps = ["fastay-core", "dotenv"];
    const devDeps = [];
    if (typescript) {
        devDeps.push("typescript", "@types/node", "ts-node", "tsconfig-paths");
    }
    if (orm === "prisma") {
        deps.push("@prisma/client");
        devDeps.push("prisma");
    }
    if (orm === "drizzle") {
        deps.push("drizzle-orm");
        deps.push("drizzle-kit");
    }
    if (database === "postgres")
        deps.push("pg");
    if (database === "mysql")
        deps.push("mysql2");
    if (database === "sqlite")
        deps.push("better-sqlite3");
    await run(`npm install ${deps.join(" ")}`, projectDir);
    if (devDeps.length > 0)
        await run(`npm install -D ${devDeps.join(" ")}`, projectDir);
}
function run(cmd, cwd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd }, (err, stdout, stderr) => {
            if (err) {
                console.error(chalk.red("Error installing dependencies"));
                reject(err);
            }
            else
                resolve();
        });
    });
}
//# sourceMappingURL=install.js.map