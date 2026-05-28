import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Register service worker for PWA capabilities (caching, offline support)
// Only active in production builds
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('[App] Content cached for offline use');
  },
  onUpdate: (registration) => {
    console.log('[App] New version available');
    // Optionally show a notification to the user
    if (window.confirm('New version available! Reload to update?')) {
      serviceWorkerRegistration.skipWaiting();
      window.location.reload();
    }
  },
});
