import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import gsap from "gsap";

// Frontend
import App from "./App.jsx";

// Admin
import AdminLayout from "./admin/AdminLayout.jsx";
import ProtectedRoute from "./admin/components/ProtectedRoute.jsx";
import LoginPage from "./admin/pages/LoginPage.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import ServicesPage from "./admin/pages/ServicesPage.jsx";
import BarbersPage from "./admin/pages/BarbersPage.jsx";
import StylesPage from "./admin/pages/StylesPage.jsx";
import HoursPage from "./admin/pages/HoursPage.jsx";
import StroresAdmin from "./admin/pages/StroresAdmin.jsx";
import NotificationsAdmin from "./admin/pages/NotificationsAdmin.jsx";

// Notification system

gsap.config({ nullTargetWarn: false });

const router = createBrowserRouter([
  // ── Frontend ──────────────────────────────
  {
    path: "/",
    element: <App />,
  },

  // ── Login (publik, tidak perlu auth) ──────
  {
    path: "/admin/login",
    element: <LoginPage />,
  },

  // ── Admin Panel (protected) ───────────────
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "services", element: <ServicesPage /> },
          { path: "barbers", element: <BarbersPage /> },
          { path: "styles", element: <StylesPage /> },
          { path: "hours", element: <HoursPage /> },
          { path: "stores", element: <StroresAdmin /> },
          { path: "notifications", element: <NotificationsAdmin /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
