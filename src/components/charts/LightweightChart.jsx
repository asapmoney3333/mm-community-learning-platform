import { useEffect, useRef, useState } from "react"
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  createSeriesMarkers,
  HistogramSeries,
  LineSeries,
  LineStyle,
} from "lightweight-charts"

const seriesTypes = {
  area: AreaSeries,
  candlestick: CandlestickSeries,
  line: LineSeries,
}

const lineStyles = {
  solid: LineStyle.Solid,
  dotted: LineStyle.Dotted,
  dashed: LineStyle.Dashed,
  largeDashed: LineStyle.LargeDashed,
  sparseDotted: LineStyle.SparseDotted,
}

function getCloseValue(point) {
  if (typeof point?.close === "number") return point.close
  if (typeof point?.value === "number") return point.value
  return null
}

function calculateSma(data, length) {
  if (!length || length < 1) return []

  const result = []

  for (let index = 0; index < data.length; index += 1) {
    if (index < length - 1) continue

    let sum = 0
    let valid = true

    for (let offset = index - length + 1; offset <= index; offset += 1) {
      const value = getCloseValue(data[offset])

      if (value === null) {
        valid = false
        break
      }

      sum += value
    }

    if (valid) {
      result.push({
        time: data[index].time,
        value: sum / length,
      })
    }
  }

  return result
}

function calculateEma(data, length) {
  if (!length || length < 1) return []

  const multiplier = 2 / (length + 1)
  const result = []
  let previous = null

  data.forEach((point, index) => {
    const close = getCloseValue(point)

    if (close === null) return

    if (previous === null) {
      if (index < length - 1) return

      let seedSum = 0

      for (let seedIndex = index - length + 1; seedIndex <= index; seedIndex += 1) {
        seedSum += getCloseValue(data[seedIndex]) ?? 0
      }

      previous = seedSum / length
    } else {
      previous = close * multiplier + previous * (1 - multiplier)
    }

    result.push({
      time: point.time,
      value: previous,
    })
  })

  return result
}

function calculateRsi(data, length) {
  if (!length || length < 2 || data.length <= length) return []

  const closes = data
    .map((point) => ({ time: point.time, close: getCloseValue(point) }))
    .filter((point) => point.close !== null)

  if (closes.length <= length) return []

  let gainSum = 0
  let lossSum = 0

  for (let index = 1; index <= length; index += 1) {
    const change = closes[index].close - closes[index - 1].close
    gainSum += Math.max(change, 0)
    lossSum += Math.max(-change, 0)
  }

  let averageGain = gainSum / length
  let averageLoss = lossSum / length
  const result = []

  for (let index = length; index < closes.length; index += 1) {
    if (index > length) {
      const change = closes[index].close - closes[index - 1].close
      const gain = Math.max(change, 0)
      const loss = Math.max(-change, 0)
      averageGain = (averageGain * (length - 1) + gain) / length
      averageLoss = (averageLoss * (length - 1) + loss) / length
    }

    const rs = averageLoss === 0 ? 100 : averageGain / averageLoss
    const rsi = averageLoss === 0 ? 100 : 100 - 100 / (1 + rs)

    result.push({
      time: closes[index].time,
      value: Number(rsi.toFixed(2)),
    })
  }

  return result
}

function toLineStyle(style) {
  return lineStyles[style] ?? LineStyle.Solid
}

function createMainSeries(chart, type) {
  const seriesType = seriesTypes[type] ?? CandlestickSeries

  if (seriesType === CandlestickSeries) {
    return chart.addSeries(seriesType, {
      upColor: "#22c55e",
      downColor: "#f87171",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#f87171",
      priceLineColor: "#38bdf8",
    })
  }

  if (seriesType === AreaSeries) {
    return chart.addSeries(seriesType, {
      lineColor: "#38bdf8",
      topColor: "rgba(56, 189, 248, 0.35)",
      bottomColor: "rgba(56, 189, 248, 0.03)",
      lineWidth: 3,
      priceLineColor: "#38bdf8",
    })
  }

  return chart.addSeries(seriesType, {
    color: "#38bdf8",
    lineWidth: 3,
    priceLineColor: "#38bdf8",
  })
}

