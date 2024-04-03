const express = require('express');
const router = express.Router();
const OrderModel = require('../models/Order.js');

router.post('/orderData', async (req, res) => {
  const data = req.body.order_data;
  //console.log(data);
  await data.splice(0, 0, { Order_date: req.body.order_date });
  let eId = await OrderModel.findOne({ email: req.body.email });
  console.log(eId);
  if (eId === null) {
    const ord = new OrderModel({
      email: req.body.email,
      order_data: [data],
    });
    try {
      const response = await ord.save();
      res.json({ success: true });
    } catch (error) {
      console.log(error.message);
      res.json({ 'Server Error': error.message });
    }
  } else {
    try {
      const response = await OrderModel.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      );

      if (response) {
        res.json({ success: true });
      } else res.json({ success: false });
    } catch (error) {
      res.send('Server Error', error.message);
    }
  }
});

router.post('/myOrderData', async (req, res) => {
  try {
    const myData = await OrderModel.findOne({ email: req.body.email });
    res.json({ orderData: myData });
  } catch (err) {
    res.send('Server Error', error.message);
  }
});

module.exports = router;
