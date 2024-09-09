import puppeteer from "puppeteer";
import { getLeetcodeSession } from "./login.js";

export async function getChallengeInfo(url) {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(url);

  const description = await getElementContent(page, ".elfjS");
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

export function getChallengeId(url) {
  const challengeId = url.match(/problems\/([^\/?]*)/)[1];
  console.log({ challengeId });
  return challengeId;
}