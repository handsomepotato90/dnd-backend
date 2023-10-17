const express = require("express");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const ckeckAuth = require("../controllers/checkAuth");

router.delete("/delete", async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.body.uId).exec();
  } catch (err) {
    const error = new HttpError(
      `Can't fetch user.Please try again later.`,
      500
    );
    return next(error);
  }
  for (let i = 0; i < user.calculatorSaves.length; i++) {
    const element = user.calculatorSaves[i];
    if (element._id == req.body.id) {
      user.calculatorSaves.splice(i, 1);
    }
  }
  const result = await user.save();

  res.status(201).json({ presets: user.calculatorSaves });
});

router.patch("/rename", async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.body.uId);
  } catch (err) {
    const error = new HttpError(
      `Can't fetch user.Please try again later.`,
      500
    );
    return next(error);
  }

  for (let i = 0; i < user.calculatorSaves.length; i++) {
    const element = user.calculatorSaves[i];
    if (element._id == req.body.id) {
      element.calculationName = req.body.newName;
    }
  }
  const result = await user.save();

  res.status(201).json({ presets: result.calculatorSaves });
});

router.use(ckeckAuth);
router.post("/save", async (req, res, next) => {
  let user;
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
  try {
    user = await User.findById(req.body.id);
  } catch (err) {
    const error = new HttpError(
      `Can't fetch user.Please try again later.`,
      500
    );
    return next(error);
  }

  res.status(201).json({ presets: user.calculatorSaves });
});

router.post("/load", async (req, res, next) => {
  try {
    user = await User.findById({ _id: req.body.id }).select("calculatorSaves");
  } catch (err) {
    const error = new HttpError(
      `Can't fetch user.Please try again later.`,
      500
    );
    return next(error);
  }
  res.status(201).json({ presets: user });
});

module.exports = router;
