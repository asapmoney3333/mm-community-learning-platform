const btcSwingCandles = [
  { time: "2026-05-01", open: 94200, high: 95640, low: 93520, close: 95110 },
  { time: "2026-05-02", open: 95110, high: 96820, low: 94800, close: 96440 },
  { time: "2026-05-03", open: 96440, high: 97160, low: 95260, close: 95890 },
  { time: "2026-05-04", open: 95890, high: 96610, low: 94480, close: 94720 },
  { time: "2026-05-05", open: 94720, high: 95250, low: 93110, close: 93640 },
  { time: "2026-05-06", open: 93640, high: 94890, low: 92880, close: 94420 },
  { time: "2026-05-07", open: 94420, high: 96230, low: 94120, close: 95810 },
  { time: "2026-05-08", open: 95810, high: 97450, low: 95380, close: 97060 },
  { time: "2026-05-09", open: 97060, high: 97920, low: 96150, close: 96530 },
  { time: "2026-05-10", open: 96530, high: 97200, low: 95140, close: 95480 },
  { time: "2026-05-11", open: 95480, high: 96010, low: 93860, close: 94290 },
  { time: "2026-05-12", open: 94290, high: 95240, low: 93450, close: 94960 },
  { time: "2026-05-13", open: 94960, high: 96770, low: 94620, close: 96390 },
  { time: "2026-05-14", open: 96390, high: 98180, low: 95940, close: 97820 },
  { time: "2026-05-15", open: 97820, high: 98740, low: 96980, close: 97430 },
  { time: "2026-05-16", open: 97430, high: 97920, low: 96110, close: 96520 },
  { time: "2026-05-17", open: 96520, high: 97260, low: 95230, close: 95680 },
  { time: "2026-05-18", open: 95680, high: 96890, low: 95060, close: 96410 },
  { time: "2026-05-19", open: 96410, high: 98310, low: 96150, close: 97940 },
  { time: "2026-05-20", open: 97940, high: 99480, low: 97330, close: 99010 },
]

function buildVolumeData(candles) {
  return candles.map((candle, index) => ({
    time: candle.time,
    value: 820 + index * 75,
    color: candle.close >= candle.open ? "rgba(34,197,94,0.55)" : "rgba(248,113,113,0.55)",
  }))
}

function buildLineData(candles) {
  return candles.map(({ time, close }) => ({ time, value: close }))
}

export const chartPresets = {
  btcSwing: {
    title: "BTC/USDT Daily Structure",
    subtitle: "Sample candlestick data for lessons and chart walkthroughs.",
    type: "candlestick",
    data: btcSwingCandles,
    volumeData: buildVolumeData(btcSwingCandles),
    zones: [
      {
        from: "2026-05-05",
        to: "2026-05-12",
        low: 93100,
        high: 94600,
        color: "rgba(34,197,94,0.16)",
        borderColor: "rgba(34,197,94,0.55)",
        label: "Support zone",
      },
      {
        from: "2026-05-14",
        to: "2026-05-20",
        low: 97800,
        high: 99250,
        color: "rgba(249,115,22,0.16)",
        borderColor: "rgba(249,115,22,0.55)",
        label: "Resistance zone",
      },
    ],
    lines: [
      {
        from: "2026-05-06",
        to: "2026-05-19",
        price1: 94420,
        price2: 97940,
        color: "#38bdf8",
        label: "Trend line",
      },
    ],
    labels: [
      {
        time: "2026-05-14",
        price: 98180,
        text: "Range breakout",
      },
    ],
    levels: [
      {
        price: 95000,
        color: "#94a3b8",
        lineStyle: "dashed",
        label: "Pivot",
      },
      {
        price: 98000,
        color: "#f97316",
        lineStyle: "dotted",
        label: "Resistance",
      },
    ],
    indicators: [
      {
        type: "sma",
        length: 5,
        color: "#facc15",
        label: "SMA 5",
      },
      {
        type: "ema",
        length: 9,
        color: "#a78bfa",
        label: "EMA 9",
      },
      {
        type: "rsi",
        length: 14,
        color: "#38bdf8",
        label: "RSI 14",
      },
    ],
    markers: [
      {
        time: "2026-05-05",
        position: "belowBar",
        color: "#22c55e",
        shape: "arrowUp",
        text: "Demand",
      },
      {
        time: "2026-05-14",
        position: "aboveBar",
        color: "#f97316",
        shape: "circle",
        text: "Breakout",
      },
      {
        time: "2026-05-20",
        position: "aboveBar",
        color: "#38bdf8",
        shape: "square",
        text: "Retest high",
      },
    ],
  },
  swingReplay: {
    title: "Practice Trade Replay",
    subtitle: "A simulator-ready view with entry and exit markers.",
    type: "candlestick",
    data: btcSwingCandles,
    volumeData: buildVolumeData(btcSwingCandles),
    zones: [
      {
        from: "2026-05-05",
        to: "2026-05-09",
        low: 93100,
        high: 94600,
        color: "rgba(59,130,246,0.16)",
        borderColor: "rgba(59,130,246,0.52)",
        label: "Entry area",
      },
    ],
    lines: [
      {
        from: "2026-05-07",
        to: "2026-05-14",
        price1: 95810,
        price2: 97820,
        color: "#22c55e",
        label: "Trade path",
      },
    ],
    indicators: [
      {
        type: "ema",
        length: 9,
        color: "#f59e0b",
        label: "EMA 9",
      },
      {
        type: "rsi",
        length: 14,
        color: "#60a5fa",
        label: "RSI 14",
      },
    ],
    markers: [
      {
        time: "2026-05-07",
        position: "belowBar",
        color: "#22c55e",
        shape: "arrowUp",
        text: "Entry",
      },
      {
        time: "2026-05-10",
        position: "aboveBar",
        color: "#f59e0b",
        shape: "circle",
        text: "Manage risk",
      },
      {
        time: "2026-05-14",
        position: "aboveBar",
        color: "#ef4444",
        shape: "arrowDown",
        text: "Take profit",
      },
    ],
  },
  btcTrend: {
    title: "BTC Closing Trend",
    subtitle: "Line view for quick trend explanation in MDX.",
    type: "line",
    data: buildLineData(btcSwingCandles),
    levels: [
      {
        price: 96000,
        color: "#38bdf8",
        lineStyle: "dashed",
        label: "Trend pivot",
      },
    ],
    indicators: [
      {
        type: "sma",
        length: 5,
        color: "#f97316",
        label: "SMA 5",
      },
    ],
    markers: [
      {
        time: "2026-05-14",
        position: "aboveBar",
        color: "#38bdf8",
        shape: "circle",
        text: "Momentum",
      },
    ],
  },
}
