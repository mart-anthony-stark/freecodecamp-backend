require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const SHORTENED_URLS = {};

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body || {};

  if (!isValidHttpUrl(url)) {
    return res.send({ error: "invalid url" });
  }

  const short_url = `${Object.keys(SHORTENED_URLS).length + 1}`;
  SHORTENED_URLS[short_url] = url;

  const result = {
    original_url: url,
    short_url,
  };

  res.send(result);
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;

  const original_url = SHORTENED_URLS[short_url];

  res.redirect(original_url);
});

function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}
