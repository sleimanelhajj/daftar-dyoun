const mongoose = require('mongoose');

const DyounSchema = new mongoose.Schema({
  name: String,
  phone: String,
  amount: Number,
  type: String,
  currency: String,
  date: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
});
module.exports = mongoose.model('Dyoun', DyounSchema);