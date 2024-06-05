import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { AllFunction } from "./store/store";

const EventDetails = () => {
  const { events } = useContext(AllFunction);
  const { eventId } = useParams();
  const event = events.find((event) => event.id === parseInt(eventId));

  if (!event) {
    return <div>Event not found</div>;
  }

  const { name, event_image, date, location, description, price } = event;

  return (
    <Container>
      <h1 className="my-4">{name} Details</h1>
      <Card>
        <Card.Img
          variant="top"
          src={event_image}
          alt={name}
          style={{
            maxHeight: "300px",
            objectFit: "cover",
            position: "relative",
          }} // Set max height, object-fit, and position
        />
        <Link to={`/events/payment/${event.id}`}>
          <Button
            variant="primary"
            style={{ position: "absolute", top: "60%", right: "10px" }} // Set position for the button
          >
            Register
          </Button>
        </Link>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>Description: {description}</Card.Text>
          <Card.Text>Date: {date}</Card.Text>
          <Card.Text>Location: {location}</Card.Text>
          <Card.Text>Ticket price: {price}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventDetails;
