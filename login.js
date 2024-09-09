import puppeteer from "puppeteer";

let leetcodeSession;

export async function login() {
  console.log("Logging in... ");

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "session",
    defaultViewport: null,
    args: ["--hide-crash-restore-bubble"],
  });

  const page = (await browser.pages())[0];

  await page.goto("https://leetcode.com/accounts/login/");
  await page.waitForFunction(
    'document.location.href == "https://leetcode.com/"',
    {
      timeout: 3000000,
    }
  );

  const client = await page.createCDPSession();
  const result = await client.send("Network.getAllCookies");

  await browser.close();

  console.log("Logged in successfully!");

  const leetcodeSessionCookie = result.cookies.find(
    (cookie) => cookie.name == "LEETCODE_SESSION"
  );

  leetcodeSession = leetcodeSessionCookie.value;
}

export async function getLeetcodeSession() {
  if (!leetcodeSession) {
    await login();
  }
  return leetcodeSession;
}
