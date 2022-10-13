const mongoose = require("mongoose");

const monsterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    meta: {
      size: { type: String, required: true },
      type: { type: String, required: true },
      alignment: { type: String, required: true },
    },
    "Armor Class": {
      value: { type: Number, required: true },
      type: { type: String, required: true },
    },
    "Hit Points": {
      dice: { type: String, required: true },
      hp: { type: Number, required: true },
    },
    Speed: { type: String },
    STR: { type: Number, required: true },
    STR_mod: { type: String, required: true },
    DEX: { type: Number, required: true },
    DEX_mod: { type: String, required: true },
    CON: { type: Number, required: true },
    CON_mod: { type: String, required: true },
    INT: { type: Number, required: true },
    INT_mod: { type: String, required: true },
    WIS: { type: Number, required: true },
    WIS_mod: { type: String, required: true },
    CHA: { type: Number, required: true },
    CHA_mod: { type: String, required: true },
    "Saving Throws": { type: String },
    Skills: { type: String },
    Senses: { type: String },
    Languages: { type: String },
    Challenge: { rating: { type: Number }, xp: { type: String } },
    Traits: { type: String },
    Actions: { type: String },
    "Legendary Actions": { type: String },
    img_url: { type: String },
    "Bonus Actions": { type: String },
    Characteristics: { type: String },
    "Condition Immunities": [String],
    "Damage Immunities": [String],
    "Damage Resistances": [String],
    "Damage Vulnerabilities": [String],
    Reactions: { type: String },
    proficiency_bonus: { type: Number },
    timeforvoting: { type: Number },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    votes:{
      number:{ type: Number },
      yes:[String],
      no: [String],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("monsters", monsterSchema);
