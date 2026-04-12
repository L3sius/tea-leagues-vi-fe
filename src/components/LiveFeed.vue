<template>
    <section class="live-feed-section">
        <div class="section-header">
            <h2 class="section-title">
                <span class="title-deco">⸸</span>
                Live Feed
                <span class="title-deco">⸸</span>
            </h2>
            <div class="feed-status">
                <button class="faq-btn" @click="faqOpen = true" title="Setup guide">Setup</button>
                <span class="status-dot" :class="statusClass"></span>
                <span class="status-label">{{ statusLabel }}</span>
                <span class="event-count" v-if="connected">{{ events.length }} events</span>
            </div>
        </div>

        <div class="feed-tabs">
            <button class="feed-tab" :class="{ 'feed-tab--active': activeTab === 'live' }"
                @click="activeTab = 'live'">Live</button>
            <button class="feed-tab" :class="{ 'feed-tab--active': activeTab === 'latest' }"
                @click="activeTab = 'latest'">Latest Actions</button>
        </div>

        <!-- Live tab -->
        <div v-if="activeTab === 'live'" class="feed-container panel">
            <div class="feed-inner" v-if="events.length > 0">
                <TransitionGroup name="feed-event" tag="div" class="events-list">
                    <div v-for="event in events" :key="event.id" class="event-row"
                        :class="[`event-type--${event.type}`, { 'event--fail': !event.isSuccess }]">
                        <span class="event-time">{{ event.time }}</span>
                        <span class="event-player" :title="event.player">{{ event.player }}</span>
                        <span v-if="event.lootSource" class="event-message loot-source"
                            :class="{ 'clue-source': event.type === 'clue' }"
                            :title="event.lootItems ? `${event.lootSource} — ${event.lootItems}` : event.lootSource"
                            @mouseenter="showTooltip($event, event.lootItems)" @mouseleave="hideTooltip">
                            {{ event.lootSource }}
                        </span>
                        <span v-else class="event-message" :title="event.message">{{ event.message }}</span>
                        <span v-for="t in event.tiers" :key="t"
                            class="tier-badge"
                            :style="{ color: tierColor(t), borderColor: tierColor(t) }">
                            T{{ t }}
                        </span>
                    </div>
                </TransitionGroup>
            </div>
            <div class="feed-empty" v-else>
                <span class="empty-icon">⸸</span>
                <span class="empty-text" v-if="disconnected">Connection lost — awaiting reconnect</span>
                <span class="empty-text" v-else>Awaiting events...</span>
            </div>
            <div class="feed-fade" v-if="events.length > 0"></div>
        </div>

        <!-- Latest Actions tab -->
        <div v-else class="feed-container panel">
            <div class="feed-inner">
                <div v-if="latestList.length === 0" class="feed-empty">
                    <span class="empty-icon">⸸</span>
                    <span class="empty-text">Awaiting events...</span>
                </div>
                <div v-for="entry in latestList" :key="entry.type" class="latest-row"
                    :class="`event-type--${entry.type}`">
                    <span class="latest-type-label">{{ entry.typeLabel }}</span>
                    <div class="latest-content">
                        <span class="latest-player">{{ entry.player }}</span>
                        <span class="latest-message">{{ entry.lootSource || entry.message }}</span>
                        <span class="latest-time">{{ entry.time }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <DinkFAQ :open="faqOpen" @close="faqOpen = false" />

    <div class="loot-tooltip" v-if="tooltip.visible" :style="tooltip.style">
        {{ tooltip.text }}
    </div>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import apiService from '@/services/apiService.js'
import DinkFAQ from '@/components/DinkFAQ.vue'

const events = ref([])
const connected = ref(false)
const disconnected = ref(false)
const activeTab = ref('live')
const latest = ref({}) // { [type]: event }
const faqOpen = ref(false)
let eventSource = null
let nextId = 1

const TYPE_LABELS = {
    drop: 'Loot',
    death: 'Death',
    level: 'Level Up',
    pet: 'Pet',
    clog: 'Collection',
    combat: 'Combat Task',
    clue: 'Clue Scroll',
    kill: 'Kill Count',
}

const latestList = computed(() =>
    Object.entries(latest.value)
        .map(([type, event]) => ({ ...event, typeLabel: TYPE_LABELS[type] ?? type }))
        .sort((a, b) => TYPE_LABELS[a.type]?.localeCompare(TYPE_LABELS[b.type]))
)

const tooltip = ref({ visible: false, text: '', style: {} })

function showTooltip(e, items) {
    const rect = e.target.getBoundingClientRect()
    tooltip.value = {
        visible: true,
        text: items,
        style: {
            left: rect.left + rect.width / 2 + 'px',
            top: rect.top - 12 + 'px',
            transform: 'translateX(-50%) translateY(-100%)',
        }
    }
}

function hideTooltip() {
    tooltip.value.visible = false
}

// ── Message parser ────────────────────────────────────────────────────────────
// Message format: [TYPE] [PLAYER] rest of description
// e.g. "[LOOT] [L3sius] [Redwood Bird House] [...]"
// e.g. "[DEATH] [L3sius] L3sius has died..."

const TYPE_MAP = {
    'LOOT': 'drop',
    'DEATH': 'death',
    'LEVEL': 'level',
    'PET': 'pet',
    'CLOG': 'clog',
    'COLLECTION': 'clog',
    'COMBAT_ACHIEVEMENT': 'combat',
    'CLUE': 'clue',
    'KILL_COUNT': 'kill',
}

function stripDashes(str) {
    return str
        .split(',')
        .map(s => s.trim())
        .filter(s => !/^-+$/.test(s))
        .join(', ')
}

function parseMessage(raw, isSuccess) {
    // Remove dash-only segments from the raw string before tokenising
    raw = raw.replace(/\[-+\]/g, '').replace(/-{3,}/g, '').trim()

    const bracketRe = /\[([^\]]+)\]/g
    const tokens = []
    let match

    while ((match = bracketRe.exec(raw)) !== null) {
        tokens.push(match[1])
    }

    const rawType = tokens[0]?.toUpperCase() ?? 'INFO'
    const player = tokens[1] ?? '?'
    const mapped = TYPE_MAP[rawType] ?? 'kill'

    // LOOT: tokens[2] = source, tokens[3] = comma-separated items
    let message = ''
    let lootSource = null
    let lootItems = null

    if (rawType === 'LOOT') {
        lootSource = tokens[2] ?? 'Unknown'
        lootItems = stripDashes(tokens[3] ?? '')
        message = lootSource
    } else if (rawType === 'CLUE') {
        // Extract tier from "completed a [hard](...) clue"
        const tierMatch = raw.match(/completed a \[([^\]]+)\]/i)
        lootSource = tierMatch ? tierMatch[1].charAt(0).toUpperCase() + tierMatch[1].slice(1) : 'Clue'

        // Extract item names from markdown links: [Item name](url) preceded by "X x "
        const itemRe = /\d+ x \[([^\]]+)\]/g
        const items = []
        let m
        while ((m = itemRe.exec(raw)) !== null) {
            items.push(m[1])
        }
        lootItems = items.length > 0 ? items.join(', ') : ''
        message = lootSource
    } else if (rawType === 'DEATH') {
        const DEATH_MESSAGES = [
            'Died horribly, like a noob.',
            'Lost their hardcore status... again.',
            'Respawned in Lumbridge. Classic.',
            'The Grim Reaper sends his regards.',
            'Forgot to eat. Tragic.',
            'Paid the ultimate price for being AFK.',
            'Even the monsters felt bad about that.',
            'Death speedrun any%.',
            'Skill issue.',
            'Couldn\'t dodge a single attack.',
        ]
        message = DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)]
    } else if (rawType === 'LEVEL') {
        const skillMatch = raw.match(/levelled \[([^\]]+)\]/i)
        const levelMatch = raw.match(/to (\d+)/)
        const skill = skillMatch ? skillMatch[1] : 'a skill'
        const level = levelMatch ? levelMatch[1] : '?'
        message = `Levelled ${skill} to ${level}`
    } else if (rawType === 'COMBAT_ACHIEVEMENT') {
        const tierMatch = raw.match(/completed (\w+) combat task/i)
        const taskMatch = raw.match(/\[([^\]]+)\]\(http/i)
        const tier = tierMatch ? tierMatch[1] : 'a'
        const task = taskMatch ? taskMatch[1] : null
        message = `Completed ${tier} combat task`
        if (task) {
            lootSource = message
            lootItems = task
            message = lootSource
        }
    } else if (rawType === 'CLOG' || rawType === 'COLLECTION') {
        const itemMatch = raw.match(/\[([^\]]+)\]\(https?:\/\//)
        lootSource = 'New collection log item'
        lootItems = itemMatch ? itemMatch[1] : null
        message = lootSource
    } else if (rawType === 'KILL_COUNT') {
        // Extract monster name from first markdown link: [MonsterName](url)
        const monsterMatch = raw.match(/\[([^\]]+)\]\(https?:\/\//)
        message = monsterMatch ? `Killed ${monsterMatch[1]}` : 'Got a kill'
    } else {
        const remaining = tokens.slice(2)
        message = remaining.length > 0
            ? remaining.join(', ')
            : raw.replace(/\[[^\]]+\]/g, '').trim()
    }

    // Strip separator lines (e.g. "----------")
    message = message.replace(/^-+$/, '').trim()

    return { player, type: mapped, message, isSuccess, lootSource, lootItems }
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const TIER_COLORS = {
    1: '#314059',
    2: '#256F6C',
    3: '#08AD55',
    4: '#8FEC00',
    5: '#FFE100',
    6: '#FFB300',
    7: '#FF6314',
    8: '#FF141A',
    9: '#FF1477',
}

function tierColor(tier) { return TIER_COLORS[tier] ?? '#c8c0b8' }

function addEvent(data, prepend = true) {
    const parsed = parseMessage(data.message, data.is_success_action ?? true)
    const entry = {
        id: nextId++,
        time: formatTime(data.timestamp),
        player: parsed.player,
        type: parsed.type,
        message: parsed.message,
        isSuccess: parsed.isSuccess,
        lootSource: parsed.lootSource ?? null,
        lootItems: parsed.lootItems ?? null,
        tiers: data.tier != null ? [].concat(data.tier) : [],
    }
    // Always track the latest per type (only successful events)
    if (entry.isSuccess) {
        latest.value[entry.type] = entry
    }

    if (prepend) {
        events.value.unshift(entry)
        if (events.value.length > 500) events.value.pop()
    } else {
        events.value.push(entry)
    }
}

// ── SSE connection ────────────────────────────────────────────────────────────
function connect() {
    disconnected.value = false

    try {
        eventSource = apiService.getActionStream()
    } catch {
        disconnected.value = true
        return
    }

    const historyBuffer = []

    eventSource.addEventListener('history', (e) => {
        try {
            historyBuffer.push(JSON.parse(e.data))
        } catch { /* ignore malformed */ }
    })

    eventSource.addEventListener('action', (e) => {
        try {
            addEvent(JSON.parse(e.data), true)
        } catch { /* ignore malformed */ }
    })

    eventSource.onopen = () => {
        connected.value = true
        disconnected.value = false
        setTimeout(() => {
            // Server sends oldest→newest, reverse so newest is at top
            historyBuffer
                .sort((a, b) => b.timestamp - a.timestamp)
                .forEach(data => addEvent(data, false))
            historyBuffer.length = 0
        }, 500)
    }

    eventSource.onerror = () => {
        connected.value = false
        disconnected.value = true
        eventSource?.close()
        eventSource = null
    }
}

const statusClass = computed(() => {
    if (disconnected.value) return 'status--disconnected'
    if (connected.value) return 'status--connected'
    return 'status--connecting'
})

const statusLabel = computed(() => {
    if (disconnected.value) return 'Disconnected'
    if (connected.value) return 'Live'
    return 'Connecting...'
})

onMounted(connect)
onUnmounted(() => eventSource?.close())
</script>

<style scoped>
.live-feed-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-shrink: 0;
}

