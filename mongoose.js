// const mongoose = require("mongoose");

// const Monster = require("./models/monsters");

// mongoose
//   .connect(
//     "mongodb+srv://Handsomepotato:8VzohWGvbVvbFoyz@dnd.mcdpizu.mongodb.net/?retryWrites=true&w=majority"
//   )
//   .then(() => {
//     console.log("Connected to Db !");
//   })
//   .catch(() => {
//     console.log("Connection failed!");
//   });


// //save a Monster
// const createMonster = async (req, res, next) => {
//   const createdMonster = new Monster({
//     name: req.body.name,
//     meta: req.body.meta,
//     "Armor Class": req.body['Armor Class'],
//     "Hit Points": req.body['Hit Points'],
//     Speed: req.body.Speed,
//     STR: req.body.STR,
//     STR_mod: req.body.STR_mod,
//     DEX: req.body.DEX,
//     DEX_mod: req.body.DEX_mod,
//     CON: req.body.CON,
//     CON_mod: req.body.CON_mod,
//     INT: req.body.INT,
//     INT_mod: req.body.INT_mod,
//     WIS: req.body.WIS,
//     WIS_mod: req.body.WIS_mod,
//     CHA: req.body.CHA,
//     CHA_mod: req.body.CHA_mod,
//     "Saving Throws": req.body['Saving Throws'],
//     Skills: req.body.Skills,
//     Senses: req.body.Senses,
//     Languages: req.body.Languages,
//     Challenge: req.body.Challenge,
//     Traits: req.body.Traits,
//     Actions: req.body.Actions,
//     "Legendary Actions": req.body['Legendary Actions'],
//     img_url: req.body.img_url,
//   });
//   const result = await createdMonster.save();
//   res.json(result);
// };




// //get all Monsters
// const getMonster = async (req, res, next) => {
//   const monster = await Monster.find().exec();
//   res.json(monster)
// };

// exports.createMonster = createMonster;
// exports.getMonster = getMonster;

