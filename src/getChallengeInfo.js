import { getBrowserPage } from "./browser.js";
import { getSubmissionCodeList } from "./getSubmission.js";
import { getLeetcodeSession } from "./login.js";
import { markdownConverter } from "./markdownConverter.js";

export async function getChallengeInfo(url) {
  const page = await getBrowserPage();
  await page.goto(url);

  let description;

  const title = await getElementContent(page, ".text-title-large");
  const difficulty = await getElementContent(
    page,
    'div[class*="text-difficulty-"]'
  );

  const challengeId = getChallengeId(url);
  const submissionList = await getSubmissionCodeList(
    challengeId,
    await getLeetcodeSession()
  );

  const codeLang = await page.evaluate(
    () => document.querySelectorAll(".popover-wrapper button")[1]?.textContent
  );

  if (isSql(codeLang)) {
    description = await getElementContent(page, ".elfjS");
    description = markdownConverter(description);
  } else {
    description = await getElementInnerHtml(page, ".elfjS");
  }

  return {
    title,
    difficulty,
    description,
    submissionList,
  };
}

async function getElementContent(page, selector) {
  await page.waitForSelector(selector);

  const element = await page.$(selector);

  return await page.evaluate((el) => el.textContent, element);
}

async function getElementInnerHtml(page, selector) {
  await page.waitForSelector(selector);

  const element = await page.$(selector);

  return await page.evaluate((el) => el.innerHTML, element);
}

export function getChallengeId(url) {
  const challengeId = url.match(/problems\/([^\/?]*)/)[1];
  return challengeId;
}

const sqlLangs = ["MySQL","MS SQL Server", "Oracle", "Pandas", "PostgreSQL"];

function isSql(codeLang) {
  return sqlLangs.includes(codeLang);
}
