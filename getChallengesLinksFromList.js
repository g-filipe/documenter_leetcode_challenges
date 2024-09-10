import { getBrowserPage } from "./browser.js";

export async function getChallengesLinksFromList(url) {
  console.log("Retrieving challenge list...");

  const page = await getBrowserPage();

  await page.goto(url);
  let listName;
  let challengeLinks;

  if (url.includes("/studyplan/")) {
    await page.waitForSelector("#__NEXT_DATA__");
    listName = await getElementContent(page, ".text-lc-text-primary");
    challengeLinks = await page.evaluate(() =>
      JSON.parse(
        document.querySelector("#__NEXT_DATA__").innerHTML
      ).props.pageProps.dehydratedState.queries[0].state.data.studyPlanV2Detail.planSubGroups.reduce(
        (acc, subGroup) => [
          ...acc,
          ...subGroup.questions.map((question) => ({
            url: `https://leetcode.com/problems/${question.titleSlug}`,
            category: subGroup.name,
          })),
        ],
        []
      )
    );
  } else {
    listName = await getElementContent(
      page,
      ".rounded-sd-lg .text-sd-foreground"
    );
    challengeLinks = await getCustomListLinks(
      page,
      'div[data-rbd-draggable-context-id] a[href^="/problems/"]'
    );
  }

  console.log("Challenge list retrieved successfully!");

  return {
    listName,
    challengeLinks,
  };
}

async function getElementContent(page, selector) {
  await page.waitForSelector(selector);

  const element = await page.$(selector);

  return await page.evaluate((el) => el.textContent, element);
}

async function getCustomListLinks(page, selector) {
  await page.waitForSelector(selector);

  const links = await page.$$eval(selector, (elements) =>
    elements.map((el) => ({
      url: el.href,
    }))
  );

  return links;
}
