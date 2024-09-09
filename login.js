import puppeteer from "puppeteer";

let leetcodeSession;

export async function login() {
  
  if (leetcodeSession) {
    return leetcodeSession;
  }

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir:'session'
  });

  const page = await browser.newPage();
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

  const leetcodeSessionCookie = result.cookies.find(
    (cookie) => cookie.name == "LEETCODE_SESSION"
  );

  leetcodeSession = leetcodeSessionCookie.value;

  return leetcodeSession;
}
