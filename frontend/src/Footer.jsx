import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Event Management System</h5>
            <p>A platform for managing and promoting events.</p>
          </Col>
          <Col md={3}></Col>
          <Col md={3}>
            <h6>Contact Info</h6>
            <ul className="list-unstyled">
              <li>Email: manish626591@gmail.com</li>
              <li>Phone: +91 6265918822</li>
              <li>Address: Hostel 11, Manit Bhopal</li>
            </ul>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <p className="text-center">
              © 2024 Event Management System. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
