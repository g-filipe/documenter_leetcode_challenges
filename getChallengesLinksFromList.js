import { green } from "yoctocolors";
import { getBrowserPage } from "./browser.js";
import { isStudyPlan } from "./utils.js";

export async function getChallengesLinksFromList(url) {
  console.log("Retrieving challenge list...");

  const page = await getBrowserPage();

  await page.goto(url);
  let listName;
  let challengeLinks;
  let listDescription;
  let summaryList;

  if (isStudyPlan(url)) {
    await page.waitForSelector("#__NEXT_DATA__");
    
    listName = await getElementContent(page, ".text-lc-text-primary");

    listDescription = await getElementContent(page, ".text-xs");

    summaryList = await page.evaluate(
      () =>
        document.querySelector(".list-disc li").parentElement.parentElement
          .innerHTML
    );

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

  console.log(green("Challenge list retrieved successfully!\n"));

  return {
    listName,
    challengeLinks,
    listDescription,
    summaryList,
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

async function getCustomListLinks(page, selector) {
  await page.waitForSelector(selector);

  const links = await page.$$eval(selector, (elements) =>
    elements.map((el) => ({
      url: el.href,
    }))
  );

  return links;
}
