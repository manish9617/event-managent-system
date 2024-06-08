import React, { useContext, useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";
import axios from "axios";

const UserHistory = ({
  handleEvent,
  events,
  handleOptionClick,
  handleCurrent,
}) => {
  const token = localStorage.getItem("token");
  const [currentEvents, setCurrentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    if (token != null && !events) {
      axios
        .get("http://127.0.0.1:8000/api/events/registered/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          handleEvent(res.data.events);
        });
    }
  }, [events, handleEvent, token]);

  useEffect(() => {
    const currentDate = new Date();

    if (events) {
      const currentEventsFiltered = events.filter(
        (event) => new Date(event.event.date) > currentDate
      );

      const pastEventsFiltered = events.filter(
        (event) => new Date(event.event.date) <= currentDate
      );

      setCurrentEvents(currentEventsFiltered);
      setPastEvents(pastEventsFiltered);
    }
  }, [events]);

  if (!events) {
    return (
      <Container className="p-4">
        <center>
          <h2>Loading</h2>
        </center>
      </Container>
    );
  }

  return (
    <Container className="p-4">
      {currentEvents.length > 0 && (
        <>
          <h2 className="text-center">Current Events (Not Completed)</h2>
          <Table className="table table-hover p-2">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Event Title</th>
                <th scope="col">Date</th>
                <th scope="col">Location</th>
                <th scope="col">Price</th>
                <th scope="col">Ticket</th>
                <th scope="col">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((temp, index) => (
                <tr key={temp.event.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{temp.event.name}</td>
                  <td>
                    {new Date(temp.event.date).toISOString().split("T")[0]}
                  </td>
                  <td>{temp.event.location}</td>
                  <td>{temp.event.price}</td>
                  <td
                    onClick={() => {
                      handleCurrent(temp);
                      handleOptionClick("ticket");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    View Ticket
                  </td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleCurrent(temp);
                      handleOptionClick("feedback");
                    }}
                  >
                    Give Feedback
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {pastEvents.length > 0 && (
        <>
          <h2 className="text-center m-4">Completed Events</h2>
          <Table className="table table-hover p-2">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Event Title</th>
                <th scope="col">Date</th>
                <th scope="col">Location</th>
                <th scope="col">Price</th>
                <th scope="col">Ticket</th>
                <th scope="col">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {pastEvents.map((temp, index) => (
                <tr key={temp.event.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{temp.event.name}</td>
                  <td>
                    {new Date(temp.event.date).toISOString().split("T")[0]}
                  </td>
                  <td>{temp.event.location}</td>
                  <td>{temp.event.price}</td>
                  <td
                    onClick={() => {
                      handleCurrent(temp);
                      handleOptionClick("ticket");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    View Ticket
                  </td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleCurrent(temp);
                      handleOptionClick("feedback");
                    }}
                  >
                    Give Feedback
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default UserHistory;
