
const fetch = require("node-fetch");

module.exports.setURL = (idPage, accessToken) => {
  return "https://graph.facebook.com/v4.0/" + idPage + "/feed?limit(1)&&fields=likes.summary(total_count)&access_token=" + access_token;
}
module.exports.getabc =  async (url, limit, like) => {
  return await getListIdPosts(url, limit, like);
};
var getListIdPosts = async (url, limit, like, currentResult = 0, result = []) => {
    
  const feed_ = await fetch(url);
  const getFeed = await feed_.json();
  var count = currentResult;
  var data_ = result;
  
  if (getFeed.data) {
    getFeed.data.map(data => {
      if (limit <= count) {
        return;
      }
      if (data.likes) {
        if (data.likes.summary) {
          if (data.likes.summary.total_count >= like) {
            data_ = [...data_,data.id.split('_')[1]];
            count++;
            
          }
        }
      }
    })
  }
  
  if (count < limit) {
    if (getFeed.data) {
      if (!getFeed.paging) {
        return data_;
      }
    } else {
      if (!getFeed.feed) {
        return data_;
      }
    }
    if (getFeed.paging) {
      if (!getFeed.paging.next) {
        return 'Khong du bai';
      } else {
        const url = await getFeed.paging.next;
        return await getListIdPosts(url, limit, like, count, data_);
      }
    } else {
      if (!getFeed.feed.paging.next) {
        return 'Khong du bai';
      } else {
        const url = await getFeed.feed.paging.next;
        return await getListIdPosts(url, limit, like, count, data_);
      }
    }
  }
  if (count >= limit) {
    return data_;
  }

  if (getFeed.paging) {
    return data_;
  }
}
