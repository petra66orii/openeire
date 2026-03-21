import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppErrorBoundary from "./components/AppErrorBoundary";
const CHUNK_RELOAD_STORAGE_KEY = "openeire:chunk-reload-attempted";

const queryClient = new QueryClient();

window.addEventListener("vite:preloadError", (event) => {
  const hasRetriedChunkLoad =
    window.sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY) === "1";

  if (hasRetriedChunkLoad) {
    window.sessionStorage.removeItem(CHUNK_RELOAD_STORAGE_KEY);
    return;
  }

  event.preventDefault();
  window.sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, "1");
  window.location.reload();
});

if (window.sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY) === "1") {
  window.addEventListener(
    "load",
    () => {
      window.sessionStorage.removeItem(CHUNK_RELOAD_STORAGE_KEY);
    },
    { once: true },
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </AppErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
