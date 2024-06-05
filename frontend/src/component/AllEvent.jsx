import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import EventCard from "./EventCard"; // Import EventCard component
import { AllFunction } from "./store/store";

function AllEvent() {
  // Sample static data for events (replace with your actual data)
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

  // State for filter value
  // const [filterValue, setFilterValue] = useState("");

  // // Get unique locations from events
  // const locations = [...new Set(events.map((event) => event.location))];

  // // Event handler for filter change
  // const handleFilterChange = (e) => {
  //   setFilterValue(e.target.value);
  // };

  // // Filter events based on selected location
  // const filteredEvents = filterValue
  //   ? events.filter((event) => event.location === filterValue)
  //   : events;
  if (events == null) {
    return (
      <center>
        <h2>Loading</h2>
      </center>
    );
  }
  return (
    <Container>
      {/* <div className="filter-container mb-3">
        <Form.Group controlId="eventLocationFilter" className="mb-0">
          <Form.Label className="mr-2">Filter by Location:</Form.Label>
          <Form.Control
            as="select"
            onChange={handleFilterChange}
            value={filterValue}
            custom
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div> */}
      <h1 className="my-4">All Events</h1>
      <Row>
        {events.map((event) => (
          <Col key={event.id} sm={6} md={4} lg={3} className="mb-4">
            <EventCard event={event} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default AllEvent;
