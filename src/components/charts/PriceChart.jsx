import LightweightChart from "./LightweightChart"
import { chartPresets } from "./chartPresets"

export default function PriceChart({
  preset = "btcSwing",
  title,
  subtitle,
  height = 440,
  showVolume,
  zones,
  lines,
  labels,
  levels,
  indicators,
}) {
  const config = chartPresets[preset] ?? chartPresets.btcSwing

  return (
    <LightweightChart
      title={title ?? config.title}
      subtitle={subtitle ?? config.subtitle}
      type={config.type}
      data={config.data}
      volumeData={config.volumeData ?? []}
      markers={config.markers ?? []}
      zones={zones ?? config.zones ?? []}
      lines={lines ?? config.lines ?? []}
      labels={labels ?? config.labels ?? []}
      levels={levels ?? config.levels ?? []}
      indicators={indicators ?? config.indicators ?? []}
      height={height}
      showVolume={showVolume ?? Boolean(config.volumeData?.length)}
    />
  )
}
