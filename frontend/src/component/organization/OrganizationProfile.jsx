import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import OrganizationProfileInfo from "./OrganizationProfileInfo"; // Sample component for user profile info
import styles from "./Organization.module.css"; // Import the CSS module
import PostEvent from "./PostEvent";
import AllPostedEvent from "./AllPsotedEvent";
import { AllFunction } from "../store/store";
import TotalAttendees from "./TotalAttendees";
import AllFeedback from "./AllFeedback";

const OrganizationProfile = () => {
  const [activeOption, setActiveOption] = useState("info");
  const [showSidebar, setShowSidebar] = useState(true); // Initially show sidebar on desktop
  const { auth, handleAuth } = useContext(AllFunction);
  const [eventId, setEventId] = useState();
  const handleOptionClick = (option, id) => {
    setEventId(id);
    setActiveOption(option);
    if (window.innerWidth <= 768) {
      setShowSidebar(false); // Close sidebar on option click in mobile view
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token") != null && !auth) {
      handleAuth();
    }
  });
  return (
    <Container fluid className={styles.userProfileContainer}>
      <Row>
        {/* Sidebar */}
        <Col
          md={3}
          className={`${styles.sidebar} ${
            showSidebar ? styles.sidebarOpen : ""
          }`}
        >
          <ListGroup>
            <ListGroup.Item
              action
              active={activeOption === "info"}
              onClick={() => setActiveOption("info")}
            >
              Profile Info
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeOption === "viewallevent"}
              onClick={() => setActiveOption("viewallevent")}
            >
              View All Event
            </ListGroup.Item>
            {/* Add more options as needed */}
          </ListGroup>
        </Col>
        {/* Content */}
        <Col
          md={9}
          className={`${styles.content} ${
            showSidebar ? styles.contentOpen : ""
          }`}
        >
          <Button
            variant="primary"
            className={`${styles.toggleSidebar} d-lg-none`} // Hide toggle button on desktop
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </Button>
          {activeOption === "info" && <OrganizationProfileInfo />}
          {activeOption === "viewallevent" && (
            <AllPostedEvent handleOptionClick={handleOptionClick} />
          )}
          {activeOption === "allattendees" && (
            <TotalAttendees
              handleOptionClick={handleOptionClick}
              eventId={eventId}
            />
          )}
          {activeOption === "feedback" && (
            <AllFeedback
              handleOptionClick={handleOptionClick}
              eventId={eventId}
            />
          )}
          {/* Add more components based on options */}
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizationProfile;
