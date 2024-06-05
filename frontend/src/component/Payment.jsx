import React, { useContext } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { AllFunction } from "./store/store";
import { useParams } from "react-router-dom";
const Payment = () => {
  const { events } = useContext(AllFunction);
  const { eventId } = useParams();
  const event = events.find((event) => event.id === parseInt(eventId));

  const handlePayment = () => {
    // Handle payment logic here
    console.log("Payment processed successfully.");
  };
  return (
    <Container style={{ height: "56.1vh" }}>
      <Row className="mt-4">
        {/* Event Details */}
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Event Details</Card.Header>
            <Card.Body>
              <Card.Title>{event.name}</Card.Title>
              <Card.Text>Date: {event.date}</Card.Text>
              <Card.Text>Location: {event.location}</Card.Text>
              <Card.Text>Description: {event.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* Payment Details */}
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Payment Details</Card.Header>
            <Card.Body>
              <Form.Group controlId="ticketQuantity"></Form.Group>
              <Form.Group controlId="cardNumber">
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" placeholder="Enter card number" />
              </Form.Group>
              <Form.Group controlId="expiryDate">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control type="text" placeholder="MM/YY" />
              </Form.Group>
              <Form.Group controlId="cvv">
                <Form.Label>CVV</Form.Label>
                <Form.Control type="text" placeholder="CVV" />
              </Form.Group>
              <Button variant="primary w-100 mt-3" onClick={handlePayment}>
                {100} Pay Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
