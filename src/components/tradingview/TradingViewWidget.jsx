import { useEffect, useId, useRef } from "react"

function toPixelValue(value, fallback) {
  if (typeof value === "number") {
    return `${value}px`
  }

  return value ?? fallback
}

function TradingViewWidget({
  script,
  config,
  height = 520,
  width = "100%",
  autosize = true,
  className = "",
  containerClassName = "",
  attributionLabel = "Track markets on TradingView",
}) {
  const instanceId = useId().replace(/:/g, "")
  const rootRef = useRef(null)

  useEffect(() => {
    if (!rootRef.current) return undefined

    const widgetHost = rootRef.current.querySelector(
      ".tradingview-widget-container__widget",
    )

    if (!widgetHost) return undefined

    widgetHost.innerHTML = ""

    const nextConfig = {
      ...config,
      autosize,
    }

    if (!autosize) {
      nextConfig.width = toPixelValue(width, "100%")
      nextConfig.height = toPixelValue(height, "520px")
    }

    const scriptTag = document.createElement("script")
    scriptTag.src = script
    scriptTag.type = "text/javascript"
    scriptTag.async = true
    scriptTag.innerHTML = JSON.stringify(nextConfig)

    widgetHost.appendChild(scriptTag)

    return () => {
      widgetHost.innerHTML = ""
    }
  }, [autosize, config, height, script, width])

  return (
    <div
      ref={rootRef}
      className={`tradingview-widget-container overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70 shadow-[0_20px_60px_rgba(0,0,0,0.22)] ${className}`.trim()}
      style={{
        width: toPixelValue(width, "100%"),
        minHeight: autosize ? toPixelValue(height, "520px") : undefined,
      }}
    >
      <div
        id={`tradingview_${instanceId}`}
        className={`tradingview-widget-container__widget ${containerClassName}`.trim()}
        style={{
          height: autosize ? "100%" : toPixelValue(height, "520px"),
          width: autosize ? "100%" : toPixelValue(width, "100%"),
        }}
      />
      <div className="border-t border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
        <a
          href="https://www.tradingview.com/"
          rel="noreferrer"
          target="_blank"
          className="transition hover:text-cyan-300"
        >
          {attributionLabel}
        </a>
      </div>
    </div>
  )
}

export default TradingViewWidget
