const express = require("express");
const HttpError = require("../models/http-error");
const Monster = require("../models/monsters");
const router = express.Router();

router.get("/", async (req, res, next) => {
  let monster;
  const now = new Date();
  try {
    monster = await Monster.find({
      $or: [{ timeforvoting: { $lt: now } }, { number: { $gt: 0 } }],
    })
      .limit(10)
      .exec();
  } catch (err) {
    const error = new HttpError(`Can't find monsters.`, 404);
    return next(error);
  }
  res.json(monster);
});

router.post("/", async (req, res, next) => {
  let monsters;
  const now = new Date();
  const monsterSearchConditions = req.body.monsterTypes;
  let as;
  let ty;
  let alignment;
  let condition;
  let damage;
  let resistance;
  let vulnerability;
  if (monsterSearchConditions.condition.length !== 0) {
    condition = {
      "Condition Immunities": { $in: monsterSearchConditions.condition },
    };
  }
  if (monsterSearchConditions.damage.length !== 0) {
    damage = {
      "Damage Immunities": { $in: monsterSearchConditions.damage },
    };
  }
  if (monsterSearchConditions.resistance.length !== 0) {
    resistance = {
      "Damage Resistances": { $in: monsterSearchConditions.resistance },
    };
  }
  if (monsterSearchConditions.vulnerability.length !== 0) {
    vulnerability = {
      "Damage Vulnerabilities": { $in: monsterSearchConditions.vulnerability },
    };
  }
  if (monsterSearchConditions.alignment.length !== 0) {
    alignment = {
      "meta.alignment": { $in: monsterSearchConditions.alignment },
    };
  }
  if (monsterSearchConditions.types.length !== 0) {
    ty = {
      "meta.type": { $in: monsterSearchConditions.types },
    };
  }
  if (monsterSearchConditions.legendary !== "Any") {
    as = {
      "Legendary Actions": { $exists: monsterSearchConditions.legendary },
    };
  }
  try {
    //
    monsters = await Monster.find({
      name: { $regex: monsterSearchConditions.name, $options: "i" },
      ...as,
      ...ty,
      ...alignment,
      ...condition,
      ...damage,
      ...resistance,
      ...vulnerability,
      "Challenge.rating": {
        $gte: req.body.rating.min,
        $lte: req.body.rating.max,
      },
      "Armor Class.value": {
        $gte: req.body.armor.min,
        $lte: req.body.armor.max,
      },
      "Hit Points.hp": { $gte: req.body.health.min, $lte: req.body.health.max },
      $or: [{ timeforvoting: { $lt: now } }, { 'votes.number': { $gt: 0 } }],
    })
      .limit(monsterSearchConditions.limit)
      .exec();
  } catch (err) {
    const error = new HttpError(
      `There are no creatures with these parameters.`,
      404
    );
    return next(error);
  }
  res.status(201).json(monsters);
});

module.exports = router;
