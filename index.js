require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = []
let counter = 1
const isValidUrl = (url) => {
  const urlRegex = /^(https?):\/\/(\w+\.)+\w{2,}\/?(\S+)?$/;
  return urlRegex.test(url)
}
app.route('/api/shorturl/:getShortUrl?').post((req, res, next) => {
  const originalUrl = req.body.url
  // check if url is valid
  if(!isValidUrl(originalUrl)) {
    return res.json({
      error: "invalid url"
    })
  }
  // if is valid url, generate short url
  const postShortUrl = counter++
  urls.push({
    originalUrl,
    postShortUrl
  });
  // return json response
  res.json({
    original_url: originalUrl,
    short_url: postShortUrl
  })
  next()
})
.get((req, res) => {
  const getShortUrl = parseInt(req.params.getShortUrl);
  console.log(urls[0].postShortUrl)
  // get original url based on short url
  const urlData = urls.find((item) => {
    return item.postShortUrl === getShortUrl
  })
  console.log(urlData)
  try {
    res.redirect(urlData.originalUrl)
  } catch (error) {
    res.json({
      error: "invalid url 2"
    })
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
