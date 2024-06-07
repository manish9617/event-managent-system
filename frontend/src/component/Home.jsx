import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { AllFunction } from "./store/store";
import { Link } from "react-router-dom";

function Home() {
  const { handleAuth, auth, currentEvents, handleData, handleHomeCategory } =
    useContext(AllFunction);

  useEffect(() => {
    if (!currentEvents) handleData();
  }, [currentEvents]);

  const categories = [
    {
      id: 1,
      name: "Corporate Events",
      icon: "/Corporate.jpg",
    },
    {
      id: 2,
      name: "Educational Events",
      icon: "/Educational.png",
    },
    {
      id: 3,
      name: "Entertainment Events",
      icon: "/Entertainment.jpg",
    },
    {
      id: 4,
      name: "Cultural Events",
      icon: "/culture.png",
    },
  ];

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token != null && !auth) {
      handleAuth();
    }
  });

  return (
    <Container className="my-4">
      {/* Hero Section */}
      <Row className="hero-section py-5 text-center">
        <Col>
          <h1 className="display-4">Discover Amazing Events</h1>
          <p className="lead">
            Book tickets for concerts, conferences, exhibitions, and more!
          </p>
          <Button variant="primary" size="lg" href="/events">
            Explore Events
          </Button>
        </Col>
      </Row>

      {/* Categories Section */}
      <Row className="categories-section my-5">
        <Col className="text-center">
          <h2 className="mb-4">Browse by Category</h2>
        </Col>
      </Row>
      <Row className="mb-4">
        {categories.map((category) => (
          <Col key={category.id} xs={7} md={3} className="text-center mb-4">
            <Link
              to="/events"
              style={{ textDecoration: "none", color: "black" }}
            >
              <div
                className="category-icon d-flex p-3 justify-content-center align-items-center"
                style={{
                  border: "2px solid black",
                  borderRadius: "5rem",
                  height: "6rem",
                  width: "15rem",
                  cursor: "pointer",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => handleHomeCategory(category.name)}
              >
                <img src={category.icon} width="50%" className="rounded-5" />
                <p>{category.name}</p>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Featured Events Section */}
      <Row className="featured-events-section my-5">
        <Col className="text-center">
          <h2 className="mb-4">Featured Events</h2>
        </Col>
      </Row>
      <Row>
        {currentEvents &&
          currentEvents.slice(0, 3).map((event) => (
            <Col key={event.id} xs={12} md={4} className="mb-4">
              <Card
                className="h-100"
                style={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Card.Img variant="top" src={event.event_image} />
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>
                    {event.description.length > 100
                      ? `${event.description.slice(0, 100)}... `
                      : `${event.description}..`}
                    <Link to={`/events/${event.id}`}>View More</Link>
                  </Card.Text>
                  <Card.Text>
                    <strong>Date:</strong> {event.date}
                  </Card.Text>
                  <Link to={`/events/payment/${event.id}`}>
                    <Button variant="primary">Book Now</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default Home;
