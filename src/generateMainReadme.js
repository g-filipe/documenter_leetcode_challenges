import fs from "fs";
import "dotenv/config";
import { generateFromTemplate } from "./template.js";
import { isStudyPlan, sanitizeFolderName } from "./utils.js";
import path from "path";

const foldersExcludes = [".git", ".idea"];

const difficultyColorMapping = {
  Easy: "#308888",
  Medium: "#EBAB11",
  Hard: "#F23738",
};

export function generateMainReadme(listInfo) {
  const projectDir = process.env.PROJECT_DIR_PATH;
  const listDirectoryName = sanitizeFolderName(listInfo.listName);
  const languageFolders = [];

  try {
    getDirectories(`${projectDir}/${listDirectoryName}`).forEach(
      (languageDirectoryName) => {
        const languageFolder = {
          lang: languageDirectoryName.toUpperCase(),
          challenges: [],
          categoryFolders: [],
        };
        getDirectories(
          `${projectDir}/${listDirectoryName}/${languageDirectoryName}`
        ).forEach((directoryName) => {
          if (isStudyPlan(process.env.CHALLENGES_LIST_URL)) {
            const categoryDirectoryName = directoryName;
            const categoryFolder = {
              category: categoryDirectoryName.toUpperCase(),
              challenges: [],
            };
            getDirectories(
              `${projectDir}/${listDirectoryName}/${languageDirectoryName}/${categoryDirectoryName}`
            ).forEach((challengeDirectoryName) => {
              categoryFolder.challenges.push(
                documentChallenge(
                  projectDir,
                  listDirectoryName,
                  languageDirectoryName,
                  categoryDirectoryName,
                  challengeDirectoryName
                )
              );
            });
            languageFolder.categoryFolders.push(categoryFolder);
          } else {
            languageFolder.challenges.push(
              documentChallenge(
                projectDir,
                listDirectoryName,
                languageDirectoryName,
                null,
                directoryName
              )
            );
          }
        });
        languageFolders.push(languageFolder);
      }
    );
  } catch (err) {
    console.error("Erro ao ler a pasta:", err);
  }

  let mainReadme;

  if (isStudyPlan(process.env.CHALLENGES_LIST_URL)) {
    mainReadme = generateFromTemplate("mainReadmeStudyPlan.hbs", {
      languageFolders,
      challengeUrlList: process.env.CHALLENGES_LIST_URL,
      leetcodeProfile: process.env.LEETCODE_PROFILE,
      listName: listInfo.listName,
      summaryList: listInfo.summaryList,
      listDescription: listInfo.listDescription,
    });
  } else {
    mainReadme = generateFromTemplate("mainReadmeCustomList.hbs", {
      languageFolders,
      challengeUrlList: process.env.CHALLENGES_LIST_URL,
      leetcodeProfile: process.env.LEETCODE_PROFILE,
      listName: listInfo.listName,
    });
  }

  fs.writeFileSync(`${projectDir}/${listDirectoryName}/README.md`, mainReadme);
}

function getDirectories(directoryPath) {
  const files = fs.readdirSync(directoryPath, { withFileTypes: true });

  return files
    .filter((file) => file.isDirectory())
    .map((dir) => dir.name)
    .filter((dirName) => !foldersExcludes.includes(dirName));
}

function getDifficulty(filePath) {
  if (!fs.existsSync(filePath)) {
    throw `Arquivo não encontrado: ${filePath}`;
  }

  const fileContent = fs.readFileSync(filePath);
  const result = fileContent.toString().match(/Difficulty: ([\w ]+)/);

  if (!result || !result[1]) {
    throw `Erro ao extrair a dificuldade no arquivo: ${filePath}`;
  }

  return result[1];
}

function documentChallenge(
  projectDir,
  listDirectoryName,
  languageDirectoryName,
  categoryDirectoryName,
  challengeDirectoryName
) {

  const listDirName = process.env.USE_LIST_NAME_IN_README_URL == 'true' ? listDirectoryName : "";

  const challengePath = path.join(
    languageDirectoryName,
    categoryDirectoryName ?? "",
    challengeDirectoryName
  )

  let difficulty;

  try {
    difficulty = getDifficulty(`${projectDir}/${listDirectoryName}/${challengePath}/README.md`);
  } catch (err) {
    console.error(err);
    difficulty = "Unknown";
  }

  return {
    title: challengeDirectoryName.replaceAll("_", " "),
    url: `${process.env.REPOSITORY_URL}/${path.join(listDirName, challengePath)}`,
    difficulty,
    difficultyColor: difficultyColorMapping[difficulty],
  };
}
