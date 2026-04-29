import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Frontend
import App from "./App.jsx";

// Admin
import AdminLayout from "./admin/AdminLayout.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import ServicesPage from "./admin/pages/ServicesPage.jsx";
import BarbersPage from "./admin/pages/BarbersPage.jsx";
import StylesPage from "./admin/pages/StylesPage.jsx";
import HoursPage from "./admin/pages/HoursPage.jsx";

const router = createBrowserRouter([
  // ── Frontend ──────────────────────────────
  {
    path: "/",
    element: <App />,
  },

  // ── Admin Panel ───────────────────────────
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "services", element: <ServicesPage /> },
      { path: "barbers", element: <BarbersPage /> },
      { path: "styles", element: <StylesPage /> },
      { path: "hours", element: <HoursPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
