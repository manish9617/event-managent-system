import React from "react";
import styles from "./AllPostedEvent.module.css";

function PostedEvent({
  event,
  onEdit,
  isPopupOpen,
  closePopup,
  selectedEvent,
}) {
  return (
    <>
      <div key={event.id} className={`${styles.main} mt-4`}>
        <div className={styles.eventInfo}>
          <h5 className="p-1 font-bold">{event.name}</h5>
          <h5 className="p-1">{event.location}</h5>
        </div>
        <div className={styles.verticalLine}></div>
        <div className={styles.eventInfo}>
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
        <div className={styles.verticalLine}></div>
        <div className={styles.eventInfo}>
          <button
            className="btn btn-secondary btn-lg mt-2 h-[65%] pt-1"
            onClick={() => onEdit(event)}
          >
            Edit
          </button>
        </div>
      </div>

      {isPopupOpen && selectedEvent.EventId === event.EventId && (
        <div className={styles.popupWrapper}>
          <div className={styles.popup}>
            <button className={styles.closeBtn} onClick={closePopup}>
              X
            </button>
            <div className={styles.edit1}>
              <form className={styles.jobForm}>
                <div className="form-group">
                  <label>Event Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={selectedEvent?.name}
                  />
                </div>
                <div className="form-group">
                  <label>Event Description:</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={selectedEvent?.description}
                  />
                </div>
                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={selectedEvent?.location}
                  />
                </div>
                <div className="form-group">
                  <label>Event Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    defaultValue={selectedEvent?.date}
                  />
                </div>
                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={selectedEvent?.price}
                  />
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
