const { parse } = require("node-html-parser");
const puppeteer = require("puppeteer");

const url = "https://www.flashscore.com.br/equipe/flamengo/WjxY29qB/";

const scrape = async () => {
  try {
    const browser = await puppeteer
      .launch
      // { headless: false }
      ();
    const page = await browser.newPage();

    await page.goto(url);

    const data = await page.evaluate(() => document.body.innerHTML);

    // await page.screenshot({ path: "site.png" });

    await browser.close();

    const dom = parse(data);

    const region = dom.querySelector(".event__title--type").textContent;
    const league = dom.querySelector(".event__title--name").textContent;
    const homeTeam = dom.querySelector(".event__participant--home").textContent;
    const awayTeam = dom.querySelector(".event__participant--away").textContent;

    const score = dom.querySelector(".event__scores").querySelectorAll("span");

    const scores = {
      home: score[0].textContent,
      away: score[1].textContent,
    };

    const lastGame = `${region}-${league}: ${homeTeam} ${scores.home} x ${scores.away} ${awayTeam}`;

    return lastGame;
  } catch (error) {
    console.log(error);
  }
};

scrape().then(console.log);
