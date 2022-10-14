const express = require("express");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const router = express.Router();
const Monster = require("../models/monsters");
const User = require("../models/user");
const ckeckAuth = require("../controllers/checkAuth");


router.use(ckeckAuth);

router.post("/", async (req, res, next) => {
  const now = new Date().getTime();
  const createdMonster = new Monster({
    name: req.body.name,
    meta: req.body.meta,
    "Armor Class": req.body["Armor Class"],
    "Hit Points": req.body["Hit Points"],
    Speed: req.body.Speed,
    STR: req.body.STR,
    STR_mod: req.body.STR_mod,
    DEX: req.body.DEX,
    DEX_mod: req.body.DEX_mod,
    CON: req.body.CON,
    CON_mod: req.body.CON_mod,
    INT: req.body.INT,
    INT_mod: req.body.INT_mod,
    WIS: req.body.WIS,
    WIS_mod: req.body.WIS_mod,
    CHA: req.body.CHA,
    CHA_mod: req.body.CHA_mod,
    "Saving Throws": req.body["Saving Throws"],
    Skills: req.body.Skills,
    Senses: req.body.Senses,
    Languages: req.body.Languages,
    Challenge: { rating: req.body.Challenge.rating, xp: req.body.Challenge.xp },
    Traits: req.body.Traits,
    Actions: req.body.Actions,
    "Legendary Actions": req.body["Legendary Actions"],
    "Bonus Actions": req.body["Bonus Actions"],
    Characteristics: req.body["Characteristics"],
    "Condition Immunities": req.body["Condition Immunities"],
    "Damage Immunities": req.body["Damage Immunities"],
    "Damage Resistances": req.body["Damage Resistances"],
    "Damage Vulnerabilities": req.body["Damage Vulnerabilities"],
    Reactions: req.body["Reactions"],
    proficiency_bonus: req.body["proficiency_bonus"],
    img_url: req.body.img_url,
    creator: req.body.creator,
    votes: {
      number: 1,
      yes: [req.body.creator],
      no: [],
    },
    timeforvoting: now + 604800000,
  });
  let user;
  let monster;
  try {
    monster = await Monster.findOne({name:req.body.name}).collation({ locale: "en", strength: 1 }).exec();
  } catch (err) {
    const error = new HttpError(
      "There is a monster with this name. Plese choose another.",
      500
    );
    return next(error);
  }
  if (monster) {
    const error = new HttpError("There is a monster with this name. Plese choose another.", 404);
    return next(error);
  }
  try {
    user = await User.findById(req.body.creator);
  } catch (err) {
    const error = new HttpError(
      "Monster creation failed, plsease try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Can't find user with this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdMonster.save({ session: sess });
    user.monsters.push(createdMonster);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      `Some of your fields are not filled right or you have missed to fill them. Fields with "#" must be numbers . Plese try again.`,
      500
    );
    return next(error);
  }
  res.status(201).json(createdMonster);
});



module.exports = router;
