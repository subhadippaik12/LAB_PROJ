import React, { useState } from 'react';

import { useCart, useDispatchCart } from '../components/ContextReducer';
import { useNavigate } from 'react-router-dom';
import Path from '../Path';
export default function Cart() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [mobileno, setMobileNo] = useState('');
  let data = useCart();
  let dispatch = useDispatchCart();
  if (data.length === 0) {
    return (
      <div>
        <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>
      </div>
    );
  }
  const totalPrice = data.reduce(
    (total, food) => total + parseInt(food.price),
    0
  );
  const handleCheckOut = async () => {
    if (role === 'Sales' && mobileno.length != 10) {
      alert('enter valid mobile no');
      return;
    }
    const userEmail = localStorage.getItem('userEmail');
    const url =
    Path.api_path+'/' +
      (role === 'Sales' ? 'order' : 'supply') +
      '/orderData';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        mobileno,
        order_price: totalPrice.toString(),
        order_data: data,
        order_date: new Date().toDateString(),
      }),
    });
    //console.log('Order Response: ', res);
    if (res.status === 200) {
      dispatch({ type: 'DROP' });
      if (role === 'Sales') {
        navigate('/myOrder');
      } else {
        navigate('/mySupplies');
      }
    }
  };
  return (
    <div>
      <div className="container bg-dark m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
  <div className="d-flex flex-column justify-content-center align-items-center"> {/* Centering container */}
    <table className="table table-hover ">
      <thead className=" fs-4">
        <tr>
          <th style={{ color: 'white' }}scope="col">#</th>
          <th style={{ color: 'white' }}scope="col">Name</th>
          <th style={{ color: 'white' }}scope="col">Quantity</th>
          <th style={{ color: 'white' }}scope="col">Unit</th>
          <th style={{ color: 'white' }}scope="col">Amount</th>
          <th style={{ color: 'white' }}scope="col"></th>
        </tr>
      </thead>
      <tbody>
        
        {data.map((food, index) => (
          
          <tr key={index} className="text-white">
           
            <th scope="row" className="text-white">
              {index + 1}
            </th>
            <td style={{ color: 'white' }}>{food.name}</td>
            <td style={{ color: 'white' }}>{food.qty}</td>
            <td style={{ color: 'white' }}>{food.type}</td>
            <td style={{ color: 'white' }}>{food.price}</td>
            <td>
            <button
  type="button"
  className="btn btn-danger btn-sm p-1"
  onClick={() => {
    dispatch({ type: 'REMOVE', index: index });
  }}
>
  Delete
</button>{' '}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div>
      <h1 className="fs-2">Total Price: {totalPrice}/-</h1>
    </div>
    {role === 'Sales' && (
      <div>
        <div className="d-flex flex-column align-items-center"> {/* Centering form elements */}
          <div>
            <label htmlFor="name">Enter name: </label>
            <input
              id="name"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="mobile">Enter PH No: </label>
            <input
              id="mobile"
              type="text"
              onChange={(e) => setMobileNo(e.target.value)}
            />
          </div>
        </div>
      </div>
    )}
    <div>
      <button className="btn bg-success mt-5 " onClick={handleCheckOut}>
        {' '}
        {role === 'Sales' ? 'Check out' : 'Get supplies'}
      </button>
    </div>
  </div>
</div>


    </div>
  );
}
