import puppeteer from "puppeteer";

export async function getChallengesLinksFromList(url) {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: 'session'
  });

  const page = await browser.newPage();

  await page.goto(url);

  const challenges = await getElementContent(
    page,
    'div[data-rbd-draggable-context-id] a[href^="/problems/"]'
  );

  await browser.close();

  return challenges;
}

async function getElementContent(page, selector) {
  await page.waitForSelector(selector);

  const links = await page.$$eval(selector, (elements) =>
    elements.map((el) => el.href)
  );

  return links;
}