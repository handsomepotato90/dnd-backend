const mongoose = require("mongoose");

const CharecterSheetsSchema = new mongoose.Schema({
  AC: { type: String, required: true },
  background_appearance: { type: Object },
  conditions: { type: String },
  defences: { type: String },
  attuned_items: { type: Object },
  characteristics: { type: Object },
  classes: { type: Array, required: true },
  currency: { type: Object },
  inventory: { type: String },
  hp_max: { type: String, required: true },
  meta: { type: Object, required: true },
  notes: { type: Object },
  proficiency: { type: String, required: true },
  skills: { type: Object, required: true },
  speed: { type: Number },
  spell_mod: { type: Object },
  stats: { type: Object, required: true },
  otherProff: { type: Object },
  weapons: { type: Array },
  spells: { type: Object },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  xp: { type: Number },
  currHp: { type: Number },
  tempHp: { type: Number },
  inspiration: { type: Number },
  specialStat: { type: Number },
  specialName: { type: String },
});

module.exports = mongoose.model("chsheets", CharecterSheetsSchema);
