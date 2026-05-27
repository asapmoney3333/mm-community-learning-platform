import LightweightChart from "./LightweightChart"
import { chartPresets } from "./chartPresets"

export default function SimulatorChart({
  preset = "swingReplay",
  title,
  subtitle,
  height = 480,
}) {
  const config = chartPresets[preset] ?? chartPresets.swingReplay

  return (
    <LightweightChart
      title={title ?? config.title}
      subtitle={subtitle ?? config.subtitle}
      type={config.type}
      data={config.data}
      volumeData={config.volumeData ?? []}
      markers={config.markers ?? []}
      height={height}
      showVolume
    />
  )
}
