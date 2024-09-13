import "dotenv/config";
import { execSync } from "child_process";
import { getChallengeInfo } from "./getChallengeInfo.js";
import { writeFileSync } from "fs";
import { generateFromTemplate } from "./template.js";
import { langExtensions } from "./langExtensions.js";
import { blue, red } from "yoctocolors";
import path from "path";
import { sanitizeFolderName, sleep } from "./utils.js";

export async function documenter(listName, category, url) {
  const challengeInfo = await getChallengeInfo(url);
  const readme = generateFromTemplate("challengeReadme.hbs", challengeInfo);
  const projectDir = process.env.PROJECT_DIR_PATH;
  const folderName = sanitizeFolderName(challengeInfo.title);

  await sleep(2000);

  for (const submission of challengeInfo.submissionList) {
    const dir = path.join(
      projectDir,
      sanitizeFolderName(listName),
      submission.lang,
      category ? sanitizeFolderName(category) : "",
      folderName
    );
    execSync(`mkdir -p ${dir}`);
    writeFileSync(`${dir}/README.md`, readme);

    writeFileSync(
      `${dir}/solution${langExtensions[submission.lang]}`,
      submission.code
    );
  }
  if (challengeInfo.submissionList.length == 0) {
    console.log(
      `${blue(challengeInfo.title)} ${red("- there isn't any solution for this challenge!\n")}`
    );
  } else {
    console.log(
      `${blue(challengeInfo.title)} documented successfully!\n`
    );
  }
}
