import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./view/pages/Login";
import Signup from "./view/pages/Signup";
import Home from "./view/pages/Home";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./ProtectedRoute.tsx";
import "./index.css";
// Route Configuration
const routes = [
  { path: "/login", element: <Login />, protected: false },
  { path: "/signup", element: <Signup />, protected: false },
  { path: "/", element: <Home />, protected: true },
];

const BrowserRouter = createBrowserRouter(
  routes.map((route) => {
    return {
      path: route.path,
      element: (
        <ProtectedRoute
          element={route.element}
          protectedRoute={route.protected}
        />
      ),
    };
  }),
);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={BrowserRouter} />
    </QueryClientProvider>
  </StrictMode>,
);
