import React, { useState } from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Path from '../Path';
import 'jspdf-autotable';

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

  const totalPrice = data.reduce((total, food) => total + parseInt(food.price), 0);

  const handleCheckOut = async () => {
    if (role === 'Sales' && mobileno.length !== 10) {
      alert('Please enter a valid mobile number.');
      return;
    }
    if(role === 'Sales' &&username.trim() === ''){
      alert('Enter valid name');
      return;
    }
    

    const userEmail = localStorage.getItem('userEmail');
    const url = Path.api_path + '/' + (role === 'Sales' ? 'order' : 'supply') + '/orderData';

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

    if (res.status === 200) {
      generatePDF();
      dispatch({ type: 'DROP' });
      if (role === 'Sales') {
        navigate('/myOrder');
      } else {
        navigate('/mySupplies');
      }
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add heading based on role
    const role = localStorage.getItem('role');
    const heading = role === 'Sales' ? 'ABCD Supermarket - Sales' : 'ABCD Supermarket - Orders';
    doc.setFontSize(20);
    doc.text(heading, 10, 10);
  
    // Add current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 10, 20);
    doc.text(`Time: ${formattedTime}`, 10, 30);
  
    // Define columns for the table
    const columns = ['#', 'Name', 'Quantity', 'Unit', 'Amount'];
  
    // Define rows data
    const rows = data.map((food, index) => [
      index + 1,
      food.name,
      food.qty,
      food.type,
      `${food.price}/-`,
    ]);
  
    // Add headers and rows to the table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 40, // Start Y position below the heading and date/time
      theme: 'grid',
      styles: {
        textColor: [0, 0, 0], // Text color (R, G, B)
        lineColor: [0, 0, 0], // Line color for borders (R, G, B)
        lineWidth: 0.1, // Line width for borders
        fontStyle: 'normal', // Font style: 'normal', 'bold', 'italic', 'bolditalic'
        fontSize: 10, // Font size in points
        cellPadding: 2, // Padding for all cells
        rowHeight: 10, // Height of each row
      },
    });
  
    // Add name and phone number if role is Sales
    if (role === 'Sales') {
      
      doc.text(`Name: ${username}`, 10, doc.previousAutoTable.finalY + 10);
      doc.text(`Phone Number: ${mobileno}`, 10, doc.previousAutoTable.finalY + 20);
    }
  
    // Save the PDF
    doc.save('orders.pdf');
  };
  return (
    <div>
      <div className="container bg-dark m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <table className="table table-hover">
            <thead className=" fs-4">
              <tr>
                <th style={{ color: 'white' }} scope="col">#</th>
                <th style={{ color: 'white' }} scope="col">Name</th>
                <th style={{ color: 'white' }} scope="col">Quantity</th>
                <th style={{ color: 'white' }} scope="col">Unit</th>
                <th style={{ color: 'white' }} scope="col">Amount</th>
                <th style={{ color: 'white' }} scope="col"></th>
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
              <div className="d-flex flex-column align-items-center">
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
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn bg-success mt-5" onClick={handleCheckOut}>
              {role === 'Sales' ? 'Check out' : 'Get supplies'}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
