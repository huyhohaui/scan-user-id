const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

const {convertCookieFacebook} = require('./cookie');
access_token = 'EAAAAZAw4FxQIBACDMFlujEnwySrbc0sfIQrSzV8UifbjK6iBKu0KVi2PSy0Aafc4vp6zjsIZARxkjUZBKhQZBZAVuZCCgI3qWvwjveZCyoB36cyW352y73MEzEsojrQF5XMJDheyDZBL5IquRO5EMBllDEGqZBG43ZBx6wqZB6CiuKgWZANTN9KnyOiq3e22Q93oGswZD';
function setIdPost(idPost, accessTokenOfUser) {
  return "https://graph.facebook.com/v4.0/" + idPost + "/feed?limit(1)&&fields=likes.summary(total_count)&access_token=" + accessTokenOfUser;
};

async function getInfomationPost(page) {

  var contentPost = await getContentPost(page);
  var srcsImages;
  const indexImage = await page.$eval('div[class="_52d9"] div[class="_52da"] div[class="_52db"]', value =>parseInt(value.innerHTML));
  if (indexImage > 0) {
    srcsImages = await getImagesPost(page);
  }
  if (!indexImage){
    srcsImages = await getImagePost(page);
  }
  
  return {
    contentPost,
    srcsImages
  };
  

};

async function getContentPost(page) {
  const contentPost = await page.evaluate( async() => {
    const createTimePost = document.querySelector('div[class="permalinkPost"] span.timestampContent').innerText;
    const contentPost = Array.from(document.querySelectorAll('div[class="permalinkPost"] div.userContent>p')).map(item => item.innerText);
    const likePost = document.querySelector('div[class="permalinkPost"] form.commentable_item span._81hb').innerText;
    const commentPost = document.querySelector('div[class="permalinkPost"] form.commentable_item div._4vn1 a._3hg-._42ft').innerText;
    const sharePost = document.querySelector('div[class="permalinkPost"] form.commentable_item div._4vn1 a._3rwx._42ft').innerText;
    
    return {
      createTimePost,
      contentPost,
      likePost,
      commentPost,
      sharePost,
    }
  });
  return contentPost;
};

async function getImagesPost(page) {
  const indexImage = await page.$eval('div[class="_52d9"] div[class="_52da"] div[class="_52db"]', value =>parseInt(value.innerHTML)) + 3;
  var srcImgs = [];
  await page.click('div[class="permalinkPost"] div[class="uiScaledImageContainer"] img');
  await page.waitFor( 1000 );
  for(let i = 0; i < indexImage ; i++){
    await page.click('div[class="permalinkPost"] div[class="uiScaledImageContainer"] img');
    await page.waitFor( 500 );
    srcImg = await page.$eval('div[class="stage"] div[class="_2-sx"] img[class="spotlight"]', value => value.src);
    srcImgs = [...srcImgs, srcImg];
  };
  await page.waitFor( 500 );
  await page.keyboard.down('Escape');
  await page.keyboard.up('Escape');

  return srcImgs;
};

async function getImagePost(page) {
  return await page.$eval('div[class="permalinkPost" div[class="uiScaledImageContainer"] img', value => value.src);
};

async function clickCommentPost(page, countComment = 0){
  var seeMoreComment = async () => { await page.$$('div[class="permalinkPost"] div[data-testid="UFI2Comment/body"]').then(async data => {
    if( data.length == countComment ) {
      await seeMoreComment();
    }
    else {
      if(await page.$('div[class="permalinkPost"] a[class="_4sxc _42ft"]')) {
        countComment = data.length;
        await page.click('div[class="permalinkPost"] a[class="_4sxc _42ft"]');
        await seeMoreComment();
      }
  }
  })};
  if (await page.$('div[class="permalinkPost"] a[class="_4sxc _42ft"]')) {
    await seeMoreComment();
  }
};

