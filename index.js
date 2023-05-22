require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
  const urlRegex = /^(https{1}):\/\/(\w+\.)+\w{2,}\/?(\S+)?$/;
  return urlRegex.test(url)
}
app.post('/api/shorturl', (req, res) => {
  let returnVal
  const originalUrl = req.body.url
  // check if url is valid
  if(!isValidUrl(originalUrl)) {
    returnVal = {
      error: "invalid url"
    }
  } else {
    // if is valid url, generate short url
    const postShortUrl = counter++
    urls.push({
      originalUrl,
      postShortUrl
    });
    // return json response
    returnVal = {
      original_url: originalUrl,
      short_url: postShortUrl
    }
  }
  return res.json(returnVal)
})
app.get('/api/shorturl/:getShortUrl', (req, res) => {
  const getShortUrl = parseInt(req.params.getShortUrl);
  // get original url based on short url
  const urlData = urls.find((item) => {
    return item.postShortUrl === getShortUrl
  })
  try {
    return res.redirect(urlData.originalUrl)
  } catch (error) {
    return res.json({
      error: "invalid url"
    })
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
