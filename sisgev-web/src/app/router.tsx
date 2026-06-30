import { createBrowserRouter, Navigate } from "react-router-dom"

import { LoginPage } from "@/features/auth/pages/LoginPage"
import { AdminLayout } from "@/features/admin/layouts/AdminLayout"
import { RoleGuard } from "./guards"

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <Navigate to="/login" replace /> },

  {
    element: <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN_OPERACIONAL"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin/dashboard", element: <div>Admin Dashboard</div> },
          { path: "/admin/municipalities", element: <div>Municípios</div> },
          { path: "/admin/users", element: <div>Usuários</div> },
          { path: "/admin/roads", element: <div>Estradas</div> },
          { path: "/admin/segments", element: <div>Trechos</div> },
          { path: "/admin/segments/:id", element: <div>Detalhe do Trecho</div> },
          { path: "/admin/evidences", element: <div>Evidências</div> },
          { path: "/admin/evidences/:id", element: <div>Detalhe da Evidência</div> },
          { path: "/admin/assessments", element: <div>Avaliações</div> },
          { path: "/admin/occurrences", element: <div>Ocorrências</div> },
          { path: "/admin/maintenance", element: <div>Manutenção</div> },
          { path: "/admin/reports", element: <div>Relatórios</div> },
        ],
      },
    ],
  },

  {
    element: <RoleGuard allowedRoles={["GESTOR_PREFEITURA", "VISUALIZADOR"]} />,
    children: [
      { path: "/prefeitura/dashboard", element: <div>Prefeitura Dashboard</div> },
      { path: "/prefeitura/mapa", element: <div>Mapa</div> },
      { path: "/prefeitura/trechos/:id", element: <div>Detalhe do Trecho</div> },
      { path: "/prefeitura/relatorios", element: <div>Relatórios</div> },
    ],
  },
])
