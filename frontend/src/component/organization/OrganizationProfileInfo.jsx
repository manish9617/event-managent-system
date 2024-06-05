import React, { useState, useEffect, useContext } from "react";
import Edit from "./Edit.jsx";
import { AllFunction } from "../store/store";
import axios from "axios";
export default function OrganizationProfileInfo() {
  // Static data (replace with actual data if needed)
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
            // console.log(response.data.userdata);
            setUserData(response.data.userdata);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [auth, userData.username]);

  useEffect(() => {
    setUsername(userData.username);
    setFirstName(userData.first_name);
    setLastName(userData.last_name);
    setEmail(userData.email);
  }, [userData]);

  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const editDetails = (type, value) => {
    if (type === "first_name") {
      setFirstName(value);
    } else if (type === "Email") {
      setEmail(value);
    } else if (type === "last_name") {
      setLastName(value);
    } else if (type === "username") {
      setUsername(value);
    }
  };

  const updateProfile = () => {
    console.log("Updating profile:", {
      username,
      first_name,
      last_name,
      email,
    });
  };

  const [isEdit, setEdit] = useState("");
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
