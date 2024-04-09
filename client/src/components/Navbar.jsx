import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useCart, useDispatchCart } from './ContextReducer';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function BasicNavbar() {
  const [cartView, setCartView] = useState(false);
  const navigate = useNavigate();
  let dispatch = useDispatchCart();
  const data = useCart();
  const handleLogout = (e) => {
    dispatch({ type: 'DROP' });
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    navigate('/login');
  };
  return (
    <Navbar expand="lg" className="bg-success">
      <Container className="">
        <Navbar.Brand className="fs-3" href="/">
          ABCD Supermarket
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <ul className="navbar-nav me-auto mb-2 ">
            <li className="nav-item active">
              <Link className="nav-link active fs-5" to="/">
                Home
              </Link>
            </li>
            {localStorage.getItem('authToken') &&
            localStorage.getItem('role') === 'Manager' ? (
              <li className="nav-item active">
                <Link className="nav-link active fs-5" to="/OrderReport">
                  Reports
                </Link>
              </li>
            ) : (
              ''
            )}
            {localStorage.getItem('authToken') &&
            localStorage.getItem('role') === 'Sales' ? (
              <li className="nav-item active">
                <Link className="nav-link active fs-5" to="/myOrder">
                  My Orders
                </Link>
              </li>
            ) : (
              ''
            )}
            {localStorage.getItem('authToken') &&
            localStorage.getItem('role') === 'Employee' ? (
              <li className="nav-item active">
                <Link className="nav-link active fs-5" to="/mySupplies">
                  My Supplies
                </Link>
              </li>
            ) : (
              ''
            )}
          </ul>
          <div className="d-flex">
            {!localStorage.getItem('authToken') ? (
              <div>
                <Link className="btn bg-white text-success mx-1" to="/login">
                  Login
                </Link>
              </div>
            ) : (
              <div>
                {localStorage.getItem('role') !== 'Manager' ? (
                  <div
                    className="btn bg-white text-success mx-2"
                    onClick={() => {
                      setCartView(true);
                    }}
                  >
                    My Cart{' '}
                    <Badge pill bg="danger">
                      {data.length}
                    </Badge>
                  </div>
                ) : (
                  ''
                )}
                {cartView ? (
                  <Modal onClose={() => setCartView(false)}>
                    <Cart></Cart>
                  </Modal>
                ) : null}
                <div
                  className="btn bg-white text-danger mx-2"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
