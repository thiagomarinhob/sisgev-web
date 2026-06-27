import { RouterProvider } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/features/auth/context/AuthContext"
import { router } from "./router"

export function Providers() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}
