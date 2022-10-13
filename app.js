const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const voting = require("./routes/routes-voting");
const battleScreen = require("./routes/routes-battlescreen");
const myEncounters = require("./routes/routes-myencounters");
const newHomebrew = require("./routes/submit_homebrew");
const newEncounter = require("./routes/build_encounter");
const userLogin = require("./routes/route-login");
const monsterLibrary = require("./routes/monster_library");
const nameChecker = require("./routes/nameChecker");
const myProfile = require("./routes/myProfile");
const editMonster = require("./routes/Edit");
const mongoose = require("mongoose");

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requesterd-With,Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});
const port = process.env.port || 5000;

app.use(bodyParser.json());

app.use("/battle_scr", battleScreen);
app.use("/voting", voting);
app.use("/my_encounters", myEncounters);
app.use("/submit_homebrew", newHomebrew);
app.use("/build_encounter", monsterLibrary);
app.use("/build_encounter/submit_new_enc", newEncounter);
app.use("/submit_homebrew/check_name", nameChecker);
app.use("/myProfile", myProfile);
app.use("/myProfile/Edit", editMonster);


app.use("/", userLogin);

app.use((req, res, next) => {
  const error = new HttpError("Can't find this page", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://Handsomepotato:8VzohWGvbVvbFoyz@dnd.mcdpizu.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening to port ${port}...`);
    });
  })
  .catch((err) => console.log(err));
