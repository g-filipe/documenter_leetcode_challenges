import "dotenv/config";
import { execSync } from "child_process";
import { getChallengeInfo } from "./getChallengeInfo.js";
import { writeFileSync, existsSync } from "fs";
import sanitizeFilename from "sanitize-filename";
import { generateFromTemplate } from "./template.js";

export async function documenter(url) {
  const challengeInfo = await getChallengeInfo(url);
  const readme = generateFromTemplate("challengeReadme.hbs", challengeInfo);
  const projectDir = process.env.PROJECT_DIR_PATH;
  const folderName = sanitizeFilename(
    challengeInfo.title.replace(".", "").replaceAll(" ", "_"),
    { replacement: "_" }
  );

  if (existsSync(`${projectDir}/${folderName}`)) {
    return;
  }

  await sleep(2000);

  try {
    execSync(`mkdir -p ${projectDir}/challenges/${folderName}`);
    console.log(`Pasta ${folderName} criada com sucesso!`);
  } catch (error) {
    console.error(`Erro ao criar a pasta ${folderName}:`, error);
  }

  writeFileSync(`${projectDir}/challenges/${folderName}/README.md`, readme);
  writeFileSync(
    `${projectDir}/challenges/${folderName}/solution.sql`,
    challengeInfo.submission
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
