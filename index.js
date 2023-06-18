import puppeteer from "puppeteer";
import { writeExcel, writeJson } from "./utils/index.js";
import randomUseragent from "random-useragent";

const main = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      // slowMo: 100,
    });

    const page = await browser.newPage();
    const userAgent = randomUseragent.getRandom();
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto("http://quotes.toscrape.com");

    const data = [];
    let hasNextData = true;
    while (hasNextData) {
      const result = await page.evaluate(() => {
        const quotes = document.querySelectorAll(".quote");
        if (!quotes) return 

        const pageData = [...quotes].map((quote, index) => {
          const quoteText = quote.querySelector(".text").innerText;
          const author = quote.querySelector(".author").innerText;
          const tags = [...quote.querySelectorAll(".tag")].map((tag) =>
            tag.innerText
          );

          return { quoteText, author, tags };
        });
        return pageData
      });

      data.push(...result)

      const hasNextButton = await page.$('li.next > a');
      if (!hasNextButton) {
        hasNextData = false;
        break
      }
      await page.click(`li.next > a`);
    }

    const dataWithId = data.map((quote, index) => ({ id: index + 1, ...quote }))

    await page.screenshot({ path: './data/screens/example.png'})
    await browser.close();

    await writeExcel(dataWithId)
    await writeJson(dataWithId)
  } catch (err) {
    console.log(err);
  }
};

main();
