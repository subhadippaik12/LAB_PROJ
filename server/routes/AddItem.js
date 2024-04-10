const express = require('express');
const router = express.Router();
const { foodModel } = require('../models/Food.js');

router.post('/addi', async (req, res) => {
  try {
    const {
      itemName,
      itemImage,
      itemPrice,
      itemType,
      itemDescription,
      category_Name,
    } = req.body;
    // Check if all required fields are provided
    if (
      !itemName ||
      !itemImage ||
      !itemPrice ||
      !itemType ||
      !itemDescription ||
      !category_Name
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the item already exists
    const existingItem = await foodModel.findOne({ name: itemName });
    if (existingItem) {
      return res.status(400).json({ error: 'Item already exists' });
    }

    // Create a new item
    const newItem = new foodModel({
      name: itemName,
      img: itemImage,
      price: itemPrice,
      type: itemType,
      suprice: '0',
      qty: '0',
      description: itemDescription,
      CategoryName: category_Name,
    });

    // Save the new item to the database
    await newItem.save();

    // Send response with the newly added item
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
