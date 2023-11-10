const HttpError = require("../models/http-error");
const ChSheets = require("../models/charSheets");
const User = require("../models/user");
const mongoose = require("mongoose");
const Spells = require("../models/spells");

const saving = async (req, res, next) => {
  const chs = req.body;
  let user;
  const charSheet = new ChSheets({
    AC: chs.AC,
    background_appearance: chs.background_appearance,
    conditions: chs.conditions,
    defences: chs.defences,
    attuned_items: chs.attuned_items,
    characteristics: chs.characteristics,
    classes: chs.classes,
    currency: chs.currency,
    inventory: chs.inventory,
    hp_max: chs.hp_max,
    meta: chs.meta,
    notes: chs.notes,
    proficiency: chs.proficiency,
    skills: chs.skills,
    speed: chs.speed,
    spell_mod: chs.spell_mod,
    stats: chs.stats,
    otherProff: chs.otherProff,
    weapons: chs.weapons,
    spells: chs.spells,
    creator: chs.creator,
  });

  try {
    user = await User.findById(chs.creator);
  } catch (err) {
    const error = new HttpError(``, 500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await charSheet.save({ session: sess });
    user.user_pcs.push(charSheet);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(``, 500);
    return next(error);
  }
  res.status(201).json({});
};

const allUserPc = async (req, res, next) => {
  let char = [];
  let spel;
  try {
    user = await User.findById(req.params.id);
  } catch (err) {
    const error = new HttpError(``, 500);
    return next(error);
  }
  for (let i = 0; i < user.user_pcs.length; i++) {
    const element = user.user_pcs[i];
    try {
      sheet = await ChSheets.findById(element);

      try {
        Object.values(sheet.spells).forEach(async (val) => {
          val.spells = [];
          // let spellsForLevel = [];
          for (let i = 0; i < val.spell_ids.length; i++) {
            const element = val.spell_ids[i];
            spel = await Spells.findById(element);
            await val.spells.push(spel);
          }
          // val.spells.push(spellsForLevel);
          console.log(val.spells);
        });
      } catch (err) {
        const error = new HttpError(`${err}`, 500);
        return next(error);
      }

      char.push(sheet);
    } catch (err) {
      const error = new HttpError(``, 500);
      return next(error);
    }
  }

  res.status(201).json(char);
};
const search = async (req, res, next) => {
  const level = req.body.level;
  let levelToUse = 0;
  let spells;
  if (req.body.level === "Can") {
    levelToUse = 0;
  } else {
    levelToUse = parseInt(Array.from(level)[0]);
  }
  // console.log(levelToUse);

  try {
    spells = await Spells.find({ level: levelToUse }).exec();
  } catch (err) {
    const error = new HttpError(
      `Monster creation failed, plsease try again.${err}`,
      500
    );
    return next(error);
  }
  // console.log(spells)
  res.status(201).json(spells);
};
exports.saving = saving;
exports.allUserPc = allUserPc;
exports.search = search;