function createOverlayElements({ chart, series, zones, lines, labels }) {
  const overlayZones = zones
    .map((zone, index) => {
      const x1 = chart.timeScale().timeToCoordinate(zone.from)
      const x2 = chart.timeScale().timeToCoordinate(zone.to)
      const y1 = series.priceToCoordinate(zone.high)
      const y2 = series.priceToCoordinate(zone.low)

      if ([x1, x2, y1, y2].some((value) => value === null)) {
        return null
      }

      const left = Math.min(x1, x2)
      const top = Math.min(y1, y2)
      const width = Math.max(Math.abs(x2 - x1), 2)
      const height = Math.max(Math.abs(y2 - y1), 2)

      return {
        key: `zone-${index}`,
        left,
        top,
        width,
        height,
        color: zone.color ?? "rgba(56,189,248,0.14)",
        borderColor: zone.borderColor ?? "rgba(56,189,248,0.55)",
        label: zone.label ?? "",
      }
    })
    .filter(Boolean)

  const overlayLines = lines
    .map((line, index) => {
      const x1 = chart.timeScale().timeToCoordinate(line.from)
      const x2 = chart.timeScale().timeToCoordinate(line.to)
      const y1 = series.priceToCoordinate(line.price1)
      const y2 = series.priceToCoordinate(line.price2 ?? line.price1)

      if ([x1, x2, y1, y2].some((value) => value === null)) {
        return null
      }

      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
      const length = Math.hypot(x2 - x1, y2 - y1)

      return {
        key: `line-${index}`,
        left: x1,
        top: y1,
        width: Math.max(length, 2),
        angle,
        color: line.color ?? "#f59e0b",
        label: line.label ?? "",
      }
    })
    .filter(Boolean)

  const overlayLabels = labels
    .map((label, index) => {
      const x = chart.timeScale().timeToCoordinate(label.time)
      const y = series.priceToCoordinate(label.price)

      if (x === null || y === null) {
        return null
      }

      return {
        key: `label-${index}`,
        left: x,
        top: y,
        text: label.text,
        color: label.color ?? "#e2e8f0",
        background: label.background ?? "rgba(15,23,42,0.88)",
      }
    })
    .filter(Boolean)

  return {
    zones: overlayZones,
    lines: overlayLines,
    labels: overlayLabels,
  }
}

function addPriceLevels(series, levels) {
  return levels.map((level) =>
    series.createPriceLine({
      price: level.price,
      color: level.color ?? "#38bdf8",
      lineWidth: level.lineWidth ?? 2,
      lineStyle: toLineStyle(level.lineStyle),
      axisLabelVisible: level.axisLabelVisible ?? true,
      title: level.label ?? "",
    }),
  )
}

function addIndicators({ chart, mainSeries, data, indicators, showVolume }) {
  const cleanup = []
  let nextPaneIndex = showVolume ? 2 : 1

  indicators.forEach((indicator) => {
    const baseColor = indicator.color ?? "#f8fafc"
    const lineWidth = indicator.lineWidth ?? 2
    const sourceData = indicator.data ?? data

    if (indicator.type === "sma") {
      const series = chart.addSeries(LineSeries, {
        color: baseColor,
        lineWidth,
        title: indicator.label ?? `SMA ${indicator.length}`,
        lastValueVisible: false,
        priceLineVisible: false,
      })

      series.setData(calculateSma(sourceData, indicator.length ?? 20))
      cleanup.push(() => chart.removeSeries(series))
      return
    }

    if (indicator.type === "ema") {
      const series = chart.addSeries(LineSeries, {
        color: baseColor,
        lineWidth,
        title: indicator.label ?? `EMA ${indicator.length}`,
        lastValueVisible: false,
        priceLineVisible: false,
      })

      series.setData(calculateEma(sourceData, indicator.length ?? 20))
      cleanup.push(() => chart.removeSeries(series))
      return
    }

    if (indicator.type === "rsi") {
      const paneIndex = indicator.paneIndex ?? nextPaneIndex
      const series = chart.addSeries(
        LineSeries,
        {
          color: baseColor,
          lineWidth,
          title: indicator.label ?? `RSI ${indicator.length}`,
          lastValueVisible: false,
          priceLineVisible: false,
        },
        paneIndex,
      )

      series.setData(calculateRsi(sourceData, indicator.length ?? 14))
      series.priceScale().applyOptions({
        autoScale: false,
        scaleMargins: {
          top: 0.15,
          bottom: 0.15,
        },
      })

      const priceLines = [
        series.createPriceLine({
          price: indicator.upper ?? 70,
          color: "rgba(248,113,113,0.7)",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "Overbought",
        }),
        series.createPriceLine({
          price: indicator.lower ?? 30,
          color: "rgba(34,197,94,0.7)",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "Oversold",
        }),
      ]

      cleanup.push(() => {
        priceLines.forEach((priceLine) => series.removePriceLine(priceLine))
        chart.removeSeries(series)
      })
      nextPaneIndex = Math.max(nextPaneIndex, paneIndex + 1)
    }
  })

  return cleanup
}

