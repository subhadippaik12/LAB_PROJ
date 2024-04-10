const express = require('express');
const router = express.Router();
const { categoryModel } = require('../models/Food.js');

// Route to add a new category
router.post('/add', async (req, res) => {
  try {
    const { CategoryName } = req.body;

    // Check if CategoryName is provided
    if (!CategoryName) {
      return res.status(400).json({ error: 'CategoryName is required' });
    }

    // Check if the category already exists
    const existingCategory = await categoryModel.findOne({ CategoryName });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Add the new category
    const newCategory = new categoryModel({ CategoryName });
    await newCategory.save();

    // Send response with the newly added category
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
