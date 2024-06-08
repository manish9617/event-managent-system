import React, { useState, useEffect } from "react";
import styles from "./AllPostedEvent.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function PostedEvent({
  event,
  onEdit,
  isPopupOpen,
  closePopup,
  selectedEvent,
  fetchEvents,
  handleOptionClick,
  isPast,
}) {
  const [formData, setFormData] = useState({
    name: event.name,
    location: event.location,
    date: event.date,
    price: event.price,
    description: event.description,
    event_category: event.event_category,
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .patch(`http://127.0.0.1:8000/api/postevents/${event.id}/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success("Event updated successfully");
        } else {
          toast.error("Event not updated");
        }
        fetchEvents(); // Refresh the events list
        closePopup(); // Close the popup after successful update
      })
      .catch((err) => {
        console.error("Error updating event:", err.response.data);
      });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: event.date.split("T")[0], // Extract date in yyyy-MM-dd format
    }));
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div key={event.id} className={`${styles.main} mt-4`}>
        <div className={styles.eventInfo}>
          <h5 className="p-1 font-bold">{event.name}</h5>
          <h5 className="p-1">{event.location}</h5>
        </div>
        <div className={styles.verticalLine}></div>
        <div
          className={styles.eventInfo}
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleOptionClick("allattendees", event.id);
          }}
        >
          <h5 className="p-1 font-bold">Total Attendees</h5>
          <h5 className="p-1">{event.total_attendees}</h5>
        </div>
        <div className={styles.verticalLine}></div>
        <div className={styles.eventInfo}>
          <h5 className="p-1 font-bold">Event Date</h5>
          <h5 className="p-1">{new Date(event.date).toLocaleDateString()}</h5>
        </div>
        <div className={styles.verticalLine}></div>
        <div className={styles.eventInfo}>
          <h5 className="p-1 font-bold">Ticket price</h5>
          <h5 className="p-1">{event.price}</h5>
        </div>
        {isPast && (
          <>
            <div className={styles.verticalLine}></div>
            <div className={styles.eventInfo}>
              <button
                className="btn btn-secondary btn-lg mt-2 h-[65%] pt-1"
                onClick={() => handleOptionClick("feedback", event.id)}
              >
                View Feedback
              </button>
              <h5></h5>
            </div>
          </>
        )}

        {!isPast && (
          <>
            <div className={styles.verticalLine}></div>
            <div className={styles.eventInfo}>
              <button
                className="btn btn-secondary btn-lg mt-2 h-[65%] pt-1"
                onClick={() => onEdit(event)}
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>

      {isPopupOpen && selectedEvent?.id === event.id && (
        <div className={styles.popupWrapper}>
          <div className={styles.popup}>
            <button className={styles.closeBtn} onClick={closePopup}>
              X
            </button>
            <div className={styles.edit1}>
              <form className={styles.jobForm} onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Event Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Event Description:</label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Event Date:</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    name="event_category"
                    className="form-control"
                    value={formData.event_category}
                    onChange={handleChange}
                  >
                    <option value="Educational">Educational Events</option>
                    <option value="Corporate">Corporate Events</option>
                    <option value="Entertainment">Entertainment Events</option>
                    <option value="Cultural">Cultural Events</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.btnPrimary} mt-3`}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div className={styles.backdrop}></div>
        </div>
      )}
    </>
  );
}

export default PostedEvent;
