import { createBrowserRouter, Navigate } from "react-router-dom"

import { LoginPage } from "@/features/auth/pages/LoginPage"
import { PrivateRoute } from "./guards"

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <Navigate to="/login" replace /> },
  {
    element: <PrivateRoute />,
    children: [
      { path: "/admin/dashboard", element: <div>Admin Dashboard</div> },
      { path: "/prefeitura/dashboard", element: <div>Prefeitura Dashboard</div> },
    ],
  },
])
