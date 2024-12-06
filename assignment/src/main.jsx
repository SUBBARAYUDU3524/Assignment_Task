import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for routing
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        {" "}
        {/* Wrap the App component with BrowserRouter */}
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
