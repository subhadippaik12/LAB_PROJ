const express = require('express');
const router = express.Router();

const { foodModel } = require('../models/Food.js');

router.put('/update', async (req, res) => {
    const { item, opt, quantity } = req.body;

  try {
    // Find the food item by ID
    const foodData = await foodModel.findOne({ name: item });
    if (!foodData) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    // Update the available quantity
    const newoptions = foodData.options.map((el) => {
        if (Object.keys(el).includes(opt)) {
          el[opt][1] = parseInt(el[opt][1])+ parseInt(quantity);
        }
        return el;
      });

      const res2 = await foodModel.updateOne(
        { name: item },
        { options: newoptions }
      );
      res.send({ success: true });
  } catch (err) {
    console.error('Error increasing quantity:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
