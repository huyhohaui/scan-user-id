const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const random = require("random");

const { convertCookieFacebook } = require("./cookie");

Object.defineProperty(Array.prototype, "flat", {
  value: function(depth = 1) {
    return this.reduce(function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten
      );
    }, []);
  }
});

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 200;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        console.log(totalHeight);
        console.log(scrollHeight);

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
          console.log("finish ... !");
        }
      }, 500);
    });
  });
}

let userList = [];

const getUserIdList = async page => {
  await autoScroll(page);
  // Get user id in Group members
  const userIdList = await page.evaluate(async () => {
    const userIdValue = document.querySelectorAll('table[id*="member_"]');
    return Array.from(userIdValue).map(item => item.id.split("member_")[1]);
  });
  userList.push(userIdList);

  if ((await page.$("div#m_more_item")) !== null) {
    await page.click("div#m_more_item a");
    await getUserIdList(page);
  }
};

async function main() {
  const groupID = "1719912018231214"; //2247849925503884
  const url = "https://d.facebook.com/browse/group/members/?id=" + groupID;
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
  await page.goto(url, {
    waitUntil: "networkidle2"
  });

  await getUserIdList(page);
  userList = userList.flat(1);

  console.log(userList);
  await browser.close();
}

main();
