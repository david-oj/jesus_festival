import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import Home from "@/pages/Home.tsx";
import Payment from "@/pages/Payment.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Login from "./pages/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", index: true, element: <Home /> },
      { path: "payment", element: <Payment /> },
      {path: "dashboard", element: <Dashboard/>},
      {path: "login", element: <Login/>},
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
