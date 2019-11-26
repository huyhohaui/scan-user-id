const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.listen(8888);

var cookie = 'datr=gipZXUFvReicMLVJUFDaqr6m; sb=zCpZXQ_Tdn_PEuK0JOLa1A9U; c_user=100005594357809; xs=3%3AMVvqPSC-3ERsiw%3A2%3A1566125368%3A5941%3A6351; spin=r.1001149387_b.trunk_t.1568006685_s.1_v.2_; fr=1FiR5tX5qGIcTBeYJ.AWUN-RJci6gvQO-Oy_C-DmRmkuI.BdWSqC.T-.AAA.0.0.Bddhtw.AWVOQTwd; act=1568024079894%2F7; wd=1366x244; presence=EDvF3EtimeF1568024150EuserFA21B05594357809A2EstateFDsb2F1568017429547EatF1568024148996Et3F_5bDiFA2user_3a1B06889479532A2EoF1EfF3CAcDiFA2user_3a1B13262282661A2EoF2EfF2CAcDiFA2thread_3a2041284985925628A2ErF1EoF3EfF4C_5dEutc3F1568024149007G568024150718Elm3FnullCEchFDp_5f1B05594357809F1CC';
var url = 'https://www.facebook.com/783874788396402';
var agent = 'Google Chrome';
const a = require('./getdataid.controller');
app.get('/getidpost/:post/:like', a.getId);

function getPost( { cookie, agent, url} ) {
    const option = {
      "method": "GET",
      "url": url,
      "headers": {
        "User-Agent": agent,
        "Cookie": cookie
      }
    };
    app.get('/', (req, res) => {
      
      request( option, ( err, response, body ) => {
        
        if (err) {
          console.log(err);
          res.render('crawlHtml', {html: "Loi"});
        } else {
          console.log(body);
          let $ = cheerio.load(body);
          var ds = $(body).find('#u_0_q > div._5pcr.userContentWrapper > div._1dwg._1w_m._q7o > div:nth-child(2) > div._3x-2 > div > div > div > div > a > div > img.scaledImageFitWidth.img');
          ds.each( (i, e) =>{
            // console.log($( this ).text());
            console.log(e['attribs']['src']);
          } );
          
          res.render('crawlHtml', {html: body});
          // return data;
        }
      } );
    });
};

getPost( {cookie, agent, url} );
