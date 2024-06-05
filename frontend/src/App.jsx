import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import DataProvider from "./component/store/store";
function App() {
  return (
    <DataProvider>
      <Header />
      <Outlet></Outlet>
      <Footer />
    </DataProvider>
  );
}

export default App;
