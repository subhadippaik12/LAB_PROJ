import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Footer from '../components/Footer';
import Path from '../Path';
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
    const response = await fetch(Path.api_path+'/order/myOrderData', {
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
    const response = await fetch(Path.api_path+'/supply/myOrderData', {
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
      const textWidth = doc.getStringUnitWidth(item) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const xOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(item, xOffset, i); 
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
        theme: 'grid',
        styles: {
          valign: 'middle',
          halign: 'center',
        }
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
        theme: 'grid',
        styles: {
          valign: 'middle',
          halign: 'center',
        }
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
      {type === 'total' && (
  <div style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '1.5rem' }}>Total Report</div>
)}
{type !== 'supplies' && (
  <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>
    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>Order Reports</div>
    <div>Total Income: {orderCost}</div>
    <div>Total quantities sold: {orderqty}</div>
  </div>
)}
{type !== 'orders' && (
  <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>
    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>Supplies Reports</div>
    <div>Total Expenditure: {supplyCost}</div>
    <div>Total quantities bought: {supplyqty}</div>
  </div>
)}
{type === 'total' && (
  <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>
    {orderCost - supplyCost >= 0 ? `Profit: ${orderCost - supplyCost}` : `Loss: ${supplyCost - orderCost}`}
  </div>
)}

<div style={{ display: 'flex', justifyContent: 'space-around', width:'100%'}}>
  <label htmlFor="start">Enter Start Date: </label>
  <label htmlFor="end">Enter End Date: </label>
  <label htmlFor="item">Enter Item: </label>
  <label htmlFor="type">Enter Type: </label>
</div>
<div style={{ display: 'flex', justifyContent: 'space-around',width:'100%' }}>
  <input
    id="start"
    type="date"
    style={{ width: '17%', padding: '0.5rem' }}
    onChange={(e) => setStart(e.target.value)}
  />
  <input
    id="end"
    type="date"
    style={{ width: '17%', padding: '0.5rem' }}
    onChange={(e) => setEnd(e.target.value)}
  />
  <input
    id="item"
    type="text"
    style={{ width: '17%', padding: '0.5rem' }}
    onChange={(e) => setItem(e.target.value)}
  />
  <select
    id="type"
    style={{ width: '17%', padding: '0.5rem' }}
    onChange={(e) => setType(e.target.value)}
  >
    <option value="total">total</option>
    <option value="orders">orders</option>
    <option value="supplies">supplies</option>
  </select>
</div>

{type !== 'supplies' && (
  <div style={{ marginBottom: '1.5rem', backgroundColor: '#343a40', color: '#fff', padding: '0.5rem', width: '90%', margin: '0 auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        <tr>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">#</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Date</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Name</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Quantity</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Unit</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Amount</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Type</th>
        </tr>
      </thead>
      <tbody>
        {currOrders.map((el, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{index + 1}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.date}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.name}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.qty}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.item_unit}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.tot_item_cost}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>Ordered</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{type !== 'orders' && (
  <div style={{ marginBottom: '1.5rem', backgroundColor: '#343a40', color: '#fff', padding: '0.5rem', width: '90%', margin: '0 auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        <tr>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">#</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Date</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Name</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Quantity</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Unit</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Amount</th>
          <th style={{ border: '1px solid #dee2e6', padding: '0.5rem', backgroundColor: '#212529' }} scope="col">Type</th>
        </tr>
      </thead>
      <tbody>
        {currSupplies.map((el, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{index + 1}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.date}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.name}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.qty}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.item_unit}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>{el.tot_item_cost}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>Supplied</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

<div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
  <button style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }} onClick={handleDownload}>
    Download Report
  </button>
</div>
      <div>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default OrderReport;
