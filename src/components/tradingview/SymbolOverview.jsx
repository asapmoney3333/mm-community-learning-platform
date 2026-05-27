import TradingViewWidget from "./TradingViewWidget"

function normalizeSymbols(symbols) {
  if (Array.isArray(symbols)) {
    return symbols.map((item) =>
      typeof item === "string" ? [item] : item,
    )
  }

  if (typeof symbols === "string") {
    return symbols
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => [item])
  }

  return [["BINANCE:BTCUSDT"], ["BINANCE:ETHUSDT"], ["BINANCE:SOLUSDT"]]
}

export default function SymbolOverview({
  symbols,
  chartOnly = false,
  colorTheme = "dark",
  locale = "en",
  autosize = true,
  height = 460,
  width = "100%",
  lineWidth = 2,
  showVolume = true,
  scalePosition = "right",
}) {
  return (
    <TradingViewWidget
      script="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"
      height={height}
      width={width}
      autosize={autosize}
      attributionLabel="Compare symbols on TradingView"
      config={{
        symbols: normalizeSymbols(symbols),
        chartOnly,
        colorTheme,
        locale,
        autosize,
        showVolume,
        lineWidth,
        scalePosition,
        support_host: "https://www.tradingview.com",
      }}
    />
  )
}
