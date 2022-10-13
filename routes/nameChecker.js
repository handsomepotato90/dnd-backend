const express = require("express");
const router = express.Router();
const Monster = require("../models/monsters");
const HttpError = require("../models/http-error");

router.post("/", async (req, res, next) => {
 
  try {
    monster = await Monster.find({name: req.body.name}).collation({ locale: "en", strength: 1 }).exec();
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
