import React, { useEffect, useState } from "react";
import axios from "axios";
function TotalAttendees({ handleOptionClick, eventId }) {
  const [attendee, setAttendee] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token != null && !attendee) {
      axios
        .get(`http://127.0.0.1:8000/api/events/${eventId}/registrations/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setAttendee(res.data.registered_users);
          } else {
            alert("Some thing went wrongs");
          }
        });
    }
  });
  if (!eventId) {
    return (
      <center>
        <p>Some this went wrong</p>
      </center>
    );
  }
  if (!attendee)
    return (
      <center>
        <h2>Loading</h2>
      </center>
    );
  return (
    <div>
      <button
        className="btn btn-primary m-3 "
        onClick={() => handleOptionClick("viewallevent")}
      >
        BACK
      </button>
      <table class="table table-hover m-4">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">username</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {attendee.map((temp, index) => {
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{temp.username}</td>
              <td>{`${temp.first_name} + " " + ${temp.last_name}`}</td>

              <td>{temp.email}</td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TotalAttendees;
