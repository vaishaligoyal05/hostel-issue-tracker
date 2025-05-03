import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import { UserProvider } from './context/UserContext.jsx'; // Add .jsx if needed

import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);
