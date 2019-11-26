const puppeteer = require("puppeteer");
const { convertCookieFacebook } = require("./cookie");
access_token =
  "EAAAAZAw4FxQIBACDMFlujEnwySrbc0sfIQrSzV8UifbjK6iBKu0KVi2PSy0Aafc4vp6zjsIZARxkjUZBKhQZBZAVuZCCgI3qWvwjveZCyoB36cyW352y73MEzEsojrQF5XMJDheyDZBL5IquRO5EMBllDEGqZBG43ZBx6wqZB6CiuKgWZANTN9KnyOiq3e22Q93oGswZD";

async function getInfomationPost(page) {
  var contentPost = await getContentPost(page);
  var srcsImages = await getImagesPost(page);

  return {
    contentPost,
    srcsImages
  };
}

async function getContentPost(page) {
  const contentPost = await page.evaluate(async () => {
    const createTimePost = document.querySelector(
      'div[class="permalinkPost"] span.timestampContent'
    ).innerText;
    const contentPost = Array.from(
      document.querySelectorAll('div[class="permalinkPost"] div.userContent>p')
    ).map(item => item.innerText);
    const likePost = document.querySelector(
      'div[class="permalinkPost"] form.commentable_item span._81hb'
    ).innerText;
    const commentPost = document.querySelector(
      'div[class="permalinkPost"] form.commentable_item div._4vn1 a._3hg-._42ft'
    ).innerText;
    const sharePost = document.querySelector(
      'div[class="permalinkPost"] form.commentable_item div._4vn1 a._3rwx._42ft'
    ).innerText;

    return {
      createTimePost,
      contentPost,
      likePost,
      commentPost,
      sharePost
    };
  });
  return contentPost;
}

async function getImagesPost(page) {
  let images = [];
  //Images count
  let imagesCount = await page.evaluate(() => {
    let imgCount;
    //count image if author is page
    if (document.querySelector("div[class='permalinkPost']") != null) {
      if (
        document.querySelector(
          "div[class='permalinkPost'] div[class='_52db']"
        ) != null
      ) {
        imgCount =
          3 +
          parseInt(
            document.querySelector(
              "div[class='permalinkPost'] div[class='_52db']"
            ).innerText
          );
      } else if (
        document.querySelector(
          "div[class='permalinkPost'] div[class='_2a2q _65sr']"
        ) == null
      ) {
        imgCount = 1;
      } else {
        imgCount = document.querySelector(
          "div[class='permalinkPost'] div[class='_2a2q _65sr']"
        ).childElementCount;
      }
    }
    //count image if author is user
    else {
      if (document.querySelector("div[class='_52db']") != null) {
        imgCount =
          3 + parseInt(document.querySelector("div[class='_52db']").innerText);
      } else if (document.querySelector("div[class='_2a2q _65sr']") == null) {
        imgCount = 1;
      } else {
        imgCount = document.querySelector("div[class='_2a2q _65sr']")
          .childElementCount;
      }
    }
    return imgCount;
  });
  //Click image
  if ((await page.$("div[class='mtm'] a")) != null) {
    await page.click("div[class='mtm'] a");
  }
  await page.waitFor(3000);
  //Get image src
  for (i = 1; i <= imagesCount; i++) {
    await page.waitFor(200);
    let image = await page.evaluate(async () => {
      let img = await document.querySelector("img[class='spotlight']")
        .attributes["src"].value;
      return img;
    });
    images.push(image);
    if (imagesCount != 1) {
      await page.keyboard.press("ArrowRight");
      if ((await page.$("snowliftPager next hilightPager")) != null) {
        await page.click("snowliftPager next hilightPager']");
      }
    }
  }
  await page.waitFor(500);
  await page.keyboard.down("Escape");
  await page.keyboard.up("Escape");
  return images;
}

