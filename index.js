import "dotenv/config";
import { login } from "./login.js";
import { getChallengesLinksFromList } from "./getChallengesLinksFromList.js";
import { documenter } from "./documenter.js";
import { generateMainReadme } from "./generateMainReadme.js";
import { closeBrowser } from "./browser.js";

await login();

const urls = await getChallengesLinksFromList(
  process.env.CHALLENGES_LIST_URL
);

let count = 0;
for (const url of urls) {
  console.log(`Documenting challenge ${++count}/${urls.length} from ${url}`);
  await documenter(url);
}

await closeBrowser();

generateMainReadme();
