import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./ThemeContext";
import { initNotifications } from "./notifications";
import { rehydrateStore, startPersistence } from "./persistence";
import { useStore } from "./store/useStore";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Initialize app services
rehydrateStore(useStore)
  .catch(() => void 0)
  .finally(() => {
    startPersistence(useStore);
    initNotifications(useStore);
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
