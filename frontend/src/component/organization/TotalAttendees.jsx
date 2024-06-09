import React, { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AllFunction } from "../store/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function TotalAttendees({ handleOptionClick, eventId }) {
  const [attendee, setAttendee] = useState();
  const [loading, setLoading] = useState(true);
  const { currentEvents, handleData } = useContext(AllFunction);

  useEffect(() => {
    if (!currentEvents) {
      handleData();
    }
  }, [currentEvents, handleData]);

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
            alert("Something went wrong");
          }
        })
        .catch((error) => {
          console.error("Error fetching attendees:", error);
          alert("Error fetching attendees");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [eventId, attendee]);

  const event = currentEvents
    ? currentEvents.find((curr) => eventId === curr.id)
    : null;

  const downloadPdf = async () => {
    const doc = new jsPDF();
    const content = document.getElementById("table-content");
    const headerText = event
      ? `${event.name} Event Attendees`
      : "Event Attendees";
    const headerStyle = {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    };
    doc.text(headerText, doc.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });
    const options = {
      scale: 2,
      useCORS: true,
    };
    await html2canvas(content, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 25, pdfWidth, pdfHeight);
      doc.save(
        `${event ? event.name.replace(/\s+/g, "-") : "event"}-attendees.pdf`
      );
      toast.success("Download successfully");
    });
  };

  if (!eventId) {
    return (
      <center>
        <p>Something went wrong</p>
      </center>
    );
  }

  if (loading) {
    return (
      <center>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </center>
    );
  }

  if (!attendee) {
    return (
      <center>
        <h2>Loading</h2>
      </center>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <Button onClick={() => handleOptionClick("viewallevent")}>
          <IoIosArrowBack size={25} /> Back
        </Button>
        <Button className="btn-secondary" onClick={downloadPdf}>
          <MdOutlineFileDownload size={25} /> Download list of attendees
        </Button>
      </div>
      <div id="table-content" className="table-content">
        <table className="table table-hover m-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {attendee.map((temp, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{temp.username}</td>
                <td>{`${temp.first_name} ${temp.last_name}`}</td>
                <td>{temp.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TotalAttendees;
