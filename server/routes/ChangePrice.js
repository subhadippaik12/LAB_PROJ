const express = require('express');
const router = express.Router();

const { foodModel } = require('../models/Food.js');
router.put('/change', async (req, res) => {
  const { role, item, newprice } = req.body;
  try {
    if (role === 'Manager') {
      const res2 = await foodModel.updateOne(
        { name: item },
        { price: newprice }
      );
      res.send({ success: true });
    } else {
      const res2 = await foodModel.updateOne(
        { name: item },
        { suprice: newprice }
      );
      res.send({ success: true });
    }
  } catch (err) {
    console.log(err);
    res.send({ success: false });
  }
});

module.exports = router;
