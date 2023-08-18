require('dotenv').config();
const express = require('express');
const cors = require('cors');
const asyncHandler = require('express-async-handler')
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
async function hello_cb(req, res, next) {
  res.json({
    greeting: 'hello API'
  })
}

app.get('/api/hello', asyncHandler(hello_cb));


const urls = []
let counter = 1
const shorturl_cb = async (req, res, next) => {
  const originalUrl = req.body.url
  // check if url is valid
  const dns = require('dns');
  const hostName = new URL(originalUrl).hostname;
  dns.lookup(hostName, (err, address, family) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      const postShortUrl = counter++
      urls.push({
        originalUrl,
        postShortUrl
      });
      return res.json({
        original_url: originalUrl,
        short_url: postShortUrl
      })
    }
  })
}
app.post('/api/shorturl', asyncHandler(shorturl_cb))

const getShortUrl_cb = async (req, res, next) => {
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
}
app.get('/api/shorturl/:getShortUrl', asyncHandler(getShortUrl_cb) )

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
