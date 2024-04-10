import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
  const role = localStorage.getItem('role');
  const priceRef = useRef();
  const dispatch = useDispatchCart();
  const data = useCart();
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [supp, setSupp] = useState(parseInt(props.foodItem.suprice));
  const [currPrice, setCurrPrice] = useState(parseInt(props.foodItem.price));
  const [available, setAvailable] = useState(parseInt(props.foodItem.qty));
  const [quantityToAdd, setQuantityToAdd] = useState(0);

  const handleAddToCart = async () => {
    let food = {};
    for (const item of data) {
      if (item.id === props.foodItem._id) {
        food = item;
        break;
      }
    }
    if (food.id) {
      await dispatch({
        type: 'UPDATE',
        id: props.foodItem._id,
        price: (qty * currPrice).toString(),
        qty: qty.toString(),
        unit: props.foodItem.type,
      });
      return;
    }

    await dispatch({
      type: 'ADD',
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: (qty * currPrice).toString(),
      qty: qty.toString(),
      unit: props.foodItem.type,
    });
  };

  const increaseQuantity = async (e) => {
    e.preventDefault();
    const currQuantity = quantityToAdd + available;
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
      setQuantityToAdd(0);
      setAvailable(currQuantity);
    }
  };

  const setNewPrice = async (e) => {
    e.preventDefault();
    const data = {
      role,
      item: props.foodItem.name,
      newprice: price.toString(),
    };
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
      if (role === 'Manager') {
        setCurrPrice(price);
      } else {
        setSupp(price);
      }
      setPrice(0);
    }
  };

  const deleteItem = async () => {
    // Implement delete item logic here
    try {
      const response = await fetch(`http://localhost:5000/deleteItem/${props.foodItem._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the item from UI or refetch data
        alert('Item deleted');
        props.onDelete(props.foodItem._id);
        
      } else {
        console.error('Failed to delete item');
        alert('Item is not deleted');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="card mt-3 bg-dark text-white" style={{ width: '100%' }}>
      <img
        className="card-img-top"
        src={props.foodItem.img}
        alt="Card image cap"
        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="text-center card-title fw-bold">
          {props.foodItem.name}
        </h5>
        <div className="container w-100">
          <div className="h-100 fs-5">Unit: {props.foodItem.type}</div>
          {role === 'Sales' && (
            <div>
              <label htmlFor="amt">Qty Req :</label>
              <input
                defaultValue="1"
                id="amt"
                min="0"
                max={available}
                type="number"
                onChange={(e) => setQty(e.target.value)}
              ></input>
            </div>
          )}
          {role === 'Employee' && (
            <div>
              <label htmlFor="amt">Qty Req :</label>
              <input
                defaultValue="1"
                id="amt"
                min="0"
                type="number"
                onChange={(e) => setQty(e.target.value)}
              ></input>
            </div>
          )}
          <div className="h-100 fs-5">Available: {available}</div>
          {role !== 'Employee' && (
            <div className="h-100 fs-5">Sales price: Rs {qty * currPrice}</div>
          )}
          {role !== 'Sales' && (
            <div className="h-100 fs-5">Supplier Price: Rs {qty * supp}</div>
          )}
          {role !== 'Sales' && (
            <div className="input-group mt-3">
              <input
                id="newprice"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control"
                placeholder="Price"
              />
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={setNewPrice}
              >
                {role === 'Manager'
                  ? 'Change Per Unit Sales Price'
                  : 'Change Per Unit Supplier Price'}
              </button>
            </div>
          )}
          {role !== 'Manager' && (
            <div className="mt-3">
              <button
                className="btn btn-success"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          )}
          {role === 'Manager'&&
          <div className="mt-3">
            <button
              className="btn btn-danger"
              onClick={deleteItem}
            >
              Delete
            </button>
          </div>
          }
        </div>
      </div>
    </div>
  );
}
