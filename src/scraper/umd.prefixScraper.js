const puppeteer = require("puppeteer");
const fs = require("fs");
require("colors");
const filename = "./umd.prefixes.json"

const url = "https://app.testudo.umd.edu/soc/202308";

async function getAllCourseUrls() {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: false,
  });
  const [page] = await browser.pages();
  await page.goto(url);
  await page.waitForSelector(".prefix-abbrev");
  const prefixes = await page.$$eval(".prefix-abbrev", (prefixes) =>
    prefixes.map((prefix) => prefix.innerText)
  );
  await browser.close();
  return prefixes;
}

getAllCourseUrls().then(
  prefixes => {
    fs.writeFile(filename, JSON.stringify(prefixes, null, 2), (error) => {
      if (error) console.error(error.message.red);
      console.log("new courses added successfully".green);
    })
  }
);
