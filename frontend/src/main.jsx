import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";
import Home from "./component/Home.jsx";
import About from "./component/About.jsx";
import AllEvent from "./component/AllEvent.jsx";
import EventDetails from "./component/EventDetails.jsx";
import Register from "./component/Register.jsx";
import Login from "./component/Login.jsx";
import UserProfile from "./component/UserProfile/UserProfile.jsx";
import OrganizationProfile from "./component/organization/OrganizationProfile.jsx";
import Payment from "./component/Payment.jsx";
import PostEvent from "./component/organization/PostEvent.jsx";
const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />}></Route>
      <Route path="register" element={<Register />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/events" element={<AllEvent />}></Route>
      <Route path="/events/:eventId" element={<EventDetails />} />
      <Route path="/userprofile" element={<UserProfile />}></Route>
      <Route path="/events/payment/:eventId" element={<Payment />}></Route>
      <Route
        path="/organizationProfile"
        element={<OrganizationProfile />}
      ></Route>
      <Route path="/postevent" element={<PostEvent />}></Route>
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
