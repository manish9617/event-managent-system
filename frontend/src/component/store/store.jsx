import { createContext, useState } from "react";
import axios from "axios";

export const AllFunction = createContext({
  handleAuth: () => {},
  handleLogout: () => {},
  handleData: () => {}, // Corrected function name here
});

const DataProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [userType, setUserType] = useState("attendee");
  const [events, setEvent] = useState();
  const [currentEvents, setCurrentEvent] = useState();
  const [pastEvents, setPastEvent] = useState();

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://127.0.0.1:8000/api/logout/",
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          localStorage.clear();
          location.href = "/";
        }
      });
  };

  const handleAuth = async () => {
    const token = localStorage.getItem("token");
    await axios
      .get("http://127.0.0.1:8000/api/auth/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setAuth(true);
          if (res.data.userdata.organizer) setUserType("organizer");
          else setUserType("attendee");
        }
      });
  };

  const handleData = () => {
    // Corrected function name here
    axios.get("http://127.0.0.1:8000/api/allevent/").then((res) => {
      setCurrentEvent(
        res.data.events.filter((event) => new Date(event.date) >= new Date())
      );
      setPastEvent(
        res.data.events.filter((event) => new Date(event.date) < new Date())
      );
    });
  };

  return (
    <AllFunction.Provider
      value={{
        handleAuth,
        handleLogout,
        auth,
        userType,
        events,
        handleData, // Corrected function name here
        currentEvents,
        pastEvents,
      }}
    >
      {children}
    </AllFunction.Provider>
  );
};

export default DataProvider;
