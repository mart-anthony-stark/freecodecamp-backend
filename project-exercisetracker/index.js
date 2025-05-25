const User = require("./models/User");
const Log = require("./models/Log");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to database`);
  })
  .catch((e) => {
    console.log(`Error connecting to database: ${e.message}`);
  });

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  const user = await new User({
    username: req.body.username,
    date: new Date().toDateString(),
  }).save();

  res.send({
    _id: user._id,
    username: user.username,
  });
});

app.get("/api/users", async (req, res) => {
  const users = await User.find();

  res.send(users.flat());
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body || {};

  const log = {
    date: new Date(date || null).toISOString(),
    duration: Number(duration),
    description,
  };

  const user = await User.findByIdAndUpdate(
    _id,
    {
      $push: {
        log,
      },
    },
    { new: true, populate: "log" }
  );

  const response = {
    _id: user._id,
    username: user.username,
    ...log,
    date: new Date(log.date).toDateString(),
  };

  res.send(response);
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = await User.findById(_id).populate(["log"]);

  let filteredLog = user.log;

  // Filter by date range if from/to parameters are provided
  if (from || to) {
    filteredLog = filteredLog.filter((exercise) => {
      const exerciseDate = new Date(exercise.date);

      if (from && to) {
        return exerciseDate >= new Date(from) && exerciseDate <= new Date(to);
      } else if (from) {
        return exerciseDate >= new Date(from);
      } else if (to) {
        return exerciseDate <= new Date(to);
      }

      return true;
    });
  }

  // Apply limit if provided
  if (limit) {
    filteredLog = filteredLog.slice(0, parseInt(limit));
  }

  const response = {
    username: user.username,
    count: filteredLog.length,
    _id: user._id,
    log: filteredLog.map((exercise) => ({
      ...exercise.toObject(),
      date: new Date(exercise.date || null).toDateString(),
    })),
  };

  res.send(response);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
