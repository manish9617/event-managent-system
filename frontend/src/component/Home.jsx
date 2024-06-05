import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { AllFunction } from "./store/store";
function Home() {
  const { handleAuth, auth } = useContext(AllFunction);

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

  const featuredEvents = [
    {
      id: 1,
      title: "Music Festival",
      description: "Join the biggest music festival of the year.",
      date: "June 20, 2024",
      image: "/Music Festival.jpg",
    },
    {
      id: 2,
      title: "Art Exhibition",
      description: "Discover stunning art from renowned artists.",
      date: "July 5, 2024",
      image: "/art.png",
    },
    {
      id: 3,
      title: "Tech Conference",
      description: "Stay updated with the latest in tech.",
      date: "August 15, 2024",
      image: "/tech.png",
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
          <Col key={category.id} xs={6} md={3} className="text-center mb-4">
            <div
              className="category-icon d-flex p-3 "
              style={{
                border: "2px solid black",
                borderRadius: "5rem",
                height: "6rem",
                width: "15rem",
              }}
            >
              <img src={category.icon} width="50%" className="rounded-5" />
              <p>{category.name}</p>
            </div>
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
        {featuredEvents.map((event) => (
          <Col key={event.id} xs={12} md={4} className="mb-4 ">
            <Card>
              <Card.Img variant="top" src={event.image} />
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Card.Text>
                  <strong>Date:</strong> {event.date}
                </Card.Text>
                <Button variant="primary" href={`/events/${event.id}`}>
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
