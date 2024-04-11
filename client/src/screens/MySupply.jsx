import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Path from '../Path';
export default function MySupply() {
  const [orderData, setOrderData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMyOrder = async () => {
    const response = await fetch(Path.api_path+'/supply/myOrderData', {
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
      <Navbar />
      <div className="display-6 text-center mb-3">Supplies ordered: </div>
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {orderData.orderData
            ? orderData.orderData.reverse().map((data, k) => {
                // Filter food items based on search term
                const filteredItems = data.items.filter(food =>
                  food.name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                // Render only if there are filtered items
                if (filteredItems.length > 0) {
                  return (
                    <div key={k} className="col-md-6 my-2"
                      style={{
                        backgroundColor: '#212529',
                        color: 'white',
                        padding: '15px',
                        borderRadius: '8px',
                        width: '100%',
                      }}>
                      <div>Date: {data.date}</div>
                      <div>Total Price: {data.totprice}</div>
                      <div>
                        <table className="table table-hover ">
                          <thead className=" fs-4">
                            <tr>
                              <th scope="col" style={{ color: 'white' }}>#</th>
                              <th scope="col" style={{ color: 'white' }}>Name</th>
                              <th scope="col" style={{ color: 'white' }}>Quantity</th>
                              <th scope="col" style={{ color: 'white' }}>Unit</th>
                              <th scope="col" style={{ color: 'white' }}>Amount</th>
                              <th scope="col" style={{ color: 'white' }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredItems.map((food, index) => (
                              <tr key={index}>
                                <th scope="row" style={{ color: 'white' }}>{index + 1}</th>
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
                  );
                } else {
                  return null; // If no filtered items, don't render anything
                }
              })
            : ''}
        </div>
      </div>
      <Footer />
    </div>
  );
}
