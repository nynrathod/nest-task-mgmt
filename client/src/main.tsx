import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./view/pages/Login.tsx";
import Signup from "./view/pages/Signup.tsx";
import Home from "./view/pages/Home.tsx";

const BrowserRouter = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/home", element: <Home /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={BrowserRouter} />
  </StrictMode>,
);
