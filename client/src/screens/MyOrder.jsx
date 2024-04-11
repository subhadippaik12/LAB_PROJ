import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Path from '../Path';
export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fetchMyOrder = async () => {
    //console.log(userEmail);
    const response = await fetch(Path.api_path+'/order/myOrderData', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setOrderData(data);
  };
  const filteredOrderData = orderData.orderData
  ? orderData.orderData.filter((data) => {
      return data.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
  : [];

  useEffect(() => {
    fetchMyOrder();
  }, []);
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="display-6 text-center mb-3">Orders Received:</div>
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredOrderData.length > 0 ? (
            filteredOrderData.reverse().map((data, k) => (
              <div
                key={k}
                className="col-md-6 my-2"
                style={{
                  backgroundColor: '#212529',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  width: '100%',
                }}
              >
                <div style={{ color: 'white' }}>Name: {data.name}</div>
                <div style={{ color: 'white' }}>Mobile no: {data.mobileno}</div>
                <div style={{ color: 'white' }}>Date: {data.date}</div>
                <div style={{ color: 'white' }}>Total Price: {data.totprice}</div>
                <div>
                  <table
                    className="table table-hover"
                    style={{ width: '100%', marginTop: '10px', backgroundColor: '#212529'  }}
                  >
                    <thead className="fs-4">
                      <tr>
                        <th scope="col" style={{ color: 'white' }}>
                          #
                        </th>
                        <th scope="col" style={{ color: 'white' }}>
                          Name
                        </th>
                        <th scope="col" style={{ color: 'white' }}>
                          Quantity
                        </th>
                        <th scope="col" style={{ color: 'white' }}>
                          Unit
                        </th>
                        <th scope="col" style={{ color: 'white' }}>
                          Amount
                        </th>
                        <th scope="col" style={{ color: 'white' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((food, index) => (
                        <tr key={index}>
                          <th scope="row" style={{ color: 'white' }}>
                            {index + 1}
                          </th>
                          <td style={{ color: 'white' }}>{food.name}</td>
                          <td style={{ color: 'white' }}>{food.qty}</td>
                          <td style={{ color: 'white' }}>{food.type}</td>
                          <td style={{ color: 'white' }}>{food.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No orders found.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
