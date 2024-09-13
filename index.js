import "dotenv/config";
import { login } from "./login.js";
import { getChallengesLinksFromList } from "./getChallengesLinksFromList.js";
import { documenter } from "./documenter.js";
import { generateMainReadme } from "./generateMainReadme.js";
import { closeBrowser } from "./browser.js";

// await login();

const listInfo = await getChallengesLinksFromList(
  process.env.CHALLENGES_LIST_URL
);

// let count = 0;
// for (const challengeLink of listInfo.challengeLinks) {
//   console.log(`Documenting challenge ${++count}/${listInfo.challengeLinks.length} from ${challengeLink.url}`);
//   await documenter(listInfo.listName, challengeLink.category, challengeLink.url);
// }

await closeBrowser();

generateMainReadme(listInfo);
