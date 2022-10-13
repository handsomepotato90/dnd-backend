const express = require("express");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const router = express.Router();
const Encounter = require("../models/encounter");
const User = require("../models/user");



router.post("/", async (req, res, next) => {
  const encounter = new Encounter({
    enc_name: req.body.enc_name,
    creator: req.body.creator,
    monsters: [],
  });
  req.body.monsters.forEach((monster, i) => {
    encounter['monsters'].push({
      name: monster.name,
      img: monster.img,
    });
  });
  
  let user;
  try {
    user = await User.findById(req.body.creator);
  } catch (err) {
    const error = new HttpError(
      "Monster creation failed, plsease try again.",
      500
    );
    return next(error);
  }

  if(!user){
    const error = new HttpError(
      "Can't find user with this id.",
      404
    );
    return next(error);
  }

  try {
    
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await encounter.save({session:sess});
    user.encounters.push(encounter);
    await user.save({session:sess});
    await sess.commitTransaction();



  } catch (err) {
    const error = new HttpError(
      `Monster creation failed,please try again. ${err}`,
      500
    );
    return next(error);
  }
  res.status(201).json(encounter);
});

module.exports = router;
