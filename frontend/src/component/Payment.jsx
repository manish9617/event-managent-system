import React, { useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { AllFunction } from "./store/store";
import { useParams } from "react-router-dom";
import axios from "axios";
const Payment = () => {
  const { currentEvents } = useContext(AllFunction);
  const { eventId } = useParams();
  const event = currentEvents.find((event) => event.id === parseInt(eventId));
  const token = localStorage.getItem("token");
  const handlePayment = () => {
    axios
      .post(
        "http://127.0.0.1:8000/api/events/register/",
        { event_id: eventId, payment_status: "paid" },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <Container>
      <Row className="mt-5 mb-5">
        {/* Event Details */}
        <Col md={1}></Col>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Event Details</Card.Header>
            <Card.Body>
              <Card.Img
                style={{ objectFit: "cover", maxHeight: "200px" }}
                className="w-100 mb-3"
                variant="top"
                src={event.event_image}
                alt={event.name}
              />
              <Card.Title>{event.name}</Card.Title>
              <Card.Text>Date: {event.date}</Card.Text>
              <Card.Text>Location: {event.location}</Card.Text>
              <Card.Text>Description: {event.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* Payment Details */}
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Payment Details</Card.Header>
            <Card.Body>
              <Card.Text className="mb-3">
                <strong>Price:</strong> Rs.{event.price}
              </Card.Text>
              <Button variant="primary w-100 mt-3" onClick={handlePayment}>
                Pay Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
