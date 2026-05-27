import TradingViewWidget from "./TradingViewWidget"

export default function AdvancedChart({
  symbol = "BINANCE:BTCUSDT",
  interval = "240",
  theme = "dark",
  timezone = "Etc/UTC",
  locale = "en",
  studies = ["STD;RSI"],
  hideTopToolbar = false,
  hideSideToolbar = false,
  allowSymbolChange = true,
  saveImage = true,
  calendar = false,
  details = true,
  hotlist = true,
  news = true,
  withdateranges = true,
  style = "1",
  height = 560,
  width = "100%",
  autosize = true,
}) {
  return (
    <TradingViewWidget
      script="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      height={height}
      width={width}
      autosize={autosize}
      attributionLabel={`Open ${symbol} in TradingView`}
      config={{
        symbol,
        interval,
        theme,
        timezone,
        locale,
        style,
        withdateranges,
        hide_top_toolbar: hideTopToolbar,
        hide_side_toolbar: hideSideToolbar,
        allow_symbol_change: allowSymbolChange,
        save_image: saveImage,
        calendar,
        details,
        hotlist,
        news,
        studies,
        support_host: "https://www.tradingview.com",
      }}
    />
  )
}
