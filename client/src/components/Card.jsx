import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
  const priceRef = useRef();
  const dispatch = useDispatchCart();
  const data = useCart();
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState('');
  const [currPrice, setCurrPrice] = useState(parseInt(props.foodItem.price));
  const [available, setAvailable] = useState(parseInt(props.foodItem.qty));
  const [quantityToAdd, setQuantityToAdd] = useState('0');

  const handleAddToCart = async () => {
    let food = {};
    for (const item of data) {
      if (item.id === props.foodItem._id) {
        food = item;
        break;
      }
    }
    //console.log(food);
    if (food.size) {
      if (food.size === size) {
        await dispatch({
          type: 'UPDATE',
          id: props.foodItem._id,
          price: qty * currPrice,
          qty: qty,
        });
        return;
      } else if (food.size !== size) {
        await dispatch({
          type: 'ADD',
          id: props.foodItem._id,
          name: props.foodItem.name,
          price: qty * currPrice,
          qty: qty,
        });
        return;
      }
    }
    await dispatch({
      type: 'ADD',
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: qty * currPrice,
      qty: qty,
    });
  };

  const increaseQuantity = async (e) => {
    e.preventDefault();
    const currQuantity = parseInt(quantityToAdd) + available;
    const data = {
      item: props.foodItem.name,
      quantity: currQuantity.toString(),
    };
    const response = await fetch('http://localhost:5000/quantity/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();

    if (!json.success) {
      alert('Error occurred!');
    }
    if (json.success) {
      alert('Quantity Changed');
      setQuantityToAdd('0');
      setAvailable(currQuantity);
    }
  };

  const setNewPrice = async (e) => {
    e.preventDefault();
    const data = { item: props.foodItem.name, newprice: price };
    const response = await fetch('http://localhost:5000/price/change', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();

    if (!json.success) {
      alert('Error occurred!');
    }
    if (json.success) {
      alert('Price Changed');
      setCurrPrice(parseInt(price));
    }
  };
  return (
    <div
      className="card mt-3 bg-dark text-white"
      style={{ width: '100%', maxHeight: '700px' }}
    >
      <img
        className="card-img-top"
        src={props.foodItem.img}
        alt="Card image cap"
        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{props.foodItem.name}</h5>
        <div className="container w-100">
          {localStorage.getItem('role') === 'Sales' && (
            <select
              className="m-2 h-100 bg-success rounded"
              onChange={(e) => setQty(e.target.value)}
            >
              {Array.from({ length: available }, (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          )}
          <div>{props.foodItem.type}</div>
          <div>Available: {available}</div>
          <div className="d-inline h-100 fs-5">Rs {qty * currPrice}</div>
          {localStorage.getItem('role') === 'Manager' && (
            <form className="mt-2">
              <div className="input-group">
                <div className="w-5">
                  <input
                    id="newprice"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                    placeholder="Price"
                  />
                </div>
                <button
                  className="btn btn-outline-success"
                  type="button"
                  onClick={setNewPrice}
                >
                  Change Price
                </button>
              </div>
            </form>
          )}
          {localStorage.getItem('role') === 'Sales' && (
            <button
              className="btn btn-success justify-center mt-2"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
          {localStorage.getItem('role') === 'Manager' && (
            <div className="mt-2">
              <form onSubmit={increaseQuantity}>
                <div className="input-group">
                  <input
                    type="number"
                    value={quantityToAdd}
                    onChange={(e) => setQuantityToAdd(e.target.value)}
                    className="form-control"
                    placeholder="No"
                  />
                  <button className="btn btn-outline-primary" type="submit">
                    Increase Quantity
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
