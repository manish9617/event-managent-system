import { createContext, useState } from "react";
import axios from "axios";
export const AllFunction = createContext({
  handleAuth: () => {},
  handleLogout: () => {},
  handelData: () => {},
});

const DataProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [userType, setUserType] = useState("attendee");
  const [events, setEvent] = useState();

  const handleLogout = () => {
    // console.log("hello");
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
          // console.log(res.data.userdata);
          if (res.data.userdata.organizer) setUserType("organizer");
          else setUserType("attendee");
        }
      });
  };

  const handelData = () => {
    axios.get("http://127.0.0.1:8000/api/allevent/").then((res) => {
      // console.log(res.data.events);
      const sortedEvents = res.data.events.sort((a, b) => a.date - b.date);
      setEvent(sortedEvents);
    });
  };
  return (
    <AllFunction.Provider
      value={{ handleAuth, handleLogout, auth, userType, events, handelData }}
    >
      {children}
    </AllFunction.Provider>
  );
};
export default DataProvider;

// [
//   {
//     id: 1,
//     name: "Event 1",
//     imageUrl: "/tech.png",
//     date: "June 15, 2024",
//     location: "City A",
//     description: "Description of Event 1",
//   },
//   {
//     id: 2,
//     name: "Event 2",
//     imageUrl: "/tech.png",
//     date: "July 10, 2024",
//     location: "City B",
//     description: "Description of Event 2",
//   },
//   {
//     id: 3,
//     name: "Event 3",
//     imageUrl: "/tech.png",
//     date: "July 10, 2024",
//     location: "City B",
//     description: "Description of Event 2",
//   },
//   {
//     id: 4,
//     name: "Event 4",
//     imageUrl: "/tech.png",
//     date: "July 10, 2024",
//     location: "City B",
//     description: "Description of Event 2",
//   },
//   {
//     id: 5,
//     name: "Event 5",
//     imageUrl: "/tech.png",
//     date: "July 10, 2024",
//     location: "City B",
//     description: "Description of Event 2",
//   },
// ];
