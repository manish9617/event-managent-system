import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import DataProvider from "./component/store/store";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <DataProvider>
      <Header />
      <Outlet></Outlet>
      <Footer />
      <ToastContainer />
    </DataProvider>
  );
}

export default App;
