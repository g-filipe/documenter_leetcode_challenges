import puppeteer from "puppeteer";
import { getLeetcodeSession } from "./login.js";
import { markdownConverter } from "./markdownConverter.js";

let isSql = process.env.IS_SQL == 'true';

export async function getChallengeInfo(url) {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(url);

  let description;

  if (isSql) {
    description = await getElementContent(page, ".elfjS");
    description = markdownConverter(description);
  
  } else {
    description = await getElementInnerHtml(page, ".elfjS");
  }

  const title = await getElementContent(page, ".text-title-large");
  const difficulty = await getElementContent(
    page,
    'div[class*="text-difficulty-"]'
  );

  await browser.close();

  const challengeId = getChallengeId(url);
  const submission = await getSubmissionCode(challengeId, await getLeetcodeSession());

  return {
    title,
    difficulty,
    description,
    submission
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
  console.log({ challengeId });
  return challengeId;
}