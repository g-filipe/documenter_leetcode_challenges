import "dotenv/config";
import { login } from "./login.js";
import { getChallengesLinksFromList } from "./getChallengesLinksFromList.js";
import { documenter } from "./documenter.js";
import { generateMainReadme } from "./generateMainReadme.js";
import { closeBrowser } from "./browser.js";

await login();

const {listName, challengeLinks} = await getChallengesLinksFromList(
  process.env.CHALLENGES_LIST_URL
);

let count = 0;
for (const challengeLink of challengeLinks) {
  console.log(`Documenting challenge ${++count}/${challengeLinks.length} from ${challengeLink.url}`);
  await documenter(listName, challengeLink.category, challengeLink.url);
}

await closeBrowser();

// generateMainReadme();
