const express = require("express");
const router = express.Router();
const HttpError = require("../models/http-error");
const Encounter = require("../models/encounter");
const Monster = require("../models/monsters");
const ckeckAuth = require("../controllers/checkAuth");
const { default: mongoose } = require("mongoose");

router.get("/:id", async (req, res, next) => {
  let encounterOnFocus;
  const monsterId = req.params.id;

  try {
    encounterOnFocus = await Encounter.findById(monsterId);
  } catch (err) {
    const error = new HttpError(`${err}`, 500);
    return next(error);
  }
  let participent= {
    monsters:[],
    players:encounterOnFocus.players,
  };

  try {
    participent["monsters"] = await Promise.all(
      encounterOnFocus.monsters.map(async (element) => {
        const part = await Monster.find({ name: element.name });
        return part;
      })
    );
  } catch (err) {
    const error = new HttpError(`${err}`, 500);
    return next(error);
  }
  res.status(201).json(participent);
});
router.use(ckeckAuth);
router.delete("/:id", async (req, res, next) => {
    try {
      delEnc = await Encounter.findById(req.params.id).populate('creator');
    } catch (err) {
      const error = new HttpError(
        `Delete failed.`,
        500
      );
      return next(error);
    }
    if(!delEnc){
      const error = new HttpError(
        `Can't find Encounter.`,
        500
      );
      return next(error);
    }
    if(delEnc.creator.id !== req.userData.userId){
      const error = new HttpError(
        `You are not allowed to delete this place`,
        401
      );
      return next(error);
    }
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await delEnc.remove({session:sess});
      delEnc.creator.encounters.pull(delEnc)
      await delEnc.creator.save({session:sess});
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        `Delete failed reason:.`,
        500
      );
      return next(error);
    }

  res.status(201).json({message:'Encounter deleted.'});
});
module.exports = router;
