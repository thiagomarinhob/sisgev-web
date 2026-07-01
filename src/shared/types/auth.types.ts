export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN_OPERACIONAL"
  | "GESTOR_PREFEITURA"
  | "AGENTE_CAMPO"
  | "VISUALIZADOR"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  municipalityId: string | null
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
