import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Categories from '../components/Categories';
import Path from '../Path';
export default function Home() {
  const role = localStorage.getItem('role');
  const [newCategory, setNewCategory] = useState('');
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  const loadData = async () => {
    try {
      const response = await fetch(Path.api_path+'/api/foodData', {
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
        const response = await fetch(Path.api_path+'/addCategory/add', {
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

  const delete_Category = async (categoryId, catName) => {
    try {
      const response = await fetch(Path.api_path+
        `/deleteCategory/${categoryId}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        setFoodCat(foodCat.filter((cat) => cat._id !== categoryId));
        setFoodItem(
          foodItem.filter((el) => {
            return el.CategoryName != catName;
          })
        );
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
    const updatedItems = foodItem.filter((item) => item._id !== itemId);
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
          <Categories
            key={cat._id}
            cat={cat}
            delete_Category={delete_Category}
            filteredItems={filteredItems}
            role={role}
            handleDeleteItem={handleDeleteItem}
            setFoodItem={setFoodItem}
            foodItem={foodItem}
          ></Categories>
        ))}

        {role === 'Manager' && (
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
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
