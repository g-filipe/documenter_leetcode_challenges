import handlebars from "handlebars";
import { readFileSync } from "fs";

const TEMPLATES_DIR = "templates";

export function generateFromTemplate(templateFileName, data) {
  const source = readFileSync(
    `${TEMPLATES_DIR}/${templateFileName}`
  ).toString();

  const template = handlebars.compile(source);

  return template(data);
}
