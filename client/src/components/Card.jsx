import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';
import Path from '../Path';
export default function Card(props) {
  const role = localStorage.getItem('role');
  const priceRef = useRef();
  const dispatch = useDispatchCart();
  const data = useCart();
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const [supp, setSupp] = useState(parseInt(props.foodItem.suprice));
  const [currPrice, setCurrPrice] = useState(parseInt(props.foodItem.price));
  const [available, setAvailable] = useState(parseInt(props.foodItem.qty));

  const handleAddToCart = async () => {
    if (role !== 'Employee'&&qty > available) {
      alert('Requested quantity exceeds available quantity. Item is not available.');
      return; // Exit function
    }

    let food = {};
    for (const item of data) {
      if (item.id === props.foodItem._id) {
        food = item;
        break;
      }
    }
    let pr;
     if (role !== 'Employee') {
     pr = (qty * currPrice).toString();
    } else {
     pr= (qty * supp).toString();;
    }
    if (food.id) {
      
      await dispatch({
        type: 'UPDATE',
        id: props.foodItem._id,
        price: pr,
        qty: qty.toString(),
        unit: props.foodItem.type,
      });
      setQty(0);
      return;
    }

    await dispatch({
      type: 'ADD',
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: pr,
      qty: qty.toString(),
      unit: props.foodItem.type,
    });
    setQty(0);
    
  };

  const setNewPrice = async (e) => {
    if (price <= 0||price>100000000) {
      alert('enter valid price');
      return; // Exit function
    }
  
    e.preventDefault();
    const data = {
      role,
      item: props.foodItem.name,
      newprice: price.toString(),
    };
    const response = await fetch(Path.api_path+'/price/change', {
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
      
    }
  };

  const deleteItem = async () => {
    // Implement delete item logic here
    try {
      const response = await fetch(Path.api_path+
        `/deleteItem/${props.foodItem._id}`,
        {
          method: 'DELETE',
        }
      );
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
    <div className="card mt-3 bg-dark text-white" style={{ width: '100%', height: '100%', padding: '20px', borderRadius: '10px', position: 'relative' }}>
  {role === 'Manager'&&
  <button className="btn btn-danger btn-sm p-1" style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={deleteItem}>
    Delete
  </button>}
  <img
    className="card-img-top"
    src={props.foodItem.img}
    alt="Card image cap"
    style={{ maxHeight: '200px', width: '100%', objectFit: 'cover', borderRadius: '10px' }}
  />
  <div className="card-body">
    <h5 className="text-center card-title fw-bold">
      {props.foodItem.name}
    </h5>
    <div className="container w-100">
      <div className="h-100 fs-6">Unit: {props.foodItem.type}</div>
      {role === 'Sales' && (
        <div>
          <label htmlFor="amt">Qty Req :</label>
          <input
            value={qty}
            id="amt"
            min="0"
            max={available}
            type="number"
            onChange={(e) => setQty(e.target.value)}
            style={{ width: '50px', marginLeft: '10px' }}
          />
        </div>
      )}
      {role === 'Employee' && (
        <div>
          <label htmlFor="amt">Qty Req :</label>
          <input
            value={qty}
            id="amt"
            min="0"
            type="number"
            onChange={(e) => setQty(e.target.value)}
            style={{ width: '50px', marginLeft: '10px' }}
          />
        </div>
      )}
      <div className="h-100 fs-6">Available: {available}</div>
      {role !== 'Employee' && (<>
        <div className="h-100 fs-6">Sales unit price: Rs {currPrice}</div>
        </>
      )}
      {role === 'Sales' &&(<>
        <div className="h-100 fs-6">Total  price: Rs {qty * currPrice}</div>
        </>
      )}
      {(role === 'Manager' || role === 'Employee') && (
        <div className="h-100 fs-6">Supplier unit Price: Rs {supp}</div>
      )}
      {( role === 'Employee') && (
        <div className="h-100 fs-6">Total Price: Rs {qty * supp}</div>
      )}
      {(role === 'Manager' || role === 'Employee') && (
        <div className="input-group mt-3">
          <input
            id="newprice"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            placeholder="Price"
            style={{ width: '150px' }}
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
      {(role === 'Employee' || role === 'Sales') && (
        <div className="mt-3">
          <button className="btn btn-success" onClick={handleAddToCart}  disabled={qty <= 0}>
            Add to Cart
          </button>
        </div>
      )}
    </div>
  </div>
</div>

  );
}
