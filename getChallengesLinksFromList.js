import { getBrowserPage } from "./browser.js";

export async function getChallengesLinksFromList(url) {
  console.log('Retrieving challenge list...');

  const page = await getBrowserPage();

  await page.goto(url);

  const challenges = await getElementContent(
    page,
    'div[data-rbd-draggable-context-id] a[href^="/problems/"]'
  );

  console.log('Challenge list retrieved successfully!');
  
  return challenges;
}

async function getElementContent(page, selector) {
  await page.waitForSelector(selector);

  const links = await page.$$eval(selector, (elements) =>
    elements.map((el) => el.href)
  );

  return links;
}
