import "dotenv/config";
import { execSync } from "child_process";
import { getChallengeInfo } from "./getChallengeInfo.js";
import { writeFileSync, existsSync } from "fs";
import sanitizeFilename from "sanitize-filename";
import { generateFromTemplate } from "./template.js";
import { langExtensions } from "./langExtensions.js";
import { blue } from "yoctocolors";

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

  for (const submission of challengeInfo.submissionList) {
    const dir = `${projectDir}/${submission.lang}/${folderName}`;
    execSync(`mkdir -p ${dir}`);
    writeFileSync(`${dir}/README.md`, readme);

    writeFileSync(
      `${dir}/solution${langExtensions[submission.lang]}`,
      submission.code
    );
  }
  console.log(
    `Challenge ${blue(challengeInfo.title)} documented successfully!`
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
