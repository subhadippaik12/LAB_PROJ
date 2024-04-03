import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
  const priceRef = useRef();
  const dispatch = useDispatchCart();
  const data = useCart();
  const options = props.options;
  const priceOptions = Object.keys(options);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  const [price, setPrice] = useState(options[size] ? options[size][0] : '0');
  const [available, setAvailable] = useState(options[size] ? parseInt(options[size][1]) : 0);
  const [quantityToAdd, setQuantityToAdd] = useState('0');

  const handleAddToCart = async () => {
    let food = {};
    for (const item of data) {
      if (item.id === props.foodItem._id) {
        food = item;
        break;
      }
    }
    if (food.size) {
      if (food.size === size) {
        await dispatch({
          type: 'UPDATE',
          id: props.foodItem._id,
          price: finalPrice,
          qty: qty,
        });
        return;
      } else if (food.size !== size) {
        await dispatch({
          type: 'ADD',
          id: props.foodItem._id,
          name: props.foodItem.name,
          price: finalPrice,
          qty: qty,
          size: size,
        });
        return;
      }
    }
    await dispatch({
      type: 'ADD',
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: finalPrice,
      qty: qty,
      size: size,
    });
    // Increase the available quantity
    setAvailable(prevAvailable => prevAvailable + parseInt(qty));
  };

  const increaseQuantity = async (e) => {
    e.preventDefault();
    const data = { item: props.foodItem.name, opt: size, quantity: parseInt(quantityToAdd) };
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
      options[size][1] += parseInt(quantityToAdd);
      setQuantityToAdd('0');
      setAvailable(prevAvailable => prevAvailable + parseInt(quantityToAdd));
    }
  };

  const finalPrice = qty * parseInt(options[size] ? options[size][0] : '0');

  useEffect(() => {
    setSize(priceRef.current.value);
    setAvailable(options[size] ? parseInt(options[size][1]) : 0);
    setPrice(options[size] ? options[size][0] : '0');
  }, [size, options]);

  const setNewPrice = async (e) => {
    e.preventDefault();
    const data = { item: props.foodItem.name, opt: size, newprice: price };
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
      options[size][0] = price;
    }
  };

  return (
    <div className="card mt-3 bg-dark text-white" style={{ width: '100%', maxHeight: '500px' }}>
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
            <select className="m-2 h-100 bg-success rounded" onChange={(e) => setQty(e.target.value)}>
              {Array.from({ length: available }, (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          )}
          <select className="m-2 h-100 bg-success rounded" ref={priceRef} onChange={(e) => setSize(e.target.value)}>
            {priceOptions.map((data) => (
              <option key={data} value={data}>
                {data}
              </option>
            ))}
          </select>
          <div>Available: {available}</div>
          <div className="d-inline h-100 fs-5">Rs {finalPrice}</div>
          {localStorage.getItem('role') === 'Manager' && (
            <form className="mt-2">
              <div className="input-group">
                <input
                  id="newprice"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-control"
                  placeholder="Price"
                />
                <button className="btn btn-outline-success" type="button" onClick={setNewPrice}>
                  Change Price
                </button>
              </div>
            </form>
          )}
          {localStorage.getItem('role') === 'Sales' && (
            <button className="btn btn-success justify-center mt-2" onClick={handleAddToCart}>
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
