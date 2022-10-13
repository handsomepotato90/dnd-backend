const express = require("express");
const router = express.Router();
const Encounter = require("../models/encounter");
const HttpError = require("../models/http-error");
const User = require("../models/user");

router.post("/", async (req, res, next) => {
  try {
    user = await User.findById(req.body.user);
  } catch (err) {
    const error = new HttpError(
      `Can't fetch user.Please try again later.`,
      500
    );
    return next(error);
  }
  if(!user){
    const error = new HttpError(
      `There is no such user.`,
      500
    );
    return next(error);
  }

    try {
      monster = await Encounter.find({'_id':{$in:user.encounters}});

    } catch (err) {
      const error = new HttpError(
        `Monster creation failed, plsease try again.${err}`,
        500
      );
      return next(error);
    }


  res.status(201).json(monster);
});




module.exports = router;
