const mongoose = require('mongoose');

const MsarifSchema = new mongoose.Schema({
  amount: Number,
  desc: String,
  date: String,
  currency: String,
  usdAmount: Number,
  lbpAmount: Number,
});

module.exports = mongoose.model('Msarif', MsarifSchema);