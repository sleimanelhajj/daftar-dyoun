const mongoose = require('mongoose');

const MsarifSchema = new mongoose.Schema({
  amount: Number,
  desc: String,
  date: String,
  currency: String,
  usdAmount: Number,
  lbpAmount: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Msarif', MsarifSchema);