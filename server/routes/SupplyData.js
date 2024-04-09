const express = require('express');
const router = express.Router();
const SupplyModel = require('../models/Supplies.js');
const { foodModel } = require('../models/Food.js');

router.post('/orderData', async (req, res) => {
  const data = req.body.order_data;

  const ord = new SupplyModel({
    totprice: req.body.order_price,
    date: req.body.order_date,
    items: data,
  });
  try {
    const response = await ord.save();
    data.forEach(async (el) => {
      const resp1 = await foodModel.findOne({ name: el.name });
      const currQty = parseInt(resp1.qty) + parseInt(el.qty);
      const resp = await foodModel.updateOne(
        { name: el.name },
        { qty: currQty.toString() }
      );
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ 'Server Error': error.message });
  }
});

router.get('/myOrderData', async (req, res) => {
  try {
    const myData = await SupplyModel.find();
    res.json({ orderData: myData });
  } catch (err) {
    res.send('Server Error', err.message);
  }
});

module.exports = router;
