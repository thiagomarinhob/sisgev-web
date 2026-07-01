/** Formata metros como quilômetros (spec §3: `formatKm`). */
export function formatKm(meters: number): string {
  const km = meters / 1000
  return `${km.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} km`
}

/** Formata uma data/hora ISO para o padrão brasileiro (spec §3: `formatDate`). */
export function formatDate(iso: string | null): string {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("pt-BR")
}

/** Data + hora curtas. */
export function formatDateTime(iso: string | null): string {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  })
}
