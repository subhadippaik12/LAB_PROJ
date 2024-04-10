import React, { useState } from 'react';
import trash from '../trash.svg';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { useNavigate } from 'react-router-dom';

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
      'http://localhost:5000/' +
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
      <div className="container bg-secondary m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
        <table className="table table-hover ">
          <thead className=" fs-4">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Unit</th>
              <th scope="col">Amount</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index} className="text-white">
                <th scope="row" className="text-white">
                  {index + 1}
                </th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.type}</td>
                <td>{food.price}</td>
                <td>
                  <button type="button" className="btn p-0">
                    <img
                      src={trash}
                      alt="delete"
                      width="20em"
                      height="20em"
                      onClick={() => {
                        dispatch({ type: 'REMOVE', index: index });
                      }}
                    />
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
            <div>
              <label htmlFor="name">Enter name: </label>
              <input
                id="name"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="mobile">Enter phno: </label>
              <input
                id="mobile"
                type="text"
                onChange={(e) => setMobileNo(e.target.value)}
              ></input>
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
  );
}
