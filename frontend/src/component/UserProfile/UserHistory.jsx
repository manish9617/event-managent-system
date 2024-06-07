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
  useEffect(() => {
    if (token != null && !events) {
      axios
        .get("http://127.0.0.1:8000/api/events/registered/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          // console.log(res.data.events);
          handleEvent(res.data.events);
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
            <th scope="col">Location</th>
            <th scope="col">Price</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((temp, index) => (
            <tr key={temp.event.id}>
              <th scope="row">{index + 1}</th>
              <td>{temp.event.name}</td>
              <td>{temp.event.date}</td>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserHistory;
