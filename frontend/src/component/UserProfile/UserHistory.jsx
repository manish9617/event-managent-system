import React, { useContext, useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";
import axios from "axios";
const UserHistory = () => {
  const [events, setEvents] = useState();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token != null && !events) {
      axios
        .get("http://127.0.0.1:8000/api/events/registered/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          setEvents(res.data.events);
        });
    }
  });
  if (!events)
    return (
      <center>
        <h2>Loading</h2>
      </center>
    );

  return (
    <Container className="p-4">
      <Table className="table table-hover p-2">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Event Title</th>
            <th scope="col">Date</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={event.id}>
              <th scope="row">{index + 1}</th>
              <td>{event.title}</td>
              <td>{event.date}</td>
              <td>{event.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserHistory;
