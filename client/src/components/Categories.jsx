import React, { useState } from 'react';
import Card from '../components/Card';
import Path from '../Path';
export default function Categories(props) {
  const {
    cat,
    delete_Category,
    filteredItems,
    role,
    handleDeleteItem,
    foodItem,
    setFoodItem,
  } = props;
  const [newItemName, setNewItemName] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemType, setNewItemType] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const addItem = async (categoryName) => {
    if (
      newItemName.trim() !== '' &&
      newItemImage.trim() !== '' &&
      newItemPrice.trim() !== '' &&
      newItemType.trim() !== '' &&
      newItemDescription.trim() !== ''
    ) {
      try {
        const response = await fetch(Path.api_path+'/addItem/addi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemName: newItemName,
            itemImage: newItemImage,
            itemPrice: newItemPrice,
            itemType: newItemType,
            itemDescription: newItemDescription,
            category_Name: categoryName, // Pass category name here
          }),
        });
        if (response.ok) {
          const newItemData = await response.json();
          setFoodItem([...foodItem, newItemData]);
          // Resetting the form inputs after adding the item
          setNewItemName('');
          setNewItemImage('');
          setNewItemPrice('');
          setNewItemType('');
          setNewItemDescription('');
        } else {
          console.error('Failed to add item');
        }
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };
  return (
    <div>
      <div className="row mb-3">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="fs-3 m-3">{cat.CategoryName}</div>
          {role === 'Manager' && (
            <button
              className="btn btn-sm btn-danger"
              style={{ width: '10%' }}
              onClick={() => delete_Category(cat._id, cat.CategoryName)}
            >
              Delete category
            </button>
          )}
        </div>
      </div>
      <div className="row mb-3">
        {filteredItems
          .filter((item) => item.CategoryName === cat.CategoryName)
          .map((item, idx) => (
            <div className="col-md-3 mb-3" key={idx}>
              <Card
                key={item._id}
                foodItem={item}
                onDelete={handleDeleteItem}
              />
            </div>
          ))}
        {role === 'Manager' && (
          <div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Add New Item</h5>
                <hr />
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="Image URL"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                />
                <input
                  className="form-control mb-3"
                  type="number"
                  placeholder="Price"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                />
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="Type"
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value)}
                />
                <textarea
                  className="form-control mb-3"
                  placeholder="Description"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                />
                <button
                  className="btn btn-primary w-100"
                  onClick={() => addItem(cat.CategoryName)}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
