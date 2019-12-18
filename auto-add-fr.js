// const scanUser = require('scan-user-id')
const puppeteer = require("puppeteer");
const CronJob = require("cron").CronJob;

const { convertCookieFacebook } = require("./cookie");

async function clickAdd(page) {
  await page.click('a[href*="/a/mobile/friends/profile_add_friend"]');

  console.log("add success!");
  console.log("AddFr Finish ...!");
}

// const clickAddFr = new CronJob("0 * * * * *", async () => {
//   await clickAdd(page);
//   console.log("test");
// });

// const index = -1;
// async function autoClick(page, userId) {
//   index++;
//   await page.goto(urlUser + userId[index], {
//     waitUntil: "networkidle2"
//   });

//   clickAddFr.start();
//   await page.waitFor(1000);
//   clickAddFr.stop();
//   console.log("Added friend with id " + userId[index]);

//   if (index < userId.length) return autoClick(page, userId);
// }

async function main() {
  const userId = ["100043842166914", "100011521398663"];
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
  // await page.waitFor(1000);

  for (index = 0; index < userId.length; index++) {
    await page.goto(urlUser + userId[index], {
      waitUntil: "networkidle2"
    });

    await page.waitFor(5000);
    await clickAdd(page);

    console.log("Success ...!");
  }
}

main();
