import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { AllFunction } from "./store/store";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Payment = () => {
  const { currentEvents } = useContext(AllFunction);
  const { eventId } = useParams();
  const event = currentEvents.find((event) => event.id === parseInt(eventId));
  const token = localStorage.getItem("token");
  const [ticket, setTicket] = useState();
  const [showTicket, setShowTicket] = useState(false);
  const handlePayment = () => {
    axios
      .post(
        "http://127.0.0.1:8000/api/events/register/",
        { event_id: eventId, payment_status: "paid" },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status == 201) {
          toast.success("Booked Successfully");
          setTicket(res.data);
          setShowTicket(true);
        } else if (res.status == 208) {
          toast.error(res.data.detail);
        } else if (res.status == 402) {
          toast.error(res.data.detail);
        } else if (res.status == 204) {
          toast.error(res.data.detail);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const downloadPdf = async () => {
    const doc = new jsPDF();
    const content = document.getElementById("ticket-content");

    // Add header at the top of the PDF
    const headerText = `${event.name} Event Ticket`;
    const headerStyle = {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    };
    doc.text(headerText, doc.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });

    const options = {
      scale: 2,
      useCORS: true, // Enable CORS to load images
    };

    await html2canvas(content, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgProperties = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      doc.addImage(imgData, "PNG", 0, 30, pdfWidth, pdfHeight); // Adjust Y position for the image
      doc.save(`${event.name}-ticket.pdf`);
      toast.success("Download successfully");
    });
  };
  return (
    <Container>
      {!showTicket && (
        <Row className="mt-5 mb-5">
          {/* Event Details */}
          <Col md={1}></Col>
          <Col md={6}>
            <Card>
              <Card.Header as="h5">Event Details</Card.Header>
              <Card.Body>
                <Card.Img
                  style={{ objectFit: "cover", maxHeight: "200px" }}
                  className="w-100 mb-3"
                  variant="top"
                  src={event.event_image}
                  alt={event.name}
                />
                <Card.Title>{event.name}</Card.Title>
                <Card.Text>Date: {event.date}</Card.Text>
                <Card.Text>Location: {event.location}</Card.Text>
                <Card.Text>Description: {event.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          {/* Payment Details */}
          <Col md={4}>
            <Card>
              <Card.Header as="h5">Payment Details</Card.Header>
              <Card.Body>
                <Card.Text className="mb-3">
                  <strong>Price:</strong> Rs.{event.price}
                </Card.Text>
                <Button variant="primary w-100 mt-3" onClick={handlePayment}>
                  Pay Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      {showTicket && (
        <>
          <Button className="btn-secondary mt-3" onClick={downloadPdf}>
            <MdOutlineFileDownload size={25} /> Download Ticket
          </Button>
          <Row className="mt-5 mb-5" id="ticket-content">
            {/* Event Details */}
            <Col md={6}>
              <Card
                style={{
                  backgroundColor: "#f0f0f0",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Header
                  as="h5"
                  style={{ backgroundColor: "#007bff", color: "#fff" }}
                >
                  Event Details
                </Card.Header>
                <Card.Body>
                  <Card.Img
                    style={{
                      objectFit: "cover",
                      maxHeight: "200px",
                      marginBottom: "10px",
                    }}
                    className="w-100"
                    variant="top"
                    src={event.event_image}
                    alt={event.name}
                    crossOrigin="anonymous"
                  />
                  <Card.Title style={{ color: "#333" }}>
                    {event.name}
                  </Card.Title>
                  <Card.Text style={{ color: "#555" }}>
                    Date: {event.date}
                  </Card.Text>
                  <Card.Text style={{ color: "#555" }}>
                    Location: {event.location}
                  </Card.Text>
                  <Card.Text style={{ color: "#555" }}>
                    Description: {event.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* Ticket Details */}
            <Col md={6}>
              <Card
                style={{
                  backgroundColor: "#e9e9e9",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Header
                  as="h5"
                  style={{ backgroundColor: "#28a745", color: "#fff" }}
                >
                  Ticket Details
                </Card.Header>
                <Card.Body>
                  <Card.Img
                    style={{
                      objectFit: "contain",
                      maxHeight: "290px",
                      marginBottom: "10px",
                    }}
                    className="w-100"
                    variant="top"
                    src={`http://127.0.0.1:8000${ticket.ticket_qr_image}`}
                    alt="ticket"
                    crossOrigin="anonymous"
                  />
                  <Card.Text style={{ color: "#555" }}>
                    Ticket Price: {event.price}
                  </Card.Text>
                  <Card.Text style={{ color: "#555" }}>
                    Payment Status: {ticket.payment_status}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Payment;
