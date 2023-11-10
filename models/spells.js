const mongoose = require("mongoose");

const SpellsSchema = new mongoose.Schema({
  name: { type: String },
  source: { type: String },
  page: { type: Number },
  level: { type: Number },
  school: { type: String },
  time: { type: Array },
  range: {
    type: { type: String },
  },
  components: {
    v: { type: Boolean },
    s: { type: Boolean },
    m: { type: String },
  },
  duration: { type: Array },
  text: { type: Array },
  textHighLevel: { type: Array },
  damageInflict: { type: Array },
  conditionInflict: { type: Array },
  savingThrow: { type: Array },
  classes: { type: Array },
});

module.exports = mongoose.model("spells", SpellsSchema);
