const express = require("express");
const HttpError = require("../models/http-error");
const Monster = require("../models/monsters");
const router = express.Router();


router.get("/", async (req, res, next) => {
  let monster;
  const now = new Date();
  try {
    monster = await Monster.find({ timeforvoting: { $gt: now } }).exec();
  } catch (err) {
    const error = new HttpError(
      `Can't find monsters that need to be approved.${err}`,
      404
    );
    return next(error);
  }

  res.json(monster);
});

router.post("/", async (req, res, next) => {
  let monster;
  try {
    monster = await Monster.findById(req.body.id).exec();
  } catch (err) {
    const error = new HttpError(`Vote Failed! Please try again.`, 500);
    return next(error);
  }
  if (!monster || monster.length > 1) {
    const error = new HttpError(`Vote Failed! Please try again.`, 500);
    return next(error);
  }

  const yes = monster.votes.yes.indexOf(req.body.uid);
  const no = monster.votes.no.indexOf(req.body.uid);



  switch (req.body.vote){
    case "Yes":
      Monster.findOneAndUpdate(
        { _id: req.body.id },
        
        { 
          $inc:{"votes.number":1},
          $push: { "votes.yes": [req.body.uid] } 
        }
      ).exec();
      Monster.findOneAndUpdate(
        { _id: req.body.id },
        {
          $pullAll: { "votes.no": [req.body.uid] },
        }
      ).exec();
      break;
    case "No":
      Monster.findOneAndUpdate(
        { _id: req.body.id },
        {
          $inc:{"votes.number":-1},
          $push: { "votes.no": [req.body.uid] },
        }
      ).exec();
      Monster.findOneAndUpdate(
        { _id: req.body.id },
        {
          $pullAll: { "votes.yes": [req.body.uid] },
        }
      ).exec();
      break;
  }
  res.status(201).json()
});

module.exports = router;
