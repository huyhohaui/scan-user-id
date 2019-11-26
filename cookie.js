module.exports = {
  "converSourceUnix": ( url ) => {
    return url.replace( /\\\//gi, "/" );
  },
  "convertCookieFacebook": async ( cookies ) => {
    let cookie = cookies;

    if ( cookies.charAt( cookies.length - 1 ) !== ";" ) {
      cookie = cookie + ";";
    }
    const sb = module.exports.findSubString( cookie, "sb=", ";" ),
      datr = module.exports.findSubString( cookie, "datr=", ";" ),
      fbp = module.exports.findSubString( cookie, "_fbp=", ";" ),
      locale = module.exports.findSubString( cookie, "locale=", ";" ),
      cuser = module.exports.findSubString( cookie, "c_user=", ";" ),
      xs = module.exports.findSubString( cookie, "xs=", ";" ),
      mPixelRatio = module.exports.findSubString( cookie, "m_pixel_ratio=", ";" ),
      xReferer = module.exports.findSubString( cookie, "x-referer=", ";" ),
      dpr = module.exports.findSubString( cookie, "dpr=", ";" ),
      spin = module.exports.findSubString( cookie, "spin=", ";" ),
      wd = module.exports.findSubString( cookie, "wd=", ";" ),
      act = module.exports.findSubString( cookie, "act=", ";" ),
      fr = module.exports.findSubString( cookie, "fr=", ";" ),
      presence = module.exports.findSubString( cookie, "presence=", ";" );

    return [
      {
        "domain": ".facebook.com",
        "expirationDate": 1569392721,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_fbp",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": fbp,
        "id": 1
      },
      {
        "domain": ".facebook.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "act",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": true,
        "storeId": "0",
        "value": act,
        "id": 2
      },
      {
        "domain": ".facebook.com",
        "expirationDate": 1580816732.731927,
        "hostOnly": false,
        "httpOnly": false,
        "name": "c_user",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": cuser,
        "id": 3
      },
      {
        "domain": ".facebook.com",
        "expirationDate": 1580709288.093909,
        "hostOnly": false,
        "httpOnly": true,
        "name": "datr",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": datr,
        "id": 4
      },
      {
        "domain": ".facebook.com",
        "expirationDate": 1565860071,
        "hostOnly": false,
        "httpOnly": false,
        "name": "dpr",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": dpr,
        "id": 5
      },
      {
        "domain": ".facebook.com",
        "expirationDate": 1580816732.732301,
        "hostOnly": false,
        "httpOnly": true,
        "name": "fr",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": fr,
        "id": 6
      },
      {
        "domain": ".facebook.com",
        "expirationDate": 1565762123.634491,
        "hostOnly": false,
        "httpOnly": false,
        "name": "locale",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": locale,
        "id": 7
      },
      {
        "domain": ".facebook.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "m_pixel_ratio",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": true,
        "storeId": "0",
        "value": mPixelRatio,
        "id": 8
      },
      {
        "domain": ".facebook.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "presence",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": true,
        "storeId": "0",
        "value": presence,
        "id": 9
      },
      {
        "domain": ".facebook.com",
        "expirationDate": 1580709518.885992,
        "hostOnly": false,
        "httpOnly": true,
        "name": "sb",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": sb,
        "id": 10
      },
      {
        "domain": ".facebook.com",
        "expirationDate": 1565332897.754356,
        "hostOnly": false,
        "httpOnly": true,
        "name": "spin",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": spin,
        "id": 11
      },
      {
        "domain": ".facebook.com",
        "expirationDate": 1565869816,
        "hostOnly": false,
        "httpOnly": false,
        "name": "wd",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": wd,
        "id": 12
      },
      {
        "domain": ".facebook.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "x-referer",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": true,
        "storeId": "0",
        "value": xReferer,
        "id": 13
      },
      {
        "domain": ".facebook.com",
        "expirationDate": 1580816732.732092,
        "hostOnly": false,
        "httpOnly": true,
        "name": "xs",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": xs,
        "id": 14
      }
    ];
  },
  "convertUnicodeToCharacter": ( str ) => {
    return str.replace( /\\u[\dA-F]{4}/gi, ( match ) => {
      return String.fromCharCode( parseInt( match.replace( /\\u/g, "" ), 16 ) );
    } );
  },
  "findSubString": ( str, start, end ) => {
    if ( !end ) {
      return str.substring( str.indexOf( start ) + start.length );
    }
    return str.substring(
      str.indexOf( start ) + start.length,
      str.indexOf( end, str.indexOf( start ) + start.length )
    );
  },
  "getObjectDate": ( str ) => {
    const date = new Date( str );

    return {
      "second": date.getSeconds(),
      "minute": date.getMinutes(),
      "hour": date.getHours(),
      "date": date.getDate(),
      "month": date.getMonth(),
      "day": date.getDay(),
      "year": date.getFullYear()
    };
  }
};
