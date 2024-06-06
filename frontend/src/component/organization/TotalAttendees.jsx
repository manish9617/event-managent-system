import React, { useEffect, useState } from "react";
import axios from "axios";
function TotalAttendees({ handleOptionClick, eventId }) {
  const [attendee, setAttendee] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
      if (token != null && !attendee) {
        
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
        className="btn btn-primary ms-3 "
        onClick={() => handleOptionClick("viewallevent")}
      >
        BACK
      </button>
    </div>
  );
}

export default TotalAttendees;
