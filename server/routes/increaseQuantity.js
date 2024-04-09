const express = require('express');
const router = express.Router();

const { foodModel } = require('../models/Food.js');

router.put('/update', async (req, res) => {
  const { item, quantity } = req.body;

  try {
    // Find the food item by ID
    const res2 = await foodModel.updateOne({ name: item }, { qty: quantity });
    res.send({ success: true });
  } catch (err) {
    console.error('Error increasing quantity:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
