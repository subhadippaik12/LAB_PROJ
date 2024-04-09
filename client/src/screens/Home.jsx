import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  const loadData = async () => {
    const response = await fetch('http://localhost:5000/api/foodData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    data[1].reverse();
    setFoodItem(data[0]);
    setFoodCat(data[1]);
  };

  useEffect(() => {
    loadData();
  }, []);

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
                {
                  <button className="btn btn-outline-success" type="submit">
                    Search
                  </button>
                }
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
      {
        <div className="container">
          {foodCat.length != 0
            ? foodCat.map((cat, k) => {
                return (
                  <div className="row mb-3" key={k}>
                    <div key={cat._id} className="fs-3 m-3">
                      {cat.CategoryName}
                    </div>
                    <hr />
                    {foodItem.length !== 0 ? (
                      foodItem
                        .filter(
                          (item) =>
                            item.CategoryName === cat.CategoryName &&
                            item.name
                              .toLowerCase()
                              .includes(search.toLowerCase())
                        )
                        .map((filterItems, k) => {
                          return (
                            <div key={k} className="col-12 col-md-6 col-lg-3">
                              <Card key={k} foodItem={filterItems}></Card>
                            </div>
                          );
                        })
                    ) : (
                      <div>No such Data Found</div>
                    )}
                  </div>
                );
              })
            : ''}
        </div>
      }
      <div>
        <Footer />
      </div>
    </>
  );
}
