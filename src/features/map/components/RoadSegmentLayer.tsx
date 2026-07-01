import { useEffect, useRef } from "react"
import type {
  ExpressionSpecification,
  GeoJSONSource,
  MapLayerMouseEvent,
} from "maplibre-gl"
import type { Feature, FeatureCollection, LineString } from "geojson"

import { CONDITION_COLORS } from "@/shared/constants/conditions"
import { useMap } from "./MapContext"
import type { MapSegment, RoadCondition } from "../types/map.types"

const SOURCE_ID = "road-segments"
const LAYER_ID = "road-segments-line"

/** Propriedades embarcadas em cada feature (reusadas no tooltip/drawer). */
export interface SegmentFeatureProps {
  id: string
  name: string
  roadName: string
  condition: RoadCondition
  lengthMeters: number
}

interface RoadSegmentLayerProps {
  segments: MapSegment[]
  /** Hover sobre um trecho (ou `null` ao sair) — usado pelo tooltip (FE-09). */
  onHover?: (segment: SegmentFeatureProps | null, point: { x: number; y: number }) => void
  /** Clique em um trecho — abre o drawer (FE-10). */
  onSelect?: (segmentId: string) => void
}

/** Expressão `match` que colore a linha por condição (UNKNOWN → cinza). */
function conditionColorExpression(): ExpressionSpecification {
  const stops = (Object.keys(CONDITION_COLORS) as RoadCondition[]).flatMap(
    (condition) => [condition, CONDITION_COLORS[condition]],
  )
  return [
    "match",
    ["get", "condition"],
    ...stops,
    CONDITION_COLORS.UNKNOWN, // fallback
  ] as unknown as ExpressionSpecification
}

function toFeatureCollection(
  segments: MapSegment[],
): FeatureCollection<LineString, SegmentFeatureProps> {
  const features: Feature<LineString, SegmentFeatureProps>[] = segments.map(
    (s) => ({
      type: "Feature",
      geometry: s.geometry,
      properties: {
        id: s.id,
        name: s.name,
        roadName: s.roadName,
        condition: s.condition,
        lengthMeters: s.lengthMeters,
      },
    }),
  )
  return { type: "FeatureCollection", features }
}

/**
 * Renderiza os trechos como linhas coloridas por condição sobre o `MapView`.
 * Adiciona source/layer uma vez e apenas atualiza os dados quando `segments`
 * muda. Não renderiza DOM — atua via efeitos colaterais no mapa.
 */
export function RoadSegmentLayer({
  segments,
  onHover,
  onSelect,
}: RoadSegmentLayerProps) {
  const map = useMap()

  // Callbacks em refs para manter os handlers estáveis entre renders.
  const onHoverRef = useRef(onHover)
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onHoverRef.current = onHover
    onSelectRef.current = onSelect
  }, [onHover, onSelect])

  // Setup do source/layer + handlers (uma vez por instância de mapa).
  useEffect(() => {
    if (!map) return

    function setup() {
      if (!map || map.getSource(SOURCE_ID)) return

      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      })
      map.addLayer({
        id: LAYER_ID,
        type: "line",
        source: SOURCE_ID,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": conditionColorExpression(),
          "line-width": 3,
          "line-opacity": 0.9,
        },
      })
    }

    const handleMove = (e: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer"
      const feature = e.features?.[0]
      if (feature) {
        onHoverRef.current?.(
          feature.properties as SegmentFeatureProps,
          { x: e.point.x, y: e.point.y },
        )
      }
    }
    const handleLeave = () => {
      map.getCanvas().style.cursor = ""
      onHoverRef.current?.(null, { x: 0, y: 0 })
    }
    const handleClick = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0]
      if (feature) {
        onSelectRef.current?.((feature.properties as SegmentFeatureProps).id)
      }
    }

    if (map.isStyleLoaded()) setup()
    else map.once("load", setup)

    map.on("mousemove", LAYER_ID, handleMove)
    map.on("mouseleave", LAYER_ID, handleLeave)
    map.on("click", LAYER_ID, handleClick)

    return () => {
      map.off("mousemove", LAYER_ID, handleMove)
      map.off("mouseleave", LAYER_ID, handleLeave)
      map.off("click", LAYER_ID, handleClick)
      if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID)
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID)
    }
  }, [map])

  // Atualiza os dados ao mudar os trechos.
  useEffect(() => {
    if (!map) return

    function update() {
      const source = map?.getSource(SOURCE_ID) as GeoJSONSource | undefined
      if (source) source.setData(toFeatureCollection(segments))
    }

    if (map.isStyleLoaded() && map.getSource(SOURCE_ID)) update()
    else map.once("load", update)
  }, [map, segments])

  return null
}
