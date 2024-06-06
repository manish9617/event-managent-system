import React, { useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import EventCard from "./EventCard"; // Import EventCard component
import { AllFunction } from "./store/store";

function AllEvent() {
  const { events, handleAuth, auth, handelData } = useContext(AllFunction);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token != null && !auth) {
      handleAuth();
    }
  });

  useEffect(() => {
    if (events == null) {
      handelData();
    }
  });

  if (events == null) {
    return (
      <center>
        <h2>Loading</h2>
      </center>
    );
  }

  const currentEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );
  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date()
  );

  return (
    <Container>
      <h1 className="my-4">All Events</h1>
      <h2 className="my-4">Available Events</h2>
      <Row>
        {currentEvents.map((event) => (
          <Col key={event.id} sm={6} md={4} lg={3} className="mb-4">
            <EventCard event={event} />
          </Col>
        ))}
      </Row>

      {pastEvents.length > 0 && (
        <>
          <hr />
          <h2 className="my-4">Past Events</h2>
          <Row>
            {pastEvents.map((event) => (
              <Col key={event.id} sm={6} md={4} lg={3} className="mb-4">
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default AllEvent;
