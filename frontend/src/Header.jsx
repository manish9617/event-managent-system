import React, { useContext, useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { FaRegUserCircle } from "react-icons/fa";
import { AllFunction } from "./component/store/store";
function Header() {
  // Mock authentication state
  const { auth, userType, handleLogout } = useContext(AllFunction);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">EventManager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/events">Events</Nav.Link>
            {auth && userType !== "attendee" && (
              <Nav.Link href="/postevent">PostEvent</Nav.Link>
            )}
          </Nav>
          <Nav>
            {auth ? (
              <NavDropdown
                title={<FaRegUserCircle size={30} />}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  href={
                    userType === "attendee"
                      ? "/userprofile"
                      : "/organizationProfile"
                  }
                >
                  My Profile
                </NavDropdown.Item>
                {/* <NavDropdown.Item href="/settings">Settings</NavDropdown.Item> */}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button variant="outline-light" href="/login" className="me-2">
                  Login
                </Button>
                <Button variant="outline-light" href="/register">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
