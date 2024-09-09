import { getBrowserPage } from "./browser.js";
import { getSubmissionCodeList } from "./getSubmission.js";
import { getLeetcodeSession } from "./login.js";
import { markdownConverter } from "./markdownConverter.js";

export async function getChallengeInfo(url) {
  const page = await getBrowserPage();
  await page.goto(url);

  let description = await getElementContent(page, ".elfjS");

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
  if (isSql(submissionList)) {
    description = markdownConverter(description);
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

const sqlLangs = ['mysql', 'mssql', 'oraclesql','pythondata','postgresql']

function isSql(submissionList) {
  return submissionList.some((submission) => sqlLangs.includes(submission.lang))

}