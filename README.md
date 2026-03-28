# TEA Clan — Leagues Dashboard

A live tracking dashboard for TEA clan members participating in the **Demonic Pacts** OSRS Leagues event. Displays real-time clan stats, league point hiscores, and milestone progress — all in a hellfire gothic aesthetic.

---

## Features

- **Live Feed** — Real-time event stream of drops, kills, levels, pets and GP earned via SSE
- **Stat Trackers** — Per-player breakdown of GP, items, levels, pets, deaths, clogs, combat tasks and clue scrolls
- **League Points** — Hiscores table with rank-tier coloring (Bronze → Dragon) pulled from the OSRS API
- **Milestones** — Clan-wide progress bars toward configurable goals with live percentage tracking

---

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- A running instance of the TEA backend (provides `/getTeams`, `/getPlayerStats`, `/getStatsStream`, `/getActionStream`)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Type-check + production build
npm run build

# Preview the production build locally
npm run preview

# Format source files with Prettier
npm run format
```

---

## Backend Connection

The frontend expects a backend running at `http://localhost:3000` by default. Override this with an environment variable:

```bash
# .env.local
VITE_API_BASE_URL=http://your-backend-host:3000
```

The following endpoints are consumed:

| Endpoint | Type | Description |
|---|---|---|
| `GET /getTeams` | REST | Returns all teams and their player rosters |
| `GET /getPlayerStats` | REST | Returns full player stat snapshots |
| `GET /getStatsStream` | SSE | Streams `history` and `stats` events with live clan data |
| `GET /getActionStream` | SSE | Streams live feed events (drops, kills, levels, etc.) |

### OSRS Hiscores Proxy

The dev server proxies OSRS hiscore requests to avoid CORS issues. This is already configured in `vite.config.ts` — no extra setup needed in development:

```
/api/hiscores?player=<name>
  → https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=<name>
```

> The hiscore fetching is currently rate-limited to one request per player every 10 minutes. The fetch calls are commented out by default — enable them in `LeaguePoints.vue` when ready.

---

## Project Structure

```
src/
├── App.vue                   # Root layout — two side panels over a video background
├── main.js                   # App entry, mounts Vue
├── assets/
│   └── main.css              # Global theme: CSS variables, panel styles, typography
├── components/
│   ├── LiveFeed.vue           # Scrolling real-time event feed (left panel)
│   ├── StatTrackers.vue       # Expandable per-player stat rows (right panel)
│   ├── LeaguePoints.vue       # OSRS hiscores table with rank-tier row coloring
│   └── Milestones.vue         # Clan goal progress bars
├── data/
│   └── mockData.js            # Leftover mock data — no longer used in main flow
├── services/
│   └── apiService.js          # Fetch wrappers for all backend endpoints
└── stores/
    └── StatsStore.js          # Global reactive state: player list, SSE connection
```

---

## Configuration

### Milestone Goals

All milestone targets are defined in a single `GOALS` object at the top of `Milestones.vue`. Change a value there and the label, progress bar, and remaining count update automatically:

```js
const GOALS = {
    gpEarned:      10_000_000_000,
    itemsReceived: 10_000_000,
    levelsEarned:  10_000,
    petsEarned:    10,
    clogsEarned:   10_000,
    combatTasks:   1_000,
    clueScrolls:   10_000,
}
```

### League Point Rank Tiers

Rank thresholds and their row colors are defined in `RANK_TIERS` in `LeaguePoints.vue`:

```js
const RANK_TIERS = [
    { min: 60000, name: 'Dragon',  cls: 'rank-dragon'  },
    { min: 45000, name: 'Rune',    cls: 'rank-rune'    },
    { min: 30000, name: 'Adamant', cls: 'rank-adamant' },
    { min: 20000, name: 'Mithril', cls: 'rank-mithril' },
    { min: 10000, name: 'Steel',   cls: 'rank-steel'   },
    { min:  4000, name: 'Iron',    cls: 'rank-iron'    },
    { min:  2000, name: 'Bronze',  cls: 'rank-bronze'  },
]
```

---

## Theme

All colors are CSS variables defined in `src/assets/main.css`:

| Variable        | Hex       | Use                        |
|-----------------|-----------|----------------------------|
| `--blood-red`   | `#8b0000` | Borders, accents           |
| `--crimson`     | `#c0392b` | Bars, highlights           |
| `--ember`       | `#ff6b35` | Active elements, glow      |
| `--sulfur`      | `#ffd700` | Gold values, complete bars |
| `--soul-gold`   | `#ffb347` | Section headings           |
| `--bone`        | `#d4c5a9` | Body text                  |
| `--ash`         | `#8a8070` | Muted / secondary text     |
