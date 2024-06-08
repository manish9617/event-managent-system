import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import "./Login.css"; // Import custom CSS for styling
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  // State to store form data
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });
  const usernameRef = useRef("");
  const passwordRef = useRef("");

  // Handle form input changes
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Data:", formData);
    const formData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    console.log(formData);
    axios
      .post("http://127.0.0.1:8000/api/login/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          localStorage.setItem("token", res.data.token);
          location.href = "/";
        } else if (res.status == 204) {
          usernameRef.current.value = "";
          passwordRef.current.value = "";
          toast.error("Invalid credentials");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
              ref={usernameRef}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              ref={passwordRef}
              type="password"
              placeholder="Password"
              name="password"
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