export default function LightweightChart({
  title,
  subtitle,
  type = "candlestick",
  data = [],
  volumeData = [],
  markers = [],
  zones = [],
  lines = [],
  labels = [],
  levels = [],
  indicators = [],
  height = 440,
  showVolume = true,
}) {
  const containerRef = useRef(null)
  const [overlayState, setOverlayState] = useState({
    zones: [],
    lines: [],
    labels: [],
  })

  useEffect(() => {
    if (!containerRef.current) return undefined

    const container = containerRef.current
    const chart = createChart(container, {
      width: container.clientWidth || 640,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#cbd5e1",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.08)" },
        horzLines: { color: "rgba(148, 163, 184, 0.08)" },
      },
      rightPriceScale: {
        borderColor: "rgba(148, 163, 184, 0.18)",
      },
      timeScale: {
        borderColor: "rgba(148, 163, 184, 0.18)",
        timeVisible: false,
      },
      crosshair: {
        vertLine: {
          color: "rgba(56, 189, 248, 0.28)",
        },
        horzLine: {
          color: "rgba(56, 189, 248, 0.28)",
        },
      },
    })

    const mainSeries = createMainSeries(chart, type)
    mainSeries.setData(data)

    let markersPlugin = null
    if (markers.length > 0) {
      markersPlugin = createSeriesMarkers(mainSeries, markers)
    }

    let volumeSeries = null
    if (showVolume && volumeData.length > 0) {
      volumeSeries = chart.addSeries(
        HistogramSeries,
        {
          priceFormat: {
            type: "volume",
          },
          priceScaleId: "",
        },
        1,
      )

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0,
        },
      })
      volumeSeries.setData(volumeData)
    }

    const indicatorCleanup = addIndicators({
      chart,
      mainSeries,
      data,
      indicators,
      showVolume: showVolume && volumeData.length > 0,
    })
    const priceLines = addPriceLevels(mainSeries, levels)

    const syncOverlays = () => {
      setOverlayState(
        createOverlayElements({
          chart,
          series: mainSeries,
          zones,
          lines,
          labels,
        }),
      )
    }

    chart.timeScale().fitContent()
    syncOverlays()

    const resizeObserver = new ResizeObserver(() => {
      chart.resize(container.clientWidth || 640, height)
      syncOverlays()
    })

    const handleVisibleRangeChange = () => {
      syncOverlays()
    }

    resizeObserver.observe(container)
    chart.timeScale().subscribeVisibleTimeRangeChange(handleVisibleRangeChange)

    return () => {
      resizeObserver.disconnect()
      chart.timeScale().unsubscribeVisibleTimeRangeChange(handleVisibleRangeChange)
      priceLines.forEach((priceLine) => mainSeries.removePriceLine(priceLine))
      indicatorCleanup.forEach((clean) => clean())
      if (markersPlugin) {
        markersPlugin.setMarkers([])
      }
      if (volumeSeries) {
        chart.removeSeries(volumeSeries)
      }
      chart.remove()
    }
  }, [
    data,
    height,
    indicators,
    labels,
    levels,
    lines,
    markers,
    showVolume,
    type,
    volumeData,
    zones,
  ])

  return (
    <section className="my-8 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
      {(title || subtitle) ? (
        <div className="border-b border-white/10 px-5 py-4">
          {title ? (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          ) : null}
          {subtitle ? (
            <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>
          ) : null}
        </div>
      ) : null}

      <div className="p-3 sm:p-4">
        <div className="relative w-full">
          <div ref={containerRef} className="w-full" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {overlayState.zones.map((zone) => (
              <div
                key={zone.key}
                className="absolute rounded-md border"
                style={{
                  left: zone.left,
                  top: zone.top,
                  width: zone.width,
                  height: zone.height,
                  backgroundColor: zone.color,
                  borderColor: zone.borderColor,
                }}
              >
                {zone.label ? (
                  <span className="absolute left-2 top-2 rounded-full bg-slate-950/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                    {zone.label}
                  </span>
                ) : null}
              </div>
            ))}

            {overlayState.lines.map((line) => (
              <div
                key={line.key}
                className="absolute origin-left"
                style={{
                  left: line.left,
                  top: line.top,
                  width: line.width,
                  height: 2,
                  backgroundColor: line.color,
                  transform: `rotate(${line.angle}deg)`,
                }}
              >
                {line.label ? (
                  <span
                    className="absolute -top-6 right-0 rounded-full bg-slate-950/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
                    style={{ border: `1px solid ${line.color}` }}
                  >
                    {line.label}
                  </span>
                ) : null}
              </div>
            ))}

            {overlayState.labels.map((label) => (
              <div
                key={label.key}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium"
                style={{
                  left: label.left,
                  top: label.top,
                  color: label.color,
                  backgroundColor: label.background,
                }}
              >
                {label.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
        <a
          href="https://www.tradingview.com/"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-cyan-300"
        >
          Charting by TradingView Lightweight Charts
        </a>
      </div>
    </section>
  )
}
