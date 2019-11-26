const getDataId = require('./getdataid.module');
const {IDPAGE} = require('./config');
access_token = 'EAAAAZAw4FxQIBAKwwOFPN8DaVyLTtJwoT423ST9zOiFKUxZAtekBq8SGpz2ehLBm7omPybfJHvFD1aqUlW1bICTN2mW1igFgQTCaimsAfyYGulsiuY1U15LU1cpJZCniZCmu4NUqcr193VSaZBG8gdbQwT7CmBiLci8FoGIruZCQZDZD';
module.exports.getId = (req, res, next) => {
  const data = req.params;
  const like = data.like;
  const post = data.post;
  if ( !data ) {
    res.status(500).send('Lỗi 500');
    return;
  }

  var url = getDataId.setURL(IDPAGE.HOLA_HANOI, access_token);
  getDataId.getabc(url, post, like).then( data => {
    console.log(data);
    res.json(
      {data}
    );
  } );
  // res.json(
  //   {data: req.params.aaa}
  // )

}
