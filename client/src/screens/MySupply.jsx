import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
export default function MySupply() {
  const [orderData, setOrderData] = useState([]);
  const fetchMyOrder = async () => {
    //console.log(userEmail);
    const response = await fetch('http://localhost:5000/supply/myOrderData', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setOrderData(data);
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="display-6 ms-3 mb-3">Supplies ordered: </div>
      <div className="container">
        <div className="row">
          {orderData.orderData
            ? orderData.orderData.reverse().map((data, k) => {
                return (
                  <div key={k} className="my-2 bg-light text-dark">
                    <div>Date: {data.date}</div>
                    <div>Total Price: {data.totprice}</div>
                    <div>
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
                          {data.items.map((food, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{food.name}</td>
                              <td>{food.qty}</td>
                              <td>{food.type}</td>
                              <td>{food.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            : ''}
        </div>
      </div>

      <Footer />
    </div>
  );
}
