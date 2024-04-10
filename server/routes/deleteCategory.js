// Import necessary modules
const express = require('express');
const router = express.Router();

// Define route for deleting an item
const { foodModel ,categoryModel} = require('../models/Food.js');
router.delete('/:id', async (req, res) => {
  const itemId = req.params.id;
  try {
    // Your logic to delete the item from the database goes here
    const category = await categoryModel.findById(itemId);
    await categoryModel.findByIdAndDelete(itemId);
    if(category)await foodModel.deleteMany({ CategoryName:category.CategoryName });
    // Send success response
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, message: 'Error deleting item' });
  }
});

// Export the router
module.exports = router;
