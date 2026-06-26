import { createBrowserRouter, Navigate } from "react-router-dom"

import { LoginPage } from "@/features/auth/pages/LoginPage"

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <Navigate to="/login" replace /> },
])