async function getCommentPost(page, countComment = 100){
  //if author is page
  if(await page.$("div[class='permalinkPost']")!=null){
    // Click more comments and reply
    let moreComments=async()=>{
      try{
        if(await page.$("div[class='permalinkPost'] a[class='_4sxc _42ft']")!=null){
          await page.waitForSelector("div[class='permalinkPost'] a[class='_4sxc _42ft']");
          await page.click("div[class='permalinkPost'] a[class='_4sxc _42ft']");
          await moreComments();
        }
      }
      //if err run again
      catch(err){
        if(await page.$("div[class='permalinkPost'] a[class='_4sxc _42ft']")!=null){
          await page.waitForSelector("div[class='permalinkPost'] a[class='_4sxc _42ft']");
          await page.click("div[class='permalinkPost'] a[class='_4sxc _42ft']");
          await moreComments();
        }
      }
      //if more cmt or reply is still exist
      if(await page.$("div[class='permalinkPost'] a[class='_4sxc _42ft']")!=null){
        await moreComments()
      }
    }
    await moreComments();
    await page.waitFor(1000);
    //Get comments and reply
    let data=await page.evaluate(()=>{
      let comment=[];
      let i=1;
      while(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")")!=null){
        let cmtText;
        let cmtVideo;
        let cmtImage;
        let cmtSticker;
        let reply=[];
        let cmtUser=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+") div[class='_72vr']>a").innerText;
        if(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+") video[class='_ox1']")!=null){
          cmtVideo=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+") video[class='_ox1']").attributes["src"].value;
        }
        if(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+") span[class='_3l3x']")!=null){
          cmtText=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+") span[class='_3l3x']").innerText;
        }
        if(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+") div[class='_6cuy']>div>div").attributes["style"]!=null){
          cmtStickerString=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+") div[class='_6cuy']>div>div").attributes["style"].value.split('"');
          cmtSticker=cmtStickerString[1];
        }
        if(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+") img[class='img']")!=null){
          cmtImage=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+") img[class='img']").attributes["src"].value;
        }
        //get reply
        if(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul")!=null){
          let j=1;
          while(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+")")!=null){
            let replyText;
            let replyVideo;
            let replyImage
            let replySticker;
            let replyUser=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") div[class='_72vr']>a").innerText;
            if(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") video[class='_ox1']")!=null){
              replyVideo=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") video[class='_ox1']").attributes["src"].value;
            }
            if(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") span[class='_3l3x']")!=null){
              replyText=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") span[class='_3l3x']").innerText;
            }
            if(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") div[class='_6cuy']>div>div").attributes["style"]!=null){
              replyStickerString=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") div[class='_6cuy']>div>div").attributes["style"].value.split('"');
              replySticker=replyStickerString[1];
            }
            if(document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") img[class='img']")!=null){
              cmtImage=document.querySelector("div[class='permalinkPost'] ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") img[class='img']").attributes["src"].value;
            }
            j++;
            reply.push({
              replyUser,
              replyText,
              replyVideo,
              replyImage,
              replySticker
            })
          }
        }

        i++;
        comment.push({
          cmtUser,
          cmtText,
          cmtVideo,
          cmtImage,
          cmtSticker,
          reply
        })
      }
      return comment;
    })
    return data;
  }
  //if author is user
  else{
    let moreComments=async()=>{
      try{
        if(await page.$("a[class='_4sxc _42ft']")!=null){
          await page.waitForSelector("a[class='_4sxc _42ft']");
          await page.click("a[class='_4sxc _42ft']");
          await moreComments();
        }
      }catch(err){
        if(await page.$("a[class='_4sxc _42ft']")!=null){
          await page.waitForSelector("a[class='_4sxc _42ft']");
          await page.click("a[class='_4sxc _42ft']");
          await moreComments();
        }
      }
      if(await page.$("a[class='_4sxc _42ft']")!=null){
        await moreComments()
      }
    }
    await moreComments();
    await page.waitFor(1000);
    //Get comments and reply
    let data=await page.evaluate(()=>{
      let comment=[];
      let i=1;
      
        while(document.querySelector("ul[class='_7791']>li:nth-child("+i+")")!=null){
          let cmtText;
          let cmtVideo;
          let cmtImage;
          let cmtSticker;
          let reply=[];
          let cmtUser=document.querySelector("ul[class='_7791']>li:nth-child("+i+") div[class='_72vr']>a").innerText;
          if(document.querySelector("ul[class='_7791']>li:nth-child("+i+") video[class='_ox1']")!=null){
            cmtVideo=document.querySelector("ul[class='_7791']>li:nth-child("+i+") video[class='_ox1']").attributes["src"].value;
          }
          if(document.querySelector("ul[class='_7791']>li:nth-child("+i+") span[class='_3l3x']")!=null){
            cmtText=document.querySelector("ul[class='_7791']>li:nth-child("+i+") span[class='_3l3x']").innerText;
          }
          if(document.querySelector("ul[class='_7791']>li:nth-child("+i+") div[class='_6cuy']>div>div").attributes["style"]!=null){
            cmtStickerString=document.querySelector("ul[class='_7791']>li:nth-child("+i+") div[class='_6cuy']>div>div").attributes["style"].value.split('"');
            cmtSticker=cmtStickerString[1];
          }
          if(document.querySelector("ul[class='_7791']>li:nth-child("+i+") img[class='img']")!=null){
            cmtImage=document.querySelector("ul[class='_7791']>li:nth-child("+i+") img[class='img']").attributes["src"].value;
          }
    
          //get reply
          if(document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul")!=null){
            let j=1;
            while(document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+")")!=null){
              let replyText;
              let replyVideo;
              let replyImage
              let replySticker;
              let replyUser=document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") div[class='_72vr']>a").innerText;
              if(document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") video[class='_ox1']")!=null){
                replyVideo=document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") video[class='_ox1']").attributes["src"].value;
              }
              if(document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") span[class='_3l3x']")!=null){
                replyText=document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") span[class='_3l3x']").innerText;
              }
              if(document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") div[class='_6cuy']>div>div").attributes["style"]!=null){
                replyStickerString=document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") div[class='_6cuy']>div>div").attributes["style"].value.split('"');
                replySticker=replyStickerString[1];
              }
              if(document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") img[class='img']")!=null){
                replyImage=document.querySelector("ul[class='_7791']>li:nth-child("+i+")>div:nth-child(2)>ul>li:nth-child("+j+") img[class='img']").attributes["src"].value;
              }
              j++;
              reply.push({
                replyUser,
                replyText,
                replyVideo,
                replyImage,
                replySticker
              })
            }
          }
    
          i++;
          comment.push({
            cmtUser,
            cmtText,
            cmtVideo,
            cmtImage,
            cmtSticker,
            reply
          })
        }
        return comment
    })
    return data;
  }
}


