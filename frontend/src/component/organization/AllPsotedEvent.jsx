import React, { useContext, useEffect, useState } from "react";
import styles from "./AllPostedEvent.module.css";
import PostedEvent from "./PostedEvent";
import axios from "axios";
import { AllFunction } from "../store/store";

function AllPostedEvent() {
  const [events, setEvents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { auth } = useContext(AllFunction);

  const openPopup = (event) => {
    setSelectedEvent(event);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedEvent(null);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      if (token != null && auth) {
        try {
          const res = await axios.get(
            "http://127.0.0.1:8000/api/events/organized/",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          if (Array.isArray(res.data)) {
            setEvents(res.data);
          } else {
            console.error("Unexpected response format:", res.data);
          }
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
    };

    fetchEvents();
  }, [auth]);

  if (events == null) {
    return (
      <center>
        <h2>Fetching</h2>
      </center>
    );
  }

  return (
    <div className={styles.container}>
      {events.length === 0 ? (
        <h5>No events posted yet</h5>
      ) : (
        events.map((event) => (
          <PostedEvent
            key={event.id}
            event={event}
            onEdit={openPopup}
            isPopupOpen={isPopupOpen}
            closePopup={closePopup}
            selectedEvent={selectedEvent}
          />
        ))
      )}
    </div>
  );
}

export default AllPostedEvent;
