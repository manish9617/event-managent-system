import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import "./Login.css"; // Import custom CSS for styling
import axios from "axios";

const Login = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Data:", formData);

    axios
      .post("http://127.0.0.1:8000/api/login/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status == 200) {
          localStorage.setItem("token", res.data.token);
          location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // You can perform further actions here, like sending the data to a server
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100 login-page"
    >
      <div className="login-container p-5">
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>User name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Form.Group>
          <center>
            <Button variant="primary" type="submit" className="mt-3 w-50" block>
              Login
            </Button>
          </center>
        </Form>
        <div className="mt-3">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </Container>
  );
};

export default Login;