.section-title {
    font-family: 'Cinzel Decorative', 'Cinzel', serif;
    font-size: 29px;
    font-weight: 700;
    color: #ffd070;
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(255, 179, 71, 0.4);
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-deco {
    color: #8b0000;
    font-size: 18px;
    opacity: 0.8;
}

/* Status indicator */
.feed-status {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.status-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status--connected {
    background: #22c55e;
    box-shadow: 0 0 8px #22c55e;
    animation: hellPulse 2s ease-in-out infinite;
}

.status--connecting {
    background: #ff8c00;
    box-shadow: 0 0 8px #ff8c00;
    animation: hellPulse 1s ease-in-out infinite;
}

.status--disconnected {
    background: #555;
    box-shadow: none;
}

.status-label {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #c8c0b8;
}

.status--connected+.status-label {
    color: #22c55e;
}

.status--connecting+.status-label {
    color: #ff8c00;
}

.event-count {
    font-size: 13px;
    color: #c8c0b8;
    letter-spacing: 1px;
}

/* FAQ button */
.faq-btn {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #e8e0d4;
    background: rgba(139, 0, 0, 0.12);
    border: 1px solid rgba(139, 0, 0, 0.35);
    border-radius: 3px;
    padding: 4px 9px;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.faq-btn:hover {
    color: #ffd070;
    border-color: #c0392b;
    background: rgba(139, 0, 0, 0.3);
}

/* ── Feed tabs ── */
.feed-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    flex-shrink: 0;
}

.feed-tab {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #c8c0b8;
    background: rgba(18, 2, 2, 0.75);
    border: 1px solid rgba(139, 0, 0, 0.45);
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.feed-tab:hover {
    color: #ff6b35;
    border-color: #8b0000;
    background: rgba(139, 0, 0, 0.2);
}

.feed-tab--active {
    color: #ffd070;
    background: rgba(139, 0, 0, 0.35);
    border-color: #c0392b;
    box-shadow: 0 0 20px rgba(139, 0, 0, 0.45), inset 0 1px 0 rgba(255, 107, 53, 0.15);
    text-shadow: 0 0 10px rgba(255, 179, 71, 0.5);
}

/* ── Latest Actions rows ── */
.latest-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    margin: 0 8px 10px;
    border-left: 3px solid transparent;
    border-radius: 3px;
    background: rgba(139, 0, 0, 0.06);
    transition: background 0.15s;
}

.latest-row:last-child {
    margin-bottom: 0;
}

.latest-row:hover {
    background: rgba(139, 0, 0, 0.13);
}

.latest-type-label {
    font-family: 'Cinzel', serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: inherit;
    line-height: 1;
    padding-bottom: 7px;
    border-bottom: 1px solid currentColor;
    opacity: 0.9;
}

.latest-content {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.latest-player {
    font-family: 'Cinzel', serif;
    font-size: 17px;
    font-weight: 600;
    color: #ff6b35;
    flex-shrink: 0;
}

.latest-message {
    font-size: 15px;
    color: inherit;
    opacity: 0.85;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.latest-time {
    font-size: 13px;
    color: #c8c0b8;
    font-style: italic;
    flex-shrink: 0;
}

/* Feed container */
.feed-container {
    flex: 1;
    overflow: hidden;
    position: relative;
    min-height: 200px;
}

.feed-inner {
    height: 100%;
    overflow-y: auto;
    padding: 10px 14px;
    scrollbar-width: thin;
    scrollbar-color: #8b0000 transparent;
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

/* Event row */
.event-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 3px;
    border-left: 3px solid transparent;
    white-space: nowrap;
    overflow: visible;
    /* was: hidden */
    transition: background 0.15s;
    position: relative;
    /* add this */
}

.event-row:hover {
    background: rgba(139, 0, 0, 0.08);
}

/* Failed events are dimmed */
.event--fail {
    opacity: 0.45;
}

.event-type--drop {
    border-left-color: #ffd700;
    color: #ffd700;
}

.event-type--level {
    border-left-color: #38bdf8;
    color: #38bdf8;
}

.event-type--pet {
    border-left-color: #a855f7;
    color: #a855f7;
}

.event-type--death {
    border-left-color: #b42a7f;
    color: #b42a7f;
}

.event-type--clog {
    border-left-color: #2ff32f;
    color: #2ff32f;
}

.event-type--combat {
    border-left-color: #ffa500;
    color: #ffa500;
}

.event-type--clue {
    border-left-color: #b1640db7;
    color: #b1640db7;
}

.event-type--kill {
    border-left-color: #e03030;
    color: #e03030;
}

.event-time {
    font-size: 13px;
    color: #c8c0b8;
    font-style: italic;
    flex-shrink: 0;
    min-width: 72px;
}

.event-player {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    font-weight: 600;
    color: #ff6b35;
    flex-shrink: 0;
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.event-message {
    font-size: 15px;
    color: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

.tier-badge {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid currentColor;
    flex-shrink: 0;
    opacity: 0.95;
}

/* Empty / disconnected state */
.feed-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 40px;
}

.empty-icon {
    font-size: 36px;
    color: #8b0000;
    opacity: 0.4;
    animation: hellPulse 3s ease-in-out infinite;
}

.empty-text {
    font-family: 'Cinzel', serif;
    font-size: 14px;
    color: #c8c0b8;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
    font-style: italic;
}

.feed-fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: linear-gradient(to top, rgba(17, 3, 8, 0.95) 0%, transparent 100%);
    pointer-events: none;
}

.feed-event-enter-active {
    animation: slideInUp 0.3s ease;
}

.feed-event-leave-active {
    transition: opacity 0.2s;
}

.feed-event-leave-to {
    opacity: 0;
}

/* Loot source with hover tooltip */
.loot-source {
    position: relative;
    cursor: help;
    color: #ffd070;
    text-decoration: none;
}

.loot-source:hover {
    color: #ffd700;
}

.loot-tooltip {
    position: fixed;
    z-index: 9999;
    pointer-events: none;
    background: linear-gradient(160deg, rgba(25, 3, 3, 0.98) 0%, rgba(12, 1, 1, 0.98) 100%);
    border: 1px solid #8b0000;
    border-top: 1px solid rgba(255, 107, 53, 0.4);
    border-radius: 6px;
    padding: 10px 14px;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    color: #ffd070;
    white-space: normal;
    min-width: 180px;
    max-width: 300px;
    box-shadow:
        0 0 0 1px rgba(255, 60, 0, 0.08) inset,
        0 0 24px rgba(139, 0, 0, 0.6),
        0 8px 32px rgba(0, 0, 0, 0.9);
    line-height: 1.8;
    letter-spacing: 0.5px;
}

.loot-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 7px solid transparent;
    border-top-color: #8b0000;
}

.loot-source:hover .loot-tooltip {
    display: block;
}

.clue-source {
    color: #b1640db7;
    border-bottom: 1px dashed rgba(34, 197, 94, 0.4);
}

.clue-source:hover {
    color: #b1640db7;
    border-bottom-color: #b1640db7;
}
</style>