import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function OrderReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState([]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fetch orders between start and end dates
    try {
      const response = await fetch(`http://localhost:5000/orders?start=${startDate}&end=${endDate}`);
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Calculate total items and percentage of items
  const totalItems = orders.reduce((total, order) => total + order.items.length, 0);
  const percentageOfItems = ((totalItems / orders.length) * 100).toFixed(2);

  return (
    <>
      <div >
        <Navbar />
      </div>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <h1 style={{ margin: '0' }}>Report</h1>
      </div>
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <form onSubmit={handleSubmit} style={{ display: 'inline-block' }}>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ margin: '0 10px' }}
          />
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{ margin: '0 10px' }}
          />
          <div style={{ margin: '10px 0' }}>
            <button className="btn btn-outline-success" type="submit">Submit</button>
          </div>
        </form>
      </div>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <h2>Orders between {startDate} and {endDate}:</h2>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {orders.map((order, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              Order ID: {order.id}, Items: {order.items.length}
            </li>
          ))}
        </ul>
        <h2>Total Items: {totalItems}</h2>
        <h2>Percentage of Items: {percentageOfItems}%</h2>
      </div>
    </>
  );
}

export default OrderReport;
