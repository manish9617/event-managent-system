import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
const Feedback = ({ handleOptionClick, current }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isEventEnded, setIsEventEnded] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const eventDate = new Date(current.event.date);
    setIsEventEnded(currentDate > eventDate);
  }, [current.event.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEventEnded) {
      setIsEventEnded(false); // Reset flag to show form again
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/events/${current.event.id}/feedback/`,
        { rating, comments },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Feedback submitted");
      handleOptionClick("history");
    } catch (error) {
      toast.error(error);
      // Handle error if needed
    }
  };

  return (
    <Container className="my-4">
      <Button onClick={() => handleOptionClick("history")}>
        <IoIosArrowBack size={25} /> Back
      </Button>
      <Row className="justify-content-md-center">
        <Col md={6}>
          {isEventEnded ? (
            <>
              <h2 className="text-center">Submit Feedback</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRating">
                  <Form.Label>Rating (out of 5)</Form.Label>
                  <Form.Control
                    type="number"
                    value={rating > 5 ? 5 : rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formComments" className="mt-3">
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Submit Feedback
                </Button>
              </Form>
            </>
          ) : (
            <Alert variant="warning">
              You can't give feedback because the event has not ended.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Feedback;
