import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import EventCard from "./EventCard"; // Import EventCard component
import { AllFunction } from "./store/store";

function AllEvent() {
  const {
    handleAuth,
    auth,
    handleData,
    currentEvents,
    pastEvents,
    homeCategory,
  } = useContext(AllFunction);
  const token = localStorage.getItem("token");
  const [dateFilter, setDateFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [category, setcategory] = useState("all");
  useEffect(() => {
    if (token != null && !auth) {
      handleAuth();
    }
  }, [token, auth, handleAuth]);

  useEffect(() => {
    if (!currentEvents) {
      handleData();
    } else {
      applyFilters();
    }
  }, [currentEvents, dateFilter, priceFilter, locationFilter, category]);

  useEffect(() => {
    if (homeCategory) {
      if (homeCategory === "Corporate Events") {
        setcategory("Corporate");
      } else if (homeCategory === "Educational Events") {
        setcategory("Educational");
      } else if (homeCategory === "Entertainment Events") {
        setcategory("Entertainment");
      } else if (homeCategory === "Cultural Events") {
        setcategory("Cultural");
      }
    }
  }, [homeCategory]);

  const applyFilters = () => {
    let filtered = [...currentEvents];
    if (dateFilter === "ascending") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (dateFilter === "descending") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (priceFilter === "lowtohigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceFilter === "hightolow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter(
        (event) => event.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }
    if (category !== "all") {
      filtered = filtered.filter(
        (event) => event.event_category.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  };

  const handleDateFilterChange = (e) => {
    const selectedValue = e.target.value;
    setDateFilter(selectedValue);
  };

  const handlePriceFilterChange = (e) => {
    const selectedValue = e.target.value;
    setPriceFilter(selectedValue);
  };

  const handleLocationFilterChange = (e) => {
    const selectedValue = e.target.value;
    setLocationFilter(selectedValue);
  };
  const handleCategoryFilter = (e) => {
    const selectedValue = e.target.value;
    setcategory(selectedValue);
  };

  const handleClearFilters = () => {
    setDateFilter("all");
    setPriceFilter("all");
    setLocationFilter("all");
    setcategory("all");
    // setFilteredEvents(currentEvents);
  };

  if (!currentEvents) {
    return (
      <center>
        <h2>Loading</h2>
      </center>
    );
  }

  return (
    <Container className="mt-3">
      <Row className="mb-4">
        <Col sm={2}>Filter by:</Col>
        <Col>
          <select
            className="form-select"
            value={dateFilter}
            onChange={handleDateFilterChange}
          >
            <option value="all">By Date</option>
            <option value="ascending">Ascending Order</option>
            <option value="descending">Descending Order</option>
          </select>
        </Col>
        <Col>
          <select
            className="form-select"
            value={priceFilter}
            onChange={handlePriceFilterChange}
          >
            <option value="all">By Ticket Price</option>
            <option value="lowtohigh">Low to High</option>
            <option value="hightolow">High to Low</option>
          </select>
        </Col>
        <Col>
          <select
            className="form-select"
            value={locationFilter}
            onChange={handleLocationFilterChange}
          >
            <option value="all">By Locations</option>
            <option value="indore">Indore</option>
            <option value="bhopal">Bhopal</option>
            <option value="dewas">Dewas</option>
            <option value="ujjain">Ujjain</option>
            <option value="pune">Pune</option>
            <option value="banglore">Banglore</option>
            <option value="mumbai">Mumbai</option>
          </select>
        </Col>
        <Col>
          <select
            className="form-select"
            value={category}
            onChange={handleCategoryFilter}
          >
            <option value="all">By Category</option>
            <option value="Educational">Educational Events</option>
            <option value="Corporate">Corporate Events</option>
            <option value="Entertainment">Entertainment Events</option>
            <option value="Cultural">Cultural Events</option>
          </select>
        </Col>
        <Col>
          <button
            className="btn btn-secondary rounded-3"
            onClick={handleClearFilters}
          >
            Clear Filter
          </button>
        </Col>
      </Row>
      <h2 className="my-4">Available Events</h2>
      <Row>
        {filteredEvents.map((event) => (
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
