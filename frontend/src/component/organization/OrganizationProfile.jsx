import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import OrganizationProfileInfo from "./OrganizationProfileInfo"; // Sample component for user profile info
import styles from "./Organization.module.css"; // Import the CSS module
import PostEvent from "./PostEvent";
import AllPostedEvent from "./AllPsotedEvent";
import { AllFunction } from "../store/store";

const OrganizationProfile = () => {
  const [activeOption, setActiveOption] = useState("info");
  const [showSidebar, setShowSidebar] = useState(true); // Initially show sidebar on desktop
  const { auth, handleAuth } = useContext(AllFunction);
  const handleOptionClick = (option) => {
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
              onClick={() => handleOptionClick("info")}
            >
              Profile Info
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeOption === "viewallevent"}
              onClick={() => handleOptionClick("viewallevent")}
            >
              View All Event
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeOption === "postEvent"}
              onClick={() => handleOptionClick("postEvent")}
            >
              Post Event
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
          {activeOption === "postEvent" && (
            <PostEvent handleOptionClick={handleOptionClick} />
          )}
          {activeOption === "viewallevent" && <AllPostedEvent />}
          {/* Add more components based on options */}
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizationProfile;
