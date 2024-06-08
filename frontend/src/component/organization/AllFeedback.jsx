import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { IoIosArrowBack } from "react-icons/io";
// import  from "react-bootstrap/Spinner";
function AllFeedback({ handleOptionClick, eventId, isPast }) {
  const [feedback, setFeedback] = useState();
  useEffect(() => {
    if (eventId && !feedback) {
      axios
        .get(`http://127.0.0.1:8000/api/events/${eventId}/feedback/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const temp = res.data.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);

            if (dateA === dateB) {
              return dateA.getTime() - dateB.getTime();
            }
            return dateB - dateA;
          });
          setFeedback(temp);
        });
    }
  });

  if (!eventId) {
    return (
      <center>
        <p>Something went wrong</p>
      </center>
    );
  }
  if (!feedback) {
    return (
      <center>
        <Spinner animation="border" size={50} />
      </center>
    );
  }
  return (
    <div className="m-3">
      <Button onClick={() => handleOptionClick("viewallevent")}>
        <IoIosArrowBack size={25} /> Back
      </Button>

      <div className="mt-3">
        <h3 className="text-center mb-4">All Feedback</h3>
        <hr />
        {feedback.length === 0 && (
          <center>
            <h5>No Feedback available</h5>
          </center>
        )}
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {feedback.length !== 0 &&
            feedback.map((feedback) => (
              <div className="col" key={feedback.id}>
                <Card className="h-100 shadow-sm rounded">
                  <Card.Body>
                    <Card.Title>
                      <strong>{feedback.user}</strong> Rated: {feedback.rating}
                    </Card.Title>
                    <Card.Text>{feedback.comments}</Card.Text>
                    <Card.Text>
                      <small>
                        {new Date(feedback.created_at).toLocaleString()}
                      </small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AllFeedback;
