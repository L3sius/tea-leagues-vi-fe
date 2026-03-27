# 🔥 Demonic Pacts League — TEA Clan Tracker

A live tracking dashboard for TEA clan members participating in the **Demonic Pacts League** OSRS event.

## Features

- **⸸ Live Feed** — Real-time event stream of kills, drops, and GP earned (auto-refreshes with simulated events)
- **💰 GP Tracker** — Per-player gold accumulation with progress bar toward clan goal
- **⚔️ Items Tracker** — Drop counts per player + notable rare drops panel
- Demonic OSRS aesthetic — hellfire colors, gothic typography, runic ornaments

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Structure

```
src/
├── App.vue                  # Root layout (3-column grid)
├── main.js                  # App entry point
├── assets/
│   └── main.css             # Global demonic theme & CSS variables
├── components/
│   ├── SiteHeader.vue       # Logo, title, live badge
│   ├── LiveFeed.vue         # Scrolling event feed (auto-ticks every 4s)
│   ├── GpTracker.vue        # GP leaderboard + clan goal bar
│   └── ItemsTracker.vue     # Item drop counts + notable drops
└── data/
    └── mockData.js          # Placeholder data — swap with real API
```

## Connecting a Real Backend

All mock data lives in `src/data/mockData.js`. Replace with API calls:

- **Live Feed**: Poll or WebSocket your backend; push new events into the `events` ref in `LiveFeed.vue`
- **GP / Items**: Fetch player stats and update the reactive `players` ref in each component
- **Logo**: Drop your clan logo into `src/assets/` and reference it in `SiteHeader.vue`'s `.clan-sigil` area

## Theme Colors

| Variable           | Hex       | Use               |
|--------------------|-----------|-------------------|
| `--blood-red`      | `#8b0000` | Borders, accents  |
| `--crimson`        | `#c0392b` | Item bars         |
| `--ember`          | `#ff6b35` | Player names      |
| `--sulfur`         | `#ffd700` | Gold values       |
| `--soul-gold`      | `#ffb347` | Headings          |
| `--bone`           | `#d4c5a9` | Body text         |