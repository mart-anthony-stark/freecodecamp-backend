const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();
const { logger, appendTime } = require("./middlewares");

const app = express();
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger);

app.get("/", (req, res) => {
  const absolutePath = __dirname + "/views/index.html";

  res.sendFile(absolutePath);
});

app.get("/json", (req, res) => {
  let message = "Hello json";

  if (process.env.MESSAGE_STYLE === "uppercase") {
    message = message.toUpperCase();
  }

  res.json({
    message,
  });
});

app.get("/now", appendTime, (req, res, next) => {
  res.send({
    time: req.time,
  });
});

app.get("/:word/echo", (req, res) => {
  res.send({
    echo: req.params.word,
  });
});

app.get("/name", (req, res) => {
  const { first, last } = req.query;

  res.send({
    name: `${first} ${last}`,
  });
});

app.post("/name", (req, res) => {
  const { first, last } = req.body;

  res.send({
    name: `${first} ${last}`,
  });
});

module.exports = app;
