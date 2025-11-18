import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyTemplate(templateName: string, dest: string) {
  const templatePath = path.join(__dirname, "../../templates", templateName);

  await fs.copy(templatePath, dest);
}
