const mongoose = require('mongoose');

const { Schema } = mongoose;

const SupplySchema = new Schema({
  name: String,
  mobileno: String,
  totprice: String,
  date: String,
  items: Array,
});

const SupplyModel = mongoose.model('supplies', SupplySchema);
module.exports = SupplyModel;
