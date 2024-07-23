/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SocketContextProvider } from "./context/SocketContext.tsx";
import * as process from "process";
import { ThemeContextProvider } from "./context/ThemeContext.tsx";

(window as any).global = window;
(window as any).process = process;
(window as any).Buffer = [];
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
