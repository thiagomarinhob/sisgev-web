import { RouterProvider } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider"
import { router } from "./router"

export function Providers() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
