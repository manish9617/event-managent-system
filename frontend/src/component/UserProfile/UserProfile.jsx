import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import UserHistory from "./UserHistory"; // Sample component for user profile settings
import EditUserProfile from "./EditUserProfile";
import styles from "./UserProfile.module.css"; // Import the modular CSS
import { AllFunction } from "../store/store";

const UserProfile = () => {
  const [activeOption, setActiveOption] = useState("info");
  const [showSidebar, setShowSidebar] = useState(true); // Initially show sidebar on desktop
  const { handleAuth, auth } = useContext(AllFunction);
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
    <Container fluid className={styles["user-profile-container"]}>
      <Row>
        {/* Sidebar */}
        <Col
          md={3}
          className={`${styles.sidebar} ${showSidebar ? styles.open : ""}`}
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
              active={activeOption === "history"}
              onClick={() => handleOptionClick("history")}
            >
              View History
            </ListGroup.Item>
            {/* Add more options as needed */}
          </ListGroup>
        </Col>
        {/* Content */}
        <Col
          md={9}
          className={`${styles.content} ${
            showSidebar ? styles["sidebar-open"] : ""
          }`}
        >
          <Button
            variant="primary"
            className={`${styles["toggle-sidebar"]} d-lg-none`} // Hide toggle button on desktop
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </Button>
          {activeOption === "info" && <EditUserProfile />}
          {activeOption === "history" && <UserHistory />}
          {/* Add more components based on options */}
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
