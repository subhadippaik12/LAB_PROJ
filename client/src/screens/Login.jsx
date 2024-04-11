import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Path from '../Path';
import Navbar from '../components/Navbar';
export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [passwordType, setpasswordType] = useState(true);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(Path.api_path+'/log/loginuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    //console.log(json);

    if (!json.success) {
      alert('Incorrect credentials!');
    }
    if (json.success) {
      localStorage.setItem('authToken', json.authToken);
      localStorage.setItem('userEmail', credentials.email);
      localStorage.setItem('role', json.role);
      navigate('/');
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
    <Navbar />
    <div className="container">
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={credentials.email}
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={onChange}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <div className="input-group">
            <input
              type={passwordType ? 'password' : 'text'}
              className="form-control"
              name="password"
              value={credentials.password}
              id="exampleInputPassword1"
              onChange={onChange}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setpasswordType(!passwordType)}
            >
              {passwordType ? 'Show' : 'Hide'}
            </button>
          </div>
        </div>
  
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  </>
  
  );
}
