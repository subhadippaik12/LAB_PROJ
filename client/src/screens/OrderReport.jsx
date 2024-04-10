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
  const [type, setType] = useState('total');

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
    if(type==='total'){
      headers.push('Total Report');
    }
    if (type !== 'supplies') {
      headers.push(
        'Order Report',
        `Total Income: ${orderCost}`,
        `Total Quantities Sold: ${orderqty}`,
      );
    } 
    if(type!='orders'){
      headers.push(
        'Supplies Report',
        `Total Expenditure: ${supplyCost}`,
        `Total Quantity Bought: ${supplyqty}`,
      );
    }
    if(type==='total'){
      headers.push(orderCost-supplyCost>=0 ? `Profit: ${orderCost-supplyCost}`: `Loss: ${supplyCost-orderCost}`);
    }

    const filters = [
      `Start Date: ${(startDate.length>0 && startDate[0]!=='u')?startDate:'N/A'}`,
      `End Date: ${(endDate.length>0 && endDate[0]!=='u')?endDate:'N/A'}`,
      `Item: ${item || 'N/A'}`,
      `Type: ${type}`,
    ];

    // Add headers
    doc.setFontSize(20);
    let i=20;
    headers.forEach((item, ind)=>{
      doc.text(item, 10, i); 
      i= i+10;
      if(ind==0){
        doc.setFontSize(15);
      }
    })

    doc.setFontSize(12);
    doc.text('Filters', 10, i+10);
    doc.text(filters.join(', '), 10, i+15); // Filters

    // Define columns for the table
    const columns = ['#', 'Date', 'Name', 'Quantity', 'Unit', 'Amount', 'Type'];
    const rows=[];
    // Define rows data
    if (type !== 'supplies') {
      currOrders.forEach((order, index) => rows.push([
        index + 1,
        order.date,
        order.name,
        order.qty,
        order.item_unit,
        order.tot_item_cost,
        'Ordered',
      ]));

      // Add the table to the PDF
      doc.autoTable({
        startY: i+30, // Start table from Y position 140 (below the headers and filters)
        head: [columns],
        body: rows,
      });
    } 
    
    if(type!=='orders'){
      currSupplies.forEach((order, index) => rows.push([
        index + 1,
        order.date,
        order.name,
        order.qty,
        order.item_unit,
        order.tot_item_cost,
        'Supplied',
      ]));

      // Add the table to the PDF
      doc.autoTable({
        startY: i+30, // Start table from Y position 140 (below the headers and filters)
        head: [columns],
        body: rows,
      });
    }

    // Save the PDF
    doc.save('order_report.pdf');
  };
  //console.log(currOrders);
  return (
    <div>
      <div>
        <Navbar></Navbar>
      </div>
      {type==='total' && (
        <div className="text-center display-6 my-3">Total Report</div>
      )}
      {type !== 'supplies' && (
        <div className="text-center display-6">
          <div className="text-center my-3">Order Reports</div>
          <div>Total Income: {orderCost}</div>
          <div>Total quantities sold: {orderqty}</div>
        </div>
      )}
      {type !== 'orders' && (
        <div className="text-center display-6">
          <div className="text-center my-3">Supplies Reports</div>
          <div>Total Expenditure: {supplyCost}</div>
          <div>Total quantities bought: {supplyqty}</div>
        </div>
      )}
      {type === 'total' && (
        <div className="text-center display-6">
          {orderCost-supplyCost>=0 ? `Profit: ${orderCost-supplyCost}`: `Loss: ${supplyCost-orderCost}`}
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
          <option value="total">total</option>
          <option value="orders">orders</option>
          <option value="supplies">supplies</option>
        </select>
      </div>

      {type !== 'supplies' && (
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
                <th scope="col">Type</th>
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
                  <td>Ordered</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {type !== 'orders' && (
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
                <th scope="col">Type</th>
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
                  <td>Supplied</td>
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
