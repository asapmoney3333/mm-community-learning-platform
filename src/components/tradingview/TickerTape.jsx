import TradingViewWidget from "./TradingViewWidget"

function normalizeSymbols(symbols) {
  if (Array.isArray(symbols)) {
    return symbols.map((item) =>
      typeof item === "string" ? { proName: item, title: item } : item,
    )
  }

  if (typeof symbols === "string") {
    return symbols
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({ proName: item, title: item }))
  }

  return [
    { proName: "BINANCE:BTCUSDT", title: "BTC/USDT" },
    { proName: "BINANCE:ETHUSDT", title: "ETH/USDT" },
    { proName: "BINANCE:SOLUSDT", title: "SOL/USDT" },
    { proName: "BINANCE:XRPUSDT", title: "XRP/USDT" },
  ]
}

export default function TickerTape({
  symbols,
  colorTheme = "dark",
  locale = "en",
  displayMode = "adaptive",
  showSymbolLogo = true,
  isTransparent = true,
}) {
  return (
    <TradingViewWidget
      script="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
      height={96}
      width="100%"
      autosize={false}
      className="bg-transparent"
      containerClassName="py-1"
      attributionLabel="Live tape powered by TradingView"
      config={{
        symbols: normalizeSymbols(symbols),
        colorTheme,
        locale,
        displayMode,
        showSymbolLogo,
        isTransparent,
      }}
    />
  )
}
