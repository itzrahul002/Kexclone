import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Modal, Button, Form } from "react-bootstrap";
import RegLogo from "../assets/logo.png";
import "../App.css";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [serviceDate, setServiceDate] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Save to backend
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser?.PrimaryID) {
      alert("PrimaryID missing. Please re-login.");
      return;
    }

    const response = await fetch("http://localhost:3000/api/ad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        PrimaryID: storedUser.PrimaryID,
        Date: serviceDate,
        Message: message,
      }),
    });

    const result = await response.json();
    console.log("API result:", result);

    if (response.ok) {
      alert("Ad Hoc Service saved successfully!");
      setServiceDate("");
      setMessage("");
      setShowModal(false);
    } else {
      alert(result?.error || "Failed to save Ad Hoc Service");
    }
  } catch (err) {
    console.error("Error saving Ad Hoc Service:", err);
    alert("Error saving Ad Hoc Service");
  }
};


  return (
    <Navbar className="bg-red" expand="xl" variant="dark">
      {/* Logo */}
      <Navbar.Brand as={Link} to="/home">
        <img src={RegLogo} width="180px" alt="logo" />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {/* Dropdown */}
          <NavDropdown title="Requests" id="requests-dropdown">
            <NavDropdown.Item as="button" onClick={handleShow}>
              Ad Hoc Service
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/edit/home">
              Edit Client Details
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/site-visit">
              Site Visit
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/statement">
              Statement
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Link as={NavLink} to="/home">Client Details</Nav.Link>
          <Nav.Link as={NavLink} to="/delivery-notes">Delivery Notes</Nav.Link>
          <Nav.Link as={NavLink} to="/invoices">Invoices</Nav.Link>
          <Nav.Link as={NavLink} to="/custom-orders">Custom Orders</Nav.Link>
          <Nav.Link as={NavLink} to="/mat-locations">MAT Locations</Nav.Link>
          <Nav.Link as="button" onClick={handleLogout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Ad Hoc Service</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                required
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save & Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Navbar>
  );
};

export default Header;
