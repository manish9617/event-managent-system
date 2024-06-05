import React from "react";
import { Table, Container } from "react-bootstrap";

const UserHistory = () => {
  const events = [
    { id: 1, title: "React Workshop", date: "2024-05-01", price: "100" },
    {
      id: 2,
      title: "JavaScript Conference",
      date: "2024-06-15",
      price: "150",
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      date: "2024-07-20",
      price: "200",
    },
  ];

  return (
    <Container className="border border-dark p-3 rounded-4">
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
