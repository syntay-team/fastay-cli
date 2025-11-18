import fs from "fs-extra";
import path from "path";
export async function copyTemplate(templateName, dest) {
    const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), "../../templates", templateName);
    await fs.copy(templatePath, dest);
}
//# sourceMappingURL=copyTemplate.js.map