// const monsters = require("./objectToInsert");
// const express = require("express");
// const HttpError = require("../models/http-error");
// const mongoose = require("mongoose");
// const router = express.Router();
// const Mon = require("./newShema");
// const User = require("../models/user");

// router.post("/", async (req, res, next) => {
// bulk = [];
//   monsters.forEach(async (monster) => {
//     [syzeType, alighment] = monster.meta.split(", ");
//     [size, type] = syzeType.split(" ");
//     ar = monster["Armor Class"].split(" ");
//     hp = monster["Hit Points"].split(" ");
//     ch = monster.Challenge.split(" ");
//     const condition = monster["Condition Immunities"]
//       ? [
//           ...monster["Condition Immunities"]
//             .split(/[.,#!$%&*;:{}=\-_`~()]/g)
//             .filter((elem) => elem.trim()),
//         ]
//       : "";
//     const damage = monster["Damage Immunities"]
//       ? [
//           ...monster["Damage Immunities"]
//             .split(/[.,#!$%&*;:{}=\-_`~()]/g)
//             .filter((elem) => elem.trim()),
//         ]
//       : "";
//     const resist = monster["Damage Resistances"]
//       ? [
//           ...monster["Damage Resistances"]
//             .split(/[.,#!$%&*;:{}=\-_`~()]/g)
//             .filter((elem) => elem.trim()),
//         ]
//       : "";
//     const vuln = monster["Damage Vulnerabilities"]
//       ? [
//           ...monster["Damage Vulnerabilities"]
//             .split(/[.,#!$%&*;:{}=\-_`~()]/g)
//             .filter((elem) => elem.trim()),
//         ]
//       : "";
//    const   createdMonster = new Mon({
//       name: monster.name,
//       meta: {
//         size: size,
//         type: type,
//         alignment: alighment,
//       },
//       "Armor Class": {
//         value: parseInt(ar[0]),
//         type: ar[1] ? ar[1] + ar[2] : " ",
//       },
//       "Hit Points": {
//         dice: `${hp[1]} + ${hp[3]}`,
//         hp: parseInt(hp[0]),
//       },
//       Speed: monster.Speed,
//       STR: monster.STR,
//       STR_mod: monster.STR_mod,
//       DEX: monster.DEX,
//       DEX_mod: monster.DEX_mod,
//       CON: monster.CON,
//       CON_mod: monster.CON_mod,
//       INT: monster.INT,
//       INT_mod: monster.INT_mod,
//       WIS: monster.WIS,
//       WIS_mod: monster.WIS_mod,
//       CHA: monster.CHA,
//       CHA_mod: monster.CHA_mod,
//       "Saving Throws": monster["Saving Throws"],
//       Skills: monster.Skills,
//       Senses: monster.Senses,
//       Languages: monster.Languages,
//       Challenge: { rating: parseInt(ch[0]), xp: `${ch[1]}) Xp` },
//       Traits: monster.Traits,
//       Actions: monster.Actions,
//       "Legendary Actions": monster["Legendary Actions"],
//       "Bonus Actions": monster["Bonus Actions"],
//       Characteristics: monster["Characteristics"],
//       "Condition Immunities": condition,
//       "Damage Immunities": damage,
//       "Damage Resistances": resist,
//       "Damage Vulnerabilities": vuln,
//       Reactions: monster["Reactions"],
//       proficiency_bonus: monster["proficiency_bonus"],
//       img_url: monster.img_url,
//       creator: "631f2f64dc17e5124e17cd0f",
//       timeforvoting: 16674833,
//     });
//     bulk.push(createdMonster)
//   });
//   let user;
//   try {
//     user = await User.findById("631f2f64dc17e5124e17cd0f");
//   } catch (err) {
//     const error = new HttpError(
//       `Monster creation failed, plsease try again.${err}`,
//       500
//     );
//     return next(error);
//   }

//   if (!user) {
//     const error = new HttpError("Can't find user with this id.", 404);
//     return next(error);
//   }
//   try {
//     //   const sess = await mongoose.startSession();
//     //   sess.startTransaction();
//       await Mon.insertMany(bulk);
//     //   await user.monsters.push(createdMonster);
//     //   await user.save({ session: sess });
//     //   await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       `Monster creation failed,please try again.${err}`,
//       500
//     );
//     return next(error);
//   }

//   res.status(201).json("done");
// });

// module.exports = router;