async function getCommentPost(page, countComment) {
  await clickAllCommentOfPage(page);
  await page.waitFor(2000);
  //if post have amount comment end post

  if (await page.$('div[class="permalinkPost"] span[class="_3bu3 _293g"]')) {
    let totalComments = await page.$eval(
      'div[class="permalinkPost"] span[class="_3bu3 _293g"]',
      value => value.innerHTML.split("/")[1]
    );
    if (totalComments.length > 3) {
      let convertAroundOneThousandComment = totalComments.split(/\./g);
      let amountCommentConvert = parseInt(
        convertAroundOneThousandComment[0].concat(
          convertAroundOneThousandComment[1]
        )
      );
      if (countComment > amountCommentConvert) {
        return "Khong du comment";
      } else {
        // if page post
        if ((await page.$("div[class='permalinkPost']")) != null) {
          // Click more comments and reply
          let moreComments = async () => {
            let amountComment = await page.$eval(
              'div[class="permalinkPost"] span[class="_3bu3 _293g"]',
              value => value.innerHTML.split("/")[0]
            );
            // click more comment
            if (countComment > amountComment) {
              try {
                if (
                  (await page.$(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  )) != null
                ) {
                  await page.waitForSelector(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await page.click(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await moreComments();
                }
              } catch (err) {
                //if err run again
                if (
                  (await page.$(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  )) != null
                ) {
                  await page.waitForSelector(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await page.click(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await moreComments();
                }
              }
              //if more cmt or reply is still exist
              if (
                (await page.$(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                )) != null
              ) {
                await moreComments();
              }
            }

            if (countComment == amountComment) {
              if (
                (await page.$(
                  'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                )) != null
              ) {
                try {
                  if (
                    (await page.$(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    )) != null
                  ) {
                    await page.waitForSelector(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await page.click(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await moreComments();
                  }
                } catch (err) {
                  //if err run again
                  if (
                    (await page.$(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    )) != null
                  ) {
                    await page.waitForSelector(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await page.click(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await moreComments();
                  }
                }
              }
              if (
                (await page.$(
                  'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                )) != null
              ) {
                await moreComments();
              }
            }
          };

          await moreComments();
          await page.waitFor(1000);
          //Get comments and reply
          let data = await getCommentOfPostPage(page);
          return data;
        }
        //if author is user
        else {
          let moreComments = async () => {
            let amountComment = await page.$eval(
              'div[class="permalinkPost"] span[class="_3bu3 _293g"]',
              value => value.innerHTML.split("/")[0]
            );
            // click more comment
            if (countComment > amountComment) {
              try {
                if (
                  (await page.$(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  )) != null
                ) {
                  await page.waitForSelector(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await page.click(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await moreComments();
                }
              } catch (err) {
                //if err run again
                if (
                  (await page.$(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  )) != null
                ) {
                  await page.waitForSelector(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await page.click(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await moreComments();
                }
              }
              //if more cmt or reply is still exist
              if (
                (await page.$(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                )) != null
              ) {
                await moreComments();
              }
            }

            if (countComment == amountComment) {
              if (
                (await page.$(
                  'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                )) != null
              ) {
                try {
                  if (
                    (await page.$(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    )) != null
                  ) {
                    await page.waitForSelector(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await page.click(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await moreComments();
                  }
                } catch (err) {
                  //if err run again
                  if (
                    (await page.$(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    )) != null
                  ) {
                    await page.waitForSelector(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await page.click(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await moreComments();
                  }
                }
              }
              if (
                (await page.$(
                  'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                )) != null
              ) {
                await moreComments();
              }
            }
          };

          await moreComments();
          await page.waitFor(1000);
          //Get comments and reply
          let data = await getCommentOfPostUser(page);
          return data;
        }
      }
    } else {
      if (countComment > totalComments) {
        return "Khong du comment";
      } else {
        if ((await page.$("div[class='permalinkPost']")) != null) {
          // Click more comments and reply
          let moreComments = async () => {
            let amountComment = await page.$eval(
              'div[class="permalinkPost"] span[class="_3bu3 _293g"]',
              value => value.innerHTML.split("/")[0]
            );
            // click more comment
            if (countComment > amountComment) {
              try {
                if (
                  (await page.$(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  )) != null
                ) {
                  await page.waitForSelector(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await page.click(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await moreComments();
                }
              } catch (err) {
                //if err run again
                if (
                  (await page.$(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  )) != null
                ) {
                  await page.waitForSelector(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await page.click(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await moreComments();
                }
              }
              //if more cmt or reply is still exist
              if (
                (await page.$(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                )) != null
              ) {
                await moreComments();
              }
            }

            if (countComment == amountComment) {
              if (
                (await page.$(
                  'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                )) != null
              ) {
                try {
                  if (
                    (await page.$(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    )) != null
                  ) {
                    await page.waitForSelector(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await page.click(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await moreComments();
                  }
                } catch (err) {
                  //if err run again
                  if (
                    (await page.$(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    )) != null
                  ) {
                    await page.waitForSelector(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await page.click(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await moreComments();
                  }
                }
              }
              if (
                (await page.$(
                  'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                )) != null
              ) {
                await moreComments();
              }
            }
          };

          await moreComments();
          await page.waitFor(1000);
          //Get comments and reply
          let data = await getCommentOfPostPage(page);
          return data;
        }
        //if author is user
        else {
          let moreComments = async () => {
            let amountComment = await page.$eval(
              'div[class="permalinkPost"] span[class="_3bu3 _293g"]',
              value => value.innerHTML.split("/")[0]
            );
            // click more comment
            if (countComment > amountComment) {
              try {
                if (
                  (await page.$(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  )) != null
                ) {
                  await page.waitForSelector(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await page.click(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await moreComments();
                }
              } catch (err) {
                //if err run again
                if (
                  (await page.$(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  )) != null
                ) {
                  await page.waitForSelector(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await page.click(
                    "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                  );
                  await moreComments();
                }
              }
              //if more cmt or reply is still exist
              if (
                (await page.$(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                )) != null
              ) {
                await moreComments();
              }
            }

            if (countComment == amountComment) {
              if (
                (await page.$(
                  'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                )) != null
              ) {
                try {
                  if (
                    (await page.$(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    )) != null
                  ) {
                    await page.waitForSelector(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await page.click(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await moreComments();
                  }
                } catch (err) {
                  //if err run again
                  if (
                    (await page.$(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    )) != null
                  ) {
                    await page.waitForSelector(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await page.click(
                      'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                    );
                    await moreComments();
                  }
                }
              }
              if (
                (await page.$(
                  'div[class="permalinkPost"] a[data-testid="UFI2CommentsPagerRenderer/pager_depth_1"]'
                )) != null
              ) {
                await moreComments();
              }
            }
          };

          await moreComments();
          await page.waitFor(1000);
          //Get comments and reply
          let data = await getCommentOfPostUser(page);
          return data;
        }
      }
    }
  }
  // if post haven't amount comment and post
  if (
    (await page.$('div[class="permalinkPost"] span[class="_3bu3 _293g"]')) ==
    null
  ) {
    let totalComments = await page.$eval(
      'div[class="permalinkPost"] span[class="_3bu3 _293g"]',
      value => value.innerHTML.split("/")[1]
    );

    if (countComment > totalComments) {
      return "Khong du comment";
    } else {
      if ((await page.$("div[class='permalinkPost']")) != null) {
        // Click more comments and reply
        let moreComments = async () => {
          let amountComment = await page.$eval(
            'div[class="permalinkPost"] span[class="_3bu3 _293g"]',
            value => value.innerHTML.split("/")[0]
          );
          if (countComment > amountComment) {
            //click more comment
            try {
              if (
                (await page.$(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                )) != null
              ) {
                await page.waitForSelector(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                );
                await page.click(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                );
                await moreComments();
              }
            } catch (err) {
              //if err run again
              if (
                (await page.$(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                )) != null
              ) {
                await page.waitForSelector(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                );
                await page.click(
                  "div[class='permalinkPost'] a[class='_4sxc _42ft']"
                );
                await moreComments();
              }
            }
            //if more cmt or reply is still exist
            if (
              (await page.$(
                "div[class='permalinkPost'] a[class='_4sxc _42ft']"
              )) != null
            ) {
              await moreComments();
            }
          }
        };
        await moreComments();
        await page.waitFor(1000);
        // get data comment
        let data = await getCommentOfPostPage(page);
        return data;
      }
      //if author is user
      else {
        let moreComments = async () => {
          //click more comment
          try {
            if ((await page.$("a[class='_4sxc _42ft']")) != null) {
              await page.waitForSelector("a[class='_4sxc _42ft']");
              await page.click("a[class='_4sxc _42ft']");
              await moreComments();
            }
          } catch (err) {
            if ((await page.$("a[class='_4sxc _42ft']")) != null) {
              await page.waitForSelector("a[class='_4sxc _42ft']");
              await page.click("a[class='_4sxc _42ft']");
              await moreComments();
            }
          }
          if ((await page.$("a[class='_4sxc _42ft']")) != null) {
            await moreComments();
          }
        };
        await moreComments();
        await page.waitFor(1000);
        // get data comment
        let data = await getCommentOfPostUser(page);
        return data;
      }
    }
  }
}
async function getCommentOfPostPage(page) {
  let data = await page.evaluate(() => {
    let comment = [];
    let i = 1;
    while (
      document.querySelector(
        "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" + i + ")"
      ) != null
    ) {
      let cmtIdUser;
      let cmtText;
      let cmtVideo;
      let cmtImage;
      let cmtSticker;
      let reply = [];
      let cmtStartString;
      let cmtEndString;
      let cmtStringId;
      let cmtUser = document.querySelector(
        "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
          i +
          ") div[class='_72vr']>a"
      ).innerText;

      cmtStringId = document.querySelector(
        "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
          i +
          ") div[class='_72vr']>a"
      ).attributes["data-hovercard"].value;
      cmtStartString = cmtStringId.search(/\d/);
      cmtEndString = cmtStringId.search(/&/);
      if (cmtStartString != null) {
        if (cmtEndString != null) {
          cmtIdUser = cmtStringId.substring(cmtStartString, cmtEndString);
        }
      }

      if (
        document.querySelector(
          "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
            i +
            ") video[class='_ox1']"
        ) != null
      ) {
        cmtVideo = document.querySelector(
          "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
            i +
            ") video[class='_ox1']"
        ).attributes["src"].value;
      }
      if (
        document.querySelector(
          "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
            i +
            ") span[class='_3l3x']"
        ) != null
      ) {
        cmtText = document.querySelector(
          "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
            i +
            ") span[class='_3l3x']"
        ).innerText;
      }
      if (
        document.querySelector(
          "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
            i +
            ") div[class='_6cuy']>div>div"
        ).attributes["style"] != null
      ) {
        cmtStickerString = document
          .querySelector(
            "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
              i +
              ") div[class='_6cuy']>div>div"
          )
          .attributes["style"].value.split('"');
        cmtSticker = cmtStickerString[1];
      }
      if (
        document.querySelector(
          "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
            i +
            ") img[class='img']"
        ) != null
      ) {
        cmtImage = document.querySelector(
          "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
            i +
            ") img[class='img']"
        ).attributes["src"].value;
      }
      //get reply
      if (
        document.querySelector(
          "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
            i +
            ")>div:nth-child(2)>ul"
        ) != null
      ) {
        let j = 1;
        while (
          document.querySelector(
            "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
              i +
              ")>div:nth-child(2)>ul>li:nth-child(" +
              j +
              ")"
          ) != null
        ) {
          let replyStringIdUser;
          let replyIdUser;
          let replyText;
          let replyVideo;
          let replyImage;
          let replySticker;
          let replyStartString;
          let replyEndString;
          let replyUser = document.querySelector(
            "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
              i +
              ")>div:nth-child(2)>ul>li:nth-child(" +
              j +
              ") div[class='_72vr']>a"
          ).innerText;

          replyStringIdUser = document.querySelector(
            "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
              i +
              ")>div:nth-child(2)>ul>li:nth-child(" +
              j +
              ") div[class='_72vr']>a"
          ).attributes["data-hovercard"].value;

          replyStartString = replyStringIdUser.search(/\d/);
          replyEndString = replyStringIdUser.search(/&/);
          if (replyStartString != null) {
            if (replyEndString != null) {
              replyIdUser = cmtStringId.substring(
                replyStartString,
                replyEndString
              );
            }
          }

          if (
            document.querySelector(
              "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") video[class='_ox1']"
            ) != null
          ) {
            replyVideo = document.querySelector(
              "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") video[class='_ox1']"
            ).attributes["src"].value;
          }
          if (
            document.querySelector(
              "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") span[class='_3l3x']"
            ) != null
          ) {
            replyText = document.querySelector(
              "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") span[class='_3l3x']"
            ).innerText;
          }
          if (
            document.querySelector(
              "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") div[class='_6cuy']>div>div"
            ).attributes["style"] != null
          ) {
            replyStickerString = document
              .querySelector(
                "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
                  i +
                  ")>div:nth-child(2)>ul>li:nth-child(" +
                  j +
                  ") div[class='_6cuy']>div>div"
              )
              .attributes["style"].value.split('"');
            replySticker = replyStickerString[1];
          }
          if (
            document.querySelector(
              "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") img[class='img']"
            ) != null
          ) {
            cmtImage = document.querySelector(
              "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") img[class='img']"
            ).attributes["src"].value;
          }
          j++;
          reply.push({
            replyUser,
            replyIdUser,
            replyText,
            replyVideo,
            replyImage,
            replySticker
          });
        }
      }

      i++;
      comment.push({
        cmtUser,
        cmtIdUser,
        cmtText,
        cmtVideo,
        cmtImage,
        cmtSticker,
        reply
      });
    }

    return comment;
  });
  return data;
}

async function getCommentOfPostUser(page) {
  let data = await page.evaluate(() => {
    let comment = [];
    let i = 1;

    while (
      document.querySelector("ul[class='_7791']>li:nth-child(" + i + ")") !=
      null
    ) {
      let cmtText;
      let cmtVideo;
      let cmtImage;
      let cmtSticker;
      let cmtStringId;
      let cmtStartString;
      let cmtEndString;
      let cmtIdUser;
      let reply = [];
      let cmtUser = document.querySelector(
        "ul[class='_7791']>li:nth-child(" + i + ") div[class='_72vr']>a"
      ).innerText;

      cmtStringId = document.querySelector(
        "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
          i +
          ") div[class='_72vr']>a"
      ).attributes["data-hovercard"].value;
      cmtStartString = cmtStringId.search(/\d/);
      cmtEndString = cmtStringId.search(/&/);
      if (cmtStartString != null) {
        if (cmtEndString != null) {
          cmtIdUser = cmtStringId.substring(cmtStartString, cmtEndString);
        }
      }

      if (
        document.querySelector(
          "ul[class='_7791']>li:nth-child(" + i + ") video[class='_ox1']"
        ) != null
      ) {
        cmtVideo = document.querySelector(
          "ul[class='_7791']>li:nth-child(" + i + ") video[class='_ox1']"
        ).attributes["src"].value;
      }
      if (
        document.querySelector(
          "ul[class='_7791']>li:nth-child(" + i + ") span[class='_3l3x']"
        ) != null
      ) {
        cmtText = document.querySelector(
          "ul[class='_7791']>li:nth-child(" + i + ") span[class='_3l3x']"
        ).innerText;
      }
      if (
        document.querySelector(
          "ul[class='_7791']>li:nth-child(" + i + ") div[class='_6cuy']>div>div"
        ).attributes["style"] != null
      ) {
        cmtStickerString = document
          .querySelector(
            "ul[class='_7791']>li:nth-child(" +
              i +
              ") div[class='_6cuy']>div>div"
          )
          .attributes["style"].value.split('"');
        cmtSticker = cmtStickerString[1];
      }
      if (
        document.querySelector(
          "ul[class='_7791']>li:nth-child(" + i + ") img[class='img']"
        ) != null
      ) {
        cmtImage = document.querySelector(
          "ul[class='_7791']>li:nth-child(" + i + ") img[class='img']"
        ).attributes["src"].value;
      }

      //get reply
      if (
        document.querySelector(
          "ul[class='_7791']>li:nth-child(" + i + ")>div:nth-child(2)>ul"
        ) != null
      ) {
        let j = 1;
        while (
          document.querySelector(
            "ul[class='_7791']>li:nth-child(" +
              i +
              ")>div:nth-child(2)>ul>li:nth-child(" +
              j +
              ")"
          ) != null
        ) {
          let replyText;
          let replyVideo;
          let replyImage;
          let replySticker;
          let replyStringIdUser;
          let replyStartString;
          let replyEndString;
          let replyIdUser;
          let replyUser = document.querySelector(
            "ul[class='_7791']>li:nth-child(" +
              i +
              ")>div:nth-child(2)>ul>li:nth-child(" +
              j +
              ") div[class='_72vr']>a"
          ).innerText;

          replyStringIdUser = document.querySelector(
            "div[class='permalinkPost'] ul[class='_7791']>li:nth-child(" +
              i +
              ")>div:nth-child(2)>ul>li:nth-child(" +
              j +
              ") div[class='_72vr']>a"
          ).attributes["data-hovercard"].value;

          replyStartString = replyStringIdUser.search(/\d/);
          replyEndString = replyStringIdUser.search(/&/);
          if (replyStartString != null) {
            if (replyEndString != null) {
              replyIdUser = cmtStringId.substring(
                replyStartString,
                replyEndString
              );
            }
          }

          if (
            document.querySelector(
              "ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") video[class='_ox1']"
            ) != null
          ) {
            replyVideo = document.querySelector(
              "ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") video[class='_ox1']"
            ).attributes["src"].value;
          }
          if (
            document.querySelector(
              "ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") span[class='_3l3x']"
            ) != null
          ) {
            replyText = document.querySelector(
              "ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") span[class='_3l3x']"
            ).innerText;
          }
          if (
            document.querySelector(
              "ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") div[class='_6cuy']>div>div"
            ).attributes["style"] != null
          ) {
            replyStickerString = document
              .querySelector(
                "ul[class='_7791']>li:nth-child(" +
                  i +
                  ")>div:nth-child(2)>ul>li:nth-child(" +
                  j +
                  ") div[class='_6cuy']>div>div"
              )
              .attributes["style"].value.split('"');
            replySticker = replyStickerString[1];
          }
          if (
            document.querySelector(
              "ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") img[class='img']"
            ) != null
          ) {
            replyImage = document.querySelector(
              "ul[class='_7791']>li:nth-child(" +
                i +
                ")>div:nth-child(2)>ul>li:nth-child(" +
                j +
                ") img[class='img']"
            ).attributes["src"].value;
          }
          j++;
          reply.push({
            replyUser,
            replyIdUser,
            replyText,
            replyVideo,
            replyImage,
            replySticker
          });
        }
      }

      i++;
      comment.push({
        cmtUser,
        cmtIdUser,
        cmtText,
        cmtVideo,
        cmtImage,
        cmtSticker,
        reply
      });
    }

    return comment;
  });
  return data;
}
async function clickAllCommentOfPage(page) {
  await page.$('div[data-testid="UFI2ViewOptionsSelector/root"] a');
  await page.click('div[data-testid="UFI2ViewOptionsSelector/root"] a');
  let clickAllCommnetOfPage = await page.$$('div[class="_54ng"] ul li');
  clickAllCommnetOfPage[2].click();
}

async function main() {
  const url = "https://facebook.com/3097104883638786";
  const cookie =
    "sb=0wgsXfkaEA0i3FoP-cg2hXbk; datr=0wgsXTcwojtEAmRmSDOZCQHY; locale=vi_VN; c_user=100006889479532; xs=27%3AIyjRtMMbjZa0aA%3A2%3A1567870759%3A19246%3A6315; spin=r.1001148861_b.trunk_t.1567870760_s.1_v.2_; fr=0wgfiGjUbt8gWeusU.AWUBmPDHZVZ6VtQNb6i0Yz-0TRY.BdLAHq.BH.AAA.0.0.BddF_G.AWWl19Je; act=1567908567675%2F6; wd=1749x491; presence=EDvF3EtimeF1567908716EuserFA21B06889479532A2EstateFDt3F_5b_5dEutc3F1567873281567G567908716396CEchFDp_5f1B06889479532F1CC";
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const cookieConverted = await convertCookieFacebook(cookie);
  await page.setCookie(...cookieConverted);
  await page.setViewport({ width: 1250, height: 850 });
  await page.waitFor(1000);
  try {
    await page.goto(url, { waitUntil: "load", timeout: 0 });
  } catch (error) {
    throw new Error(error);
  }

  await getInfomationPost(page)
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });

  // await clickCommentPost(page);
  await page.waitFor(500);
  await getCommentPost(page, 50)
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
}
main();
