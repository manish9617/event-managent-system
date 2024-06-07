import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AllFunction } from "../store/store";

function PostEvent() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    price: "",
    event_image: null,
    event_category: "", // added event_category field
  });
  const [error, setError] = useState("");

  const { handleAuth, auth } = useContext(AllFunction);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, event_image: e.target.files[0] });
  };

  useEffect(() => {
    if (localStorage.getItem("token") != null && !auth) {
      handleAuth();
    }
  }, [auth, handleAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("location", formData.location);
    data.append("price", formData.price);
    data.append("event_category", formData.event_category); // added event_category field
    if (formData.event_image) {
      data.append("event_image", formData.event_image);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/postevents/",
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Event created successfully");
        // Reset form fields
        setFormData({
          name: "",
          description: "",
          date: "",
          location: "",
          price: "",
          event_image: null,
          event_category: "",
        });
      }
    } catch (error) {
      console.error("Error uploading event:", error);
      setError("Error uploading event. Please try again.");
    }
  };

  return (
    <div className="container p-5">
      <h2 className="mb-4">Post a New Event</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Event Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Event Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Ticket Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="event_category" className="form-label">
            Event event_category
          </label>
          <select
            className="form-control"
            id="event_category"
            name="event_category"
            value={formData.event_category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Educational">Educational</option>
            <option value="Cultural">Cultural Events</option>
            <option value="Corporate">Corporate Events</option>
            <option value="Entertainment">Entertainment Events</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="event_image" className="form-label">
            Event Image
          </label>
          <input
            type="file"
            className="form-control"
            id="event_image"
            name="event_image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PostEvent;
