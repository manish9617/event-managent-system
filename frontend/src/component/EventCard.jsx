import React, { useContext, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import styles from "./EventCard.module.css"; // Import CSS Modules styles
import { AllFunction } from "./store/store";
function EventCard({ event }) {
  const { name, event_image, date, location, description, price } = event;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { auth } = useContext(AllFunction);
  // Truncate description to 100 characters
  const truncatedDescription =
    description.length > 100 ? `${description.slice(0, 100)}...` : description;

  // Check if the event date is in the past
  const isExpired = new Date(date) < new Date();

  return (
    <Card className={styles["event-card"]}>
      <div className={styles["image-container"]}>
        <Card.Img variant="top" src={event_image} alt={name} />
        <div className={styles.overlay}></div>
      </div>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          Date: {new Date(date).toISOString().split("T")[0]}
        </Card.Text>
        <Card.Text>Location: {location}</Card.Text>
        <Card.Text>Ticket Price: {price}</Card.Text>
        <Card.Text>
          {showFullDescription ? description : truncatedDescription}
          {!showFullDescription && (
            <Link
              to={auth ? `/events/${event.id}` : "/login/"}
              className="ml-2"
            >
              View More
            </Link>
          )}
        </Card.Text>
        {isExpired ? (
          <Button variant="secondary" disabled>
            Ended
          </Button>
        ) : (
          <Link to={auth ? `/events/payment/${event.id}` : "/login/"}>
            <Button variant="primary">Register</Button>
          </Link>
        )}
      </Card.Body>
    </Card>
  );
}

export default EventCard;