async function main() {
  const url = 'https://facebook.com/695427830965848';
  const cookie = 'sb=0wgsXfkaEA0i3FoP-cg2hXbk; datr=0wgsXTcwojtEAmRmSDOZCQHY; locale=vi_VN; c_user=100006889479532; xs=27%3AIyjRtMMbjZa0aA%3A2%3A1567870759%3A19246%3A6315; spin=r.1001148861_b.trunk_t.1567870760_s.1_v.2_; fr=0wgfiGjUbt8gWeusU.AWUBmPDHZVZ6VtQNb6i0Yz-0TRY.BdLAHq.BH.AAA.0.0.BddF_G.AWWl19Je; act=1567908567675%2F6; wd=1749x491; presence=EDvF3EtimeF1567908716EuserFA21B06889479532A2EstateFDt3F_5b_5dEutc3F1567873281567G567908716396CEchFDp_5f1B06889479532F1CC';
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const cookieConverted = await convertCookieFacebook( cookie );
  await page.setCookie( ...cookieConverted );
  await page.setViewport( { "width": 1250, "height": 850 } );
  await page.waitFor( 1000 );
  try {
    await page.goto(url, {waitUntil: 'load', timeout: 0});
  } catch(error) {
    throw new Error(error);
  }
  
  await getInfomationPost(page)
  .then(
    data => {
      console.log(data);
    }
  ).catch(err => {
    console.log(err);
  });

  // await clickCommentPost(page);
  await page.waitFor( 500 );
  await getCommentPost(page).then(
    data => {
      console.log(data);
    }
  ).catch(
    err => {
      console.log(err);
    }
  );
};
main();
