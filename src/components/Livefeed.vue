<template>
    <section class="live-feed-section">
        <div class="section-header">
            <div class="section-title-group">
                <h2 class="section-title">
                    <span class="title-deco">⸸</span>
                    Live Feed
                    <span class="title-deco">⸸</span>
                </h2>
            </div>
            <div class="feed-controls">
                <span class="event-count">{{ events.length }} events</span>
            </div>
        </div>

        <div class="feed-container panel" ref="feedContainer">
            <div class="feed-inner">
                <TransitionGroup name="feed-event" tag="div" class="events-list">
                    <div v-for="event in displayedEvents" :key="event.id" class="event-row"
                        :class="`event-type--${event.type}`">
                        <span class="event-time">{{ event.time }}</span>
                        <span class="event-player">{{ event.player }}</span>
                        <span class="event-message">{{ event.message }}</span>
                        <span v-if="event.value" class="event-value">{{ formatGP(event.value) }}</span>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { LIVE_FEED_EVENTS } from '@/data/mockData.js'

const paused = ref(false)
const events = ref([...LIVE_FEED_EVENTS])
const maxShown = 50

const displayedEvents = computed(() => events.value.slice(0, maxShown))

const NEW_EVENT_TEMPLATES = [
    { type: 'drop', messages: ['received Uncut Onyx', 'found Ranger Boots', 'looted Dark Bow'] },
    { type: 'gp', messages: ['earned 1.4M from CoX', 'collected 3.2M from ToB', 'banked 850K'] },
    { type: 'kill', messages: ['killed Thermonuclear Smoke Devil', 'slew Nightmare', 'cleared Chambers of Xeric'] },
    { type: 'level', messages: ['reached 99 Slayer', 'levelled up Strength', 'hit 99 Ranged'] },
    { type: 'pet', messages: ['received Chompy chick', 'got Heron pet', 'unlocked Rocky pet'] },
    { type: 'death', messages: ['died to Vorkath', 'killed by Cerberus', 'lost a fight at Zulrah'] },
    { type: 'clog', messages: ['new collection log slot', 'added Bandos item to clog', 'updated collection log'] },
    { type: 'combat', messages: ['completed Elite Combat Task', 'finished Hard Combat Task', 'unlocked combat achievement'] },
    { type: 'clue', messages: ['completed Master Clue', 'finished Hard Clue Scroll', 'opened Elite Clue reward'] },
]

const PLAYERS = ['HellWalker', 'DemonSlayer99', 'BoneCrusherX', 'SoulReaper_VII', 'AbyssWarden', 'RuneWitch666']

let timer = null
let nextId = LIVE_FEED_EVENTS.length + 1

function spawnEvent() {
    if (paused.value) return
    const tmpl = NEW_EVENT_TEMPLATES[Math.floor(Math.random() * NEW_EVENT_TEMPLATES.length)]
    const msg = tmpl.messages[Math.floor(Math.random() * tmpl.messages.length)]
    const player = PLAYERS[Math.floor(Math.random() * PLAYERS.length)]
    const value = tmpl.type === 'gp' ? Math.floor(Math.random() * 8_000_000) + 500_000
        : tmpl.type === 'drop' ? Math.floor(Math.random() * 20_000_000) + 200_000
            : null
    events.value.unshift({ id: nextId++, player, type: tmpl.type, message: msg, value, time: 'just now' })
    if (events.value.length > 200) events.value.pop()
}

function formatGP(val) {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M gp`
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K gp`
    return `${val} gp`
}

onMounted(() => { timer = setInterval(spawnEvent, 4000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.live-feed-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
    /* height: 100%; */
}

.section-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.section-title {
    font-family: var(--font-heading);
    font-size: 24px;
    font-weight: 700;
    color: var(--soul-gold);
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(255, 179, 71, 0.4);
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-deco {
    color: var(--blood-red);
    font-size: 18px;
    opacity: 0.8;
}

.section-subtitle {
    font-size: 14px;
    color: var(--ash);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 4px;
    font-style: italic;
}

.feed-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.control-btn {
    background: rgba(139, 0, 0, 0.2);
    border: 1px solid rgba(139, 0, 0, 0.5);
    color: var(--ash);
    font-family: var(--font-subhead);
    font-size: 14px;
    letter-spacing: 1px;
    padding: 6px 16px;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
}

.control-btn:hover,
.control-btn.active {
    background: rgba(139, 0, 0, 0.4);
    border-color: var(--blood-red);
    color: var(--ember);
}

.event-count {
    font-size: 13px;
    color: var(--ash);
    letter-spacing: 1px;
}

.feed-container {
    flex: 1;
    overflow: hidden;
    position: relative;
}

.feed-inner {
    height: 100%;
    overflow-y: auto;
    padding: 10px 14px;
    scrollbar-width: thin;
    scrollbar-color: var(--blood-red) transparent;
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.event-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 3px;
    border-left: 3px solid transparent;
    white-space: nowrap;
    overflow: hidden;
    transition: background 0.15s;
}

.event-row:hover {
    background: rgba(139, 0, 0, 0.08);
}

.event-type--drop {
    border-left-color: var(--sulfur);
}

.event-type--gp {
    border-left-color: var(--soul-gold);
}

.event-type--kill {
    border-left-color: var(--crimson);
}

.event-type--level {
    border-left-color: var(--ember);
}

.event-type--pet {
    border-left-color: #a855f7;
}

.event-type--death {
    border-left-color: #555;
}

.event-type--clog {
    border-left-color: #3b82f6;
}

.event-type--combat {
    border-left-color: var(--brimstone);
}

.event-type--clue {
    border-left-color: #22c55e;
}

.event-time {
    font-size: 13px;
    color: var(--ash);
    font-style: italic;
    flex-shrink: 0;
    min-width: 58px;
}

.event-player {
    font-family: var(--font-subhead);
    font-size: 14px;
    font-weight: 600;
    color: var(--ember);
    flex-shrink: 0;
}

.event-message {
    font-size: 14px;
    color: var(--parchment);
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

.event-value {
    font-family: var(--font-subhead);
    font-size: 13px;
    color: var(--soul-gold);
    flex-shrink: 0;
    margin-left: auto;
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
</style>