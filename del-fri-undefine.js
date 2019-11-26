const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const random = require("random");

const { convertCookieFacebook } = require("./cookie");
// access_token =
//   "EAAAAZAw4FxQIBACDMFlujEnwySrbc0sfIQrSzV8UifbjK6iBKu0KVi2PSy0Aafc4vp6zjsIZARxkjUZBKhQZBZAVuZCCgI3qWvwjveZCyoB36cyW352y73MEzEsojrQF5XMJDheyDZBL5IquRO5EMBllDEGqZBG43ZBx6wqZB6CiuKgWZANTN9KnyOiq3e22Q93oGswZD";

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 200;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
          console.log("finish ... !");
        }
      }, 500);
    });
  });
}

async function unFriends(checkDie, page) {
  await page.focus(
    'li[class="_698"] div[class="_5t4x"] div[class="FriendButton"]'
  );
  await page.click(
    'div[class="_5v-0 _53il"] li[class="uiMenuItem FriendListUnfriend underShowMore selected"]' 
  );
  console.log('Delete a friend success !')

  await page.waitFor(random((min = 1000), (max = 3000)));
  if (checkDie !== null) return unFriends(checkDie, page);
}

async function main() {
  const url = "https://facebook.com/shhuyhaui/friends";
  const cookie =
    "datr=XarOXb3xJE0VaVYBjqYhkE9o; sb=KsHOXcVHl2iM13noOzVgdVOA; js_ver=3609; c_user=100005594357809; xs=24%3Al8_EwczOEKPU1g%3A2%3A1574300810%3A5941%3A6351; spin=r.1001469214_b.trunk_t.1574502222_s.1_v.2_; fr=1rUTekif8BN1PyqCA.AWXOaCzT8Qop0_2isvZv7VIx0Zw.Bdzqpd.vi.AAA.0.0.Bd2VYb.AWXeYGX6; act=1574526988571%2F198; wd=1920x390; presence=EDvF3EtimeF1574527465EuserFA21B05594357809A2EstateFDsb2F1574527466042EatF1574527465764Et3F_5bDiFA2user_3a1B06860820623A2EoF1EfF1CAcDiFA2thread_3a2544487075597773A2EoF2EfF2CAcDiFA2thread_3a1803472099687203A2EoF3EfF3C_5dEutc3F1574527464110G574527465770Elm3FnullCEchFDp_5f1B05594357809F1CC";
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const cookieConverted = await convertCookieFacebook(cookie);
  await page.setCookie(...cookieConverted);
  await page.setViewport({ width: 1368, height: 720 });
  await page.waitFor(1000);
  try {
    await page.goto(url, { waitUntil: "load", timeout: 0 });
  } catch (error) {
    throw new Error(error);
  }

  const checkEndPointListFr = await page.$(
    'div[class="mbm _5vf sectionHeader _4khu"] h3[class="uiHeaderTitle"]'
  );
  // console.log("checkEndPointListFr: ", checkEndPointListFr);

  autoScroll(page);
  await page.waitFor(120000) //wait for puppeteer's loading page

  const checkDie = await page.$(
    'li[class="_698"] div[class="_6a _6b"] a[class="_39g5"]'
  );

  unFriends(checkDie, page);

  console.log("Success !")
}

main();
