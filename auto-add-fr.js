// const scanUser = require('scan-user-id')
const puppeteer = require("puppeteer");
const CronJob = require("cron").CronJob;

const { convertCookieFacebook } = require("./cookie");

async function clickAdd(page) {
  await page.click('a[href*="/a/mobile/friends/profile_add_friend"]');
}

async function main() {
  // List user id in group
  const userId = ["100043842166914"];
  let urlUser = "https://d.facebook.com/";
  const cookie =
    "sb=a6beXUxmABU9xS0KwkR3clpz; datr=bqbeXSqfBPU00FnuRWVrufnK; c_user=100005594357809; xs=37%3AgppwjlYVK9nNNQ%3A2%3A1574872721%3A5941%3A6351; fr=1CkYMcQ7QrlGloZLL.AWVp-p73xTlDw2MyWOUkofjMkg4.Bd3qZr.CE.AAA.0.0.Bd3qaR.AWUROxoR; spin=r.1001477064_b.trunk_t.1574872722_s.1_v.2_; wd=927x969; act=1574875261097%2F0; presence=EDvF3EtimeF1574875264EuserFA21B05594357809A2EstateFDt3F_5bDiFA2thread_3a1607618295944707A2EoF1EfF1C_5dEutc3F1574874678623G574875264955Elm3FnullCEchFDp_5f1B05594357809F1CC";

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  const cookieConverted = await convertCookieFacebook(cookie);
  await page.setCookie(...cookieConverted);
  await page.setViewport({
    width: 1368,
    height: 800
  });

  // Auto click add friend after 1m
  let indexUserId = -1;
  const clickAddFr = new CronJob("0 * * * * *", async () => {
    indexUserId++;
    if (indexUserId < userId.length) {
      await page.goto(urlUser + userId[indexUserId], {
        waitUntil: "networkidle2"
      });
      await clickAdd(page);
    } else {
      return false;
    }
  });
  clickAddFr.start();
}

main();
