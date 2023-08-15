const express = require("express");
const HttpError = require("../models/http-error");
const Monster = require("../models/monsters");
const router = express.Router();
const ckeckAuth = require("../controllers/checkAuth");




router.get("/:id", async (req, res, next) => {
  const monsterId = req.params.id;
  try {
    monster = await Monster.findById(monsterId).exec();
  } catch (err) {
    const error = new HttpError(`Can't find monsters.`, 404);
    return next(error);
  }

  res.status(201).json(monster);
});

router.use(ckeckAuth);

router.patch("/:id", async (req, res, next) => {
  const monsterId = req.params.id;
  const now = new Date().getTime();
  try {
    monster = await Monster.findById(monsterId).exec();
  } catch (err) {
    const error = new HttpError(`Can't update monsters.`, 401);
    return next(error);
  }
  if(monster.creator.toString() !== req.userData.userId){
    const error = new HttpError(`You are Not allowed to edit this place.`, 401);
    return next(error);
  }
  try {
    monster = await Monster.findByIdAndUpdate(
      monsterId,
      {
        ...req.body,
        timeforvoting: now + 604800000,
        votes: {
          number: 1,
          yes: [req.body.creator],
          no: [],
        },
      },
      {
        new: true,
        upsert: true,
      }
    ).exec();
  } catch (err) {
    const error = new HttpError(`Can't update monsters.${err}`, 404);
    return next(error);
  }

  res.status(201).json(monster);
});


module.exports = router;
