import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
  const role = localStorage.getItem('role');
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemType, setNewItemType] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');


  const loadData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/foodData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setFoodItem(data[0]);
      setFoodCat(data[1]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addCategory = async () => {
    if (newCategory.trim() !== '') {
      try {
        const response = await fetch('http://localhost:5000/addCategory/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ CategoryName: newCategory }),
        });
        if (response.ok) {
          const newCategoryData = await response.json();
          setFoodCat([...foodCat, newCategoryData]);
          setNewCategory('');
        } else {
          console.error('Failed to add category');
        }
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/deleteCategory/${categoryId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the deleted category from the state
        setFoodCat(foodCat.filter(cat => cat._id !== categoryId));
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const addItem = async (categoryName) => {
    if (
      newItemName.trim() !== '' &&
      newItemImage.trim() !== '' &&
      newItemPrice.trim() !== '' &&
      newItemType.trim() !== '' &&
      newItemDescription.trim() !== ''
    ) {
      try {
        const response = await fetch('http://localhost:5000/addItem/addi', {
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
  const delete_Category = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/deleteCategory/${categoryId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFoodCat(foodCat.filter(cat => cat._id !== categoryId));
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = foodItem.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleDeleteItem = (itemId) => {
    // Filter out the deleted item from the foodItem state
    const updatedItems = foodItem.filter(item => item._id !== itemId);
    setFoodItem(updatedItems); // Update the foodItem state
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'contain !important',
          }}
        >
          <div className="carousel-inner" id="carousel">
            <div
              className="carousel-caption d-md-block"
              style={{ zIndex: '10' }}
            >
              <div className="d-flex justify-content-center">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </div>
            </div>
            <div className="carousel-item active">
              <img
                src="https://source.unsplash.com/random/900x700/?burger"
                className="d-block w-100"
                style={{ filter: 'brightness(30%)' }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://source.unsplash.com/random/900x700/?pastry"
                className="d-block w-100"
                style={{ filter: 'brightness(30%)' }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://source.unsplash.com/random/900x700/?barbeque"
                className="d-block w-100"
                style={{ filter: 'brightness(30%)' }}
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className="container mt-4">
        {foodCat.map((cat) => (
          <div key={cat._id}>
          <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="fs-3 m-3">{cat.CategoryName}</div>
              {role === 'Manager'&&<button
                className="btn btn-sm btn-danger"
                style={{ width: '10%' }}
                onClick={() => delete_Category(cat._id)}
              >
                Delete category
              </button>
              }
            </div>
          </div>
            <div className="row mb-3">
              {filteredItems
                .filter((item) => item.CategoryName === cat.CategoryName)
                .map((item, idx) => (
                  <div className="col-md-3 mb-3" key={idx}>
                    <Card key={item._id} foodItem={item} onDelete={handleDeleteItem} />
                  </div>
                ))}
              {role === 'Manager'&&
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
              </div>}
            </div>
          </div>
        ))}
        {role === 'Manager'&&
        <div className="row mt-4">
          <div className="col-md-6">
            <input
              className="form-control"
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          
          <div className="col-md-6">
            <button className="btn btn-primary w-100" onClick={addCategory}>
              Add Category
            </button>
          </div>
        </div>}
      </div>
      <Footer />
    </>
  );
}
