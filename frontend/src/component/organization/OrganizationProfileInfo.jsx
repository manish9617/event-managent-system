// OrganizationProfileInfo.jsx

import React, { useState, useEffect, useContext } from "react";
import Edit from "./Edit.jsx";
import { AllFunction } from "../store/store";
import { toast } from "react-toastify";
import axios from "axios";

export default function OrganizationProfileInfo() {
  const { auth } = useContext(AllFunction);
  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (auth && !userData.username) {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/auth/", {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          if (response.status === 200) {
            setUserData(response.data.userdata);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [auth, userData.username]);

  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setUsername(userData.username);
    setFirstName(userData.first_name);
    setLastName(userData.last_name);
    setEmail(userData.email);
  }, [userData]);

  const editDetails = (type, value) => {
    if (type === "first_name") {
      setFirstName(value);
    } else if (type === "email") {
      // Corrected "Email" to "email"
      setEmail(value);
    } else if (type === "last_name") {
      setLastName(value);
    } else if (type === "username") {
      setUsername(value);
    }
  };

  const updateProfile = () => {
    const token = localStorage.getItem("token");
    axios
      .patch(
        "http://127.0.0.1:8000/api/user/update/",
        {
          username: username,
          first_name: first_name,
          last_name: last_name,
          email: email,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          // Changed == to === for strict equality
          console.log(res);
          toast.success("Update successfully");
        }
      });
  };

  const [isEdit, setEdit] = useState(""); // Changed initial state to null or ""
  const handleEdit = (type) => {
    setEdit(type);
  };
  if (!userData.username) {
    return (
      <center>
        <h2>Data fetching</h2>
      </center>
    );
  }
  return (
    <div className="container mt-5">
      <div className="row p-3">
        <table>
          <tbody>
            <Edit
              type="username"
              values={username}
              editDetails={editDetails}
              handleEdit={handleEdit}
              isEdit={isEdit}
            />
            <Edit
              type="first_name"
              values={first_name}
              editDetails={editDetails}
              handleEdit={handleEdit}
              isEdit={isEdit}
            />

            <Edit
              type="last_name"
              values={last_name}
              editDetails={editDetails}
              handleEdit={handleEdit}
              isEdit={isEdit}
            />

            <Edit
              type="email"
              values={email}
              editDetails={editDetails}
              handleEdit={handleEdit}
              isEdit={isEdit}
            />
          </tbody>
        </table>
        <center>
          <button
            className="btn btn-primary mt-5 w-[80%]"
            onClick={updateProfile}
          >
            Update profile
          </button>
        </center>
      </div>
    </div>
  );
}
