import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ScrollProvider } from "./context/ScrollContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollProvider>
        <App />
      </ScrollProvider>
    </BrowserRouter>
  </StrictMode>
);
