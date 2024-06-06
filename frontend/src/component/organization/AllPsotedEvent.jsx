import React, { useContext, useEffect, useState } from "react";
import styles from "./AllPostedEvent.module.css";
import PostedEvent from "./PostedEvent";
import axios from "axios";
import { AllFunction } from "../store/store";

function AllPostedEvent({ handleOptionClick }) {
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

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    if (token && auth) {
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

  useEffect(() => {
    fetchEvents();
  }, [auth]);

  if (events === null) {
    return (
      <center>
        <h2>Fetching</h2>
      </center>
    );
  }

  const currentEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );
  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date()
  );

  return (
    <div className={styles.container}>
      {/* <h1 className="my-4">All Posted Events</h1> */}
      <h2 className="my-4">Available Events</h2>
      {currentEvents.length === 0 ? (
        <h5>No events posted yet</h5>
      ) : (
        currentEvents.map((event) => (
          <PostedEvent
            key={event.id}
            event={event}
            onEdit={openPopup}
            isPopupOpen={isPopupOpen}
            closePopup={closePopup}
            selectedEvent={selectedEvent}
            fetchEvents={fetchEvents}
            handleOptionClick={handleOptionClick}
          />
        ))
      )}

      {pastEvents.length > 0 && (
        <>
          <hr />
          <h2 className="my-4">Past Events</h2>
          {pastEvents.map((event) => (
            <PostedEvent
              key={event.id}
              event={event}
              onEdit={openPopup}
              isPopupOpen={isPopupOpen}
              closePopup={closePopup}
              selectedEvent={selectedEvent}
              fetchEvents={fetchEvents}
              handleOptionClick={handleOptionClick}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default AllPostedEvent;
