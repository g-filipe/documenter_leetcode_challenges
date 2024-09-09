import puppeteer from "puppeteer";

let browser, page;

export async function getBrowserPage() {
  if (page) return page;

  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      userDataDir: "session",
    });
  }

  return page = (await browser.pages())[0];
}

export async function closeBrowser() {
  if (!browser) return;

  await browser.close();
  
  browser = page = null;
}
