import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Footer from '../components/Footer';

function OrderReport() {
  const [orders, setOrders] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [currOrders, setCurrOrders] = useState([]);
  const [currSupplies, setCurrSupplies] = useState([]);
  const [item, setItem] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('orders');

  const fetchMyOrder = async () => {
    const response = await fetch('http://localhost:5000/order/myOrderData', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const curr = [];
    data.orderData.forEach((el) => {
      el.items.forEach((item) => {
        curr.push({
          date: el.date,
          name: item.name,
          qty: item.qty,
          tot_item_cost: item.price,
          item_unit: item.type,
        });
      });
    });
    setOrders(curr);
    setCurrOrders(curr);
  };
  const fetchMySupply = async () => {
    const response = await fetch('http://localhost:5000/supply/myOrderData', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const curr = [];
    data.orderData.forEach((el) => {
      el.items.forEach((item) => {
        curr.push({
          date: el.date,
          name: item.name,
          qty: item.qty,
          tot_item_cost: item.price,
          item_unit: item.type,
        });
      });
    });
    setSupplies(curr);
    setCurrSupplies(curr);
  };

  useEffect(() => {
    fetchMyOrder();
    fetchMySupply();
  }, []);
  const setStart = (val) => {
    const st = val.split('-');
    const stD = st[1] + '-' + st[2] + '-' + st[0];
    setStartDate(stD);
  };
  const setEnd = (val) => {
    const st = val.split('-');
    const stD = st[1] + '-' + st[2] + '-' + st[0];
    setEndDate(stD);
  };
  useEffect(() => {
    setCurrOrders(
      orders.filter((it) => {
        if (
          startDate.length > 0 &&
          Date.parse(startDate) > Date.parse(it.date)
        ) {
          return false;
        }

        if (endDate.length > 0 && Date.parse(endDate) < Date.parse(it.date)) {
          return false;
        }

        if (
          item.length > 0 &&
          !it.name.toLowerCase().startsWith(item.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
    );
    setCurrSupplies(
      supplies.filter((it) => {
        if (
          startDate.length > 0 &&
          Date.parse(startDate) > Date.parse(it.date)
        ) {
          return false;
        }

        if (endDate.length > 0 && Date.parse(endDate) < Date.parse(it.date)) {
          return false;
        }

        if (
          item.length > 0 &&
          !it.name.toLowerCase().startsWith(item.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
    );
  }, [startDate, endDate, item]);

  const orderCost = currOrders.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.tot_item_cost);
  }, 0);
  const supplyCost = currSupplies.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.tot_item_cost);
  }, 0);

  const orderqty = currOrders.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.qty);
  }, 0);
  const supplyqty = currSupplies.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.qty);
  }, 0);

  const handleDownload = () => {
    const doc = new jsPDF();

    // Define headers and filters
    const headers = [];
    if (type === 'orders') {
      headers.push(
        'Order Report',
        `Total Income: ${orderCost}`,
        `Total Quantities Sold: ${orderqty}`,
        'Filters: '
      );
    } else {
      headers.push(
        'Supplies Report',
        `Total Expenditure: ${supplyCost}`,
        `Total Quantity Bought: ${supplyqty}`,
        'Filters: '
      );
    }
    const filters = [
      `Start Date: ${startDate || 'N/A'}`,
      `End Date: ${endDate || 'N/A'}`,
      `Item: ${item || 'N/A'}`,
      `Type: ${type}`,
    ];

    // Add headers
    doc.setFontSize(20);
    doc.text(headers[0], 10, 20); // Order Report
    doc.setFontSize(15);
    doc.text(headers[1], 10, 30); // Total Expenditure
    doc.text(headers[2], 10, 40); // Total Quantity

    // Add filters
    doc.text(headers[3], 10, 60); // Total Quantity
    doc.setFontSize(12);
    doc.text(filters.join(', '), 10, 65); // Filters

    // Define columns for the table
    const columns = ['#', 'Date', 'Name', 'Quantity', 'Unit', 'Amount'];

    // Define rows data
    if (type === 'orders') {
      const rows = currOrders.map((order, index) => [
        index + 1,
        order.date,
        order.name,
        order.qty,
        order.item_unit,
        order.tot_item_cost,
      ]);

      // Add the table to the PDF
      doc.autoTable({
        startY: 80, // Start table from Y position 140 (below the headers and filters)
        head: [columns],
        body: rows,
      });
    } else {
      const rows = currSupplies.map((order, index) => [
        index + 1,
        order.date,
        order.name,
        order.qty,
        order.item_unit,
        order.tot_item_cost,
      ]);

      // Add the table to the PDF
      doc.autoTable({
        startY: 80, // Start table from Y position 140 (below the headers and filters)
        head: [columns],
        body: rows,
      });
    }

    // Save the PDF
    doc.save('order_report.pdf');
  };

  return (
    <div>
      <div>
        <Navbar></Navbar>
      </div>
      {type === 'orders' && (
        <div className="text-center display-6">
          <div className="text-center mb-3">Order Reports</div>
          <div>Total Income: {orderCost}</div>
          <div>Total quantities sold: {orderqty}</div>
        </div>
      )}
      {type === 'supplies' && (
        <div className="text-center display-6">
          <div className="text-center mb-3">Supplies Reports</div>
          <div>Total Expenditure: {supplyCost}</div>
          <div>Total quantities bought: {supplyqty}</div>
        </div>
      )}
      <button className="" onClick={handleDownload}>
        Download Report
      </button>
      <div className="mb-3 display-6">Filters: </div>
      <div className="d-flex justify-content-around">
        <label htmlFor="start">Enter Start Date: </label>
        <label htmlFor="end">Enter End Date: </label>
        <label htmlFor="item">Enter Item: </label>
        <label htmlFor="type">Enter Type: </label>
      </div>
      <div className="d-flex justify-content-around">
        <input
          id="start"
          type="date"
          className="w-25"
          onChange={(e) => setStart(e.target.value)}
        ></input>
        <input
          id="end"
          type="date"
          className="w-25"
          onChange={(e) => setEnd(e.target.value)}
        ></input>
        <input
          id="item"
          type="text"
          className="w-25"
          onChange={(e) => setItem(e.target.value)}
        ></input>
        <select
          id="type"
          className="w-25"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="orders">orders</option>
          <option value="supplies">supplies</option>
        </select>
      </div>

      {type === 'orders' && (
        <div className="my-2 bg-light text-dark">
          <table className="table table-hover ">
            <thead className=" fs-4">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Unit</th>
                <th scope="col">Amount</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {currOrders.map((el, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{el.date}</td>
                  <td>{el.name}</td>
                  <td>{el.qty}</td>
                  <td>{el.item_unit}</td>
                  <td>{el.tot_item_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {type === 'supplies' && (
        <div className="my-2 bg-light text-dark">
          <table className="table table-hover ">
            <thead className=" fs-4">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Unit</th>
                <th scope="col">Amount</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {currSupplies.map((el, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{el.date}</td>
                  <td>{el.name}</td>
                  <td>{el.qty}</td>
                  <td>{el.item_unit}</td>
                  <td>{el.tot_item_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default OrderReport;
