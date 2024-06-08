import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Ticket({ handleOptionClick, current }) {
  console.log(current);
  const downloadPdf = async () => {
    const doc = new jsPDF();
    const content = document.getElementById("ticket-content");

    // Add header at the top of the PDF
    const headerText = `${current.event.name} Event Ticket`;
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
      doc.save(`${current.event.name}-ticket.pdf`);
      toast.success("Download successfully");
    });
  };

  return (
    <Container>
      <div className="d-flex justify-content-between">
        <Button onClick={() => handleOptionClick("history")}>
          <IoIosArrowBack size={25} /> Back
        </Button>
        <Button className="btn-secondary" onClick={downloadPdf}>
          <MdOutlineFileDownload size={25} /> Download Ticket
        </Button>
      </div>
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
                src={current.event.event_image}
                alt={current.event.name}
                crossOrigin="anonymous"
              />
              <Card.Title style={{ color: "#333" }}>
                {current.event.name}
              </Card.Title>
              <Card.Text style={{ color: "#555" }}>
                Date: {current.event.date}
              </Card.Text>
              <Card.Text style={{ color: "#555" }}>
                Location: {current.event.location}
              </Card.Text>
              <Card.Text style={{ color: "#555" }}>
                Description: {current.event.description}
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
                src={current.registration.ticket_qr_image}
                alt="ticket"
                crossOrigin="anonymous"
              />
              <Card.Text style={{ color: "#555" }}>
                Ticket Price: {current.event.price}
              </Card.Text>
              <Card.Text style={{ color: "#555" }}>
                Payment Status: {current.registration.payment_status}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Ticket;
