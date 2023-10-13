const express = require("express");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const ckeckAuth = require("../controllers/checkAuth");

router.use(ckeckAuth);

router.post("/save", async (req, res, next) => {
  console.log(req.body);
  try {
    user = await User.updateOne(
      { _id: req.body.id },
      {
        $push: {
          calculatorSaves: {
            calculationName: req.body.nameOfCalculation,
            formula: req.body.calculation,
          },
        },
      }
    );
  } catch (err) {
    const error = new HttpError(
      `Can't fetch user.Please try again later.`,
      500
    );
    return next(error);
  }
  res.status(201).json();
});

router.post("/load", async (req, res, next) => {
  console.log(req.body);
  try {
    user = await User.findById({ _id: req.body.id }).select("calculatorSaves");
  } catch (err) {
    const error = new HttpError(
      `Can't fetch user.Please try again later.`,
      500
    );
    return next(error);
  }
  console.log(user);
  res.status(201).json({ presets: user });
});

module.exports = router;
