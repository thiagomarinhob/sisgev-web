import type { StyleSpecification } from "maplibre-gl"

/**
 * Estilo base padrão: raster do OpenStreetMap (ruas reais, sem chave).
 * Uso em dev respeitando a política do tile server público do OSM; para
 * produção, prefira um provedor com chave via `VITE_MAP_STYLE_URL`.
 */
export const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
}

/**
 * Estilo do mapa: usa `VITE_MAP_STYLE_URL` quando definido (override para
 * estilos vetoriais), senão cai no OSM raster.
 */
export function resolveMapStyle(): string | StyleSpecification {
  const url = import.meta.env.VITE_MAP_STYLE_URL as string | undefined
  return url && url.trim() ? url : OSM_STYLE
}
