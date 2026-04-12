<template>
    <section class="milestones-section">
        <div class="section-header">
            <h2 class="section-title">Clan Milestones</h2>
            <p class="section-subtitle">Group objectives</p>
        </div>

        <div class="overall-badge panel">
            <div class="overall-left">
                <span class="overall-label">Overall</span>
                <span class="overall-pct">{{ overallPct }}%</span>
            </div>
            <div class="overall-bar-track">
                <div class="overall-bar-fill" :style="{ width: overallPct + '%' }"></div>
            </div>
            <div class="overall-completed">
                <span class="completed-num">{{ completedCount }}</span>
                <span class="completed-label">/ {{ milestones.length }} done</span>
            </div>
        </div>

        <div class="milestones-list">
            <div v-for="ms in milestones" :key="ms.key" class="milestone-card panel"
                :class="{ 'is-complete': ms.pct >= 100 }">
                <div v-if="ms.pct >= 100" class="complete-flash" aria-hidden="true"></div>

                <div class="ms-header">
                    <div class="ms-title-group">
                        <span class="ms-title"><span class="ms-progress">{{ ms.formatCurrent(ms.current) }}/{{ ms.formatGoal(ms.goal) }}</span> {{ ms.label }}</span>
                    </div>
                    <div class="ms-badge" :class="badgeClass(ms.pct)">
                        {{ ms.pct >= 100 ? 'DONE' : ms.pct + '%' }}
                    </div>
                </div>

                <div class="ms-bar-track">
                    <div class="ms-bar-fill" :class="{ 'fill-complete': ms.pct >= 100 }"
                        :style="{ width: ms.barWidth + '%' }"></div>
                    <div class="ms-tick" style="left: 25%"></div>
                    <div class="ms-tick" style="left: 50%"></div>
                    <div class="ms-tick" style="left: 75%"></div>
                </div>

                <div class="ms-footer">
                    <span class="ms-remaining" v-if="ms.pct < 100">{{ ms.formatGoal(ms.goal - ms.current) }}
                        remaining</span>
                    <span class="ms-remaining complete-text" v-else>Milestone achieved!</span>
                    <span class="ms-leader" v-if="ms.leader">#1 {{ ms.leader }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { players } from '@/stores/statsStore.js'

function clanSum(key) { return players.value.reduce((s, p) => s + (p[key] || 0), 0) }
function topPlayer(key) { return [...players.value].sort((a, b) => (b[key] || 0) - (a[key] || 0))[0]?.name }
function pct(current, goal) { return Math.min(Math.floor((current / goal) * 100), 100) }
function barWidth(current, goal) { return Math.min((current / goal) * 100, 100) }
function fmtGP(v) {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
    return v.toString()
}
function fmtNum(v) { return v.toLocaleString() }

// ── Change goals here ────────────────────────────────────────────────────────
const GOALS = {
    gpEarned: 5000000000,
    itemsReceived: 1000000,
    levelsEarned: 100000,
    petsEarned: 1,
    clogsEarned: 1,
    combatTasks: 1,
    clueScrolls: 1,
    killCount: 50000,
    leagueTasks: 1,
    leaguePoints: 1,
}
// ────────────────────────────────────────────────────────────────────────────

const milestones = computed(() => [
    { key: 'gpEarned',      label: 'GP Earned',        goal: GOALS.gpEarned,      current: clanSum('gpEarned'),      formatCurrent: fmtGP,  formatGoal: fmtGP,  pct: pct(clanSum('gpEarned'),      GOALS.gpEarned),      barWidth: barWidth(clanSum('gpEarned'),      GOALS.gpEarned),      leader: topPlayer('gpEarned') },
    { key: 'itemsReceived', label: 'Items Received',    goal: GOALS.itemsReceived, current: clanSum('itemsReceived'), formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('itemsReceived'), GOALS.itemsReceived), barWidth: barWidth(clanSum('itemsReceived'), GOALS.itemsReceived), leader: topPlayer('itemsReceived') },
    { key: 'levelsEarned',  label: 'Levels Earned',     goal: GOALS.levelsEarned,  current: clanSum('levelsEarned'),  formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('levelsEarned'),  GOALS.levelsEarned),  barWidth: barWidth(clanSum('levelsEarned'),  GOALS.levelsEarned),  leader: topPlayer('levelsEarned') },
    { key: 'petsEarned',    label: 'Pets Received',     goal: GOALS.petsEarned,    current: clanSum('petsEarned'),    formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('petsEarned'),    GOALS.petsEarned),    barWidth: barWidth(clanSum('petsEarned'),    GOALS.petsEarned),    leader: topPlayer('petsEarned') },
    { key: 'clogsEarned',   label: 'Clog Slots',        goal: GOALS.clogsEarned,   current: clanSum('clogsEarned'),   formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('clogsEarned'),   GOALS.clogsEarned),   barWidth: barWidth(clanSum('clogsEarned'),   GOALS.clogsEarned),   leader: topPlayer('clogsEarned') },
    { key: 'combatTasks',   label: 'Combat Tasks',      goal: GOALS.combatTasks,   current: clanSum('combatTasks'),   formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('combatTasks'),   GOALS.combatTasks),   barWidth: barWidth(clanSum('combatTasks'),   GOALS.combatTasks),   leader: topPlayer('combatTasks') },
    { key: 'clueScrolls',   label: 'Clue Scrolls',      goal: GOALS.clueScrolls,   current: clanSum('clueScrolls'),   formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('clueScrolls'),   GOALS.clueScrolls),   barWidth: barWidth(clanSum('clueScrolls'),   GOALS.clueScrolls),   leader: topPlayer('clueScrolls') },
    { key: 'killCount',     label: 'Bosses Killed',     goal: GOALS.killCount,     current: clanSum('killCount'),     formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('killCount'),     GOALS.killCount),     barWidth: barWidth(clanSum('killCount'),     GOALS.killCount),     leader: topPlayer('killCount') },
    { key: 'leagueTasks',   label: 'Tasks Completed',   goal: GOALS.leagueTasks,   current: clanSum('leagueTasks'),   formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('leagueTasks'),   GOALS.leagueTasks),   barWidth: barWidth(clanSum('leagueTasks'),   GOALS.leagueTasks),   leader: topPlayer('leagueTasks') },
    { key: 'leaguePoints',  label: 'League Points',     goal: GOALS.leaguePoints,  current: clanSum('leaguePoints'),  formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('leaguePoints'),  GOALS.leaguePoints),  barWidth: barWidth(clanSum('leaguePoints'),  GOALS.leaguePoints),  leader: topPlayer('leaguePoints') },
])

const completedCount = computed(() => milestones.value.filter(m => m.pct >= 100).length)
const overallPct = computed(() => Math.floor((completedCount.value / milestones.value.length) * 100))

function badgeClass(p) {
    if (p >= 100) return 'badge--complete'
    if (p >= 75) return 'badge--high'
    if (p >= 40) return 'badge--mid'
    return 'badge--low'
}


</script>

<style scoped>
.milestones-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
}

.section-title {
    font-family: 'Cinzel Decorative', 'Cinzel', serif;
    font-size: 29px;
    font-weight: 700;
    color: #ffd070;
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(255, 179, 71, 0.4);
}

.section-subtitle {
    font-size: 21px;
    color: #c8c0b8;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-style: italic;
}

.overall-badge {
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.overall-left {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.overall-label {
    font-size: 18px;
    color: #c8c0b8;
    letter-spacing: 1.5px;
    text-transform: uppercase;
}

.overall-pct {
    font-family: 'Cinzel', serif;
    font-size: 30px;
    font-weight: 700;
    color: #ff6b35;
    line-height: 1;
    text-shadow: 0 0 10px rgba(255, 107, 53, 0.4);
}

.overall-bar-track {
    flex: 1;
    height: 9px;
    background: rgba(139, 0, 0, 0.15);
    border-radius: 4px;
    border: 1px solid rgba(139, 0, 0, 0.3);
    overflow: hidden;
}

.overall-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff4500, #ffd700);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(255, 140, 0, 0.8), 0 0 20px rgba(255, 69, 0, 0.5);
    transition: width 1.2s ease;
    box-shadow: 0 0 6px rgba(255, 107, 53, 0.4);
}

.overall-completed {
    display: flex;
    align-items: baseline;
    gap: 4px;
    flex-shrink: 0;
}

.completed-num {
    font-family: 'Cinzel', serif;
    font-size: 30px;
    font-weight: 700;
    color: #ffd700;
}

.completed-label {
    font-size: 21px;
    color: #c8c0b8;
}

.milestones-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.milestone-card {
    padding: 13px 16px 11px;
    position: relative;
    box-shadow: 0 0 0 1px rgba(139, 0, 0, 0.45) inset, 0 0 22px rgba(160, 8, 8, 0.2), 0 4px 24px rgba(0, 0, 0, 0.6);
}

.milestone-card.is-complete {
    border-color: rgba(255, 215, 0, 0.35);
}

.complete-flash {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.05) 50%, transparent 100%);
    pointer-events: none;
    border-radius: inherit;
}

.ms-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
}

.ms-title-group {
    min-width: 0;
}

.ms-title {
    font-family: 'Cinzel', serif;
    font-size: 19px;
    font-weight: 700;
    color: #f0ece4;
    letter-spacing: 0.5px;
}

.is-complete .ms-title {
    color: #ffd070;
}

.ms-progress {
    color: #f0ece4;
    font-weight: 700;
    margin-right: 4px;
}

.ms-badge {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 4px 10px;
    border-radius: 3px;
    flex-shrink: 0;
}

.badge--low {
    background: rgba(139, 0, 0, 0.2);
    border: 1px solid rgba(139, 0, 0, 0.4);
    color: #c8c0b8;
}

.badge--mid {
    background: rgba(192, 57, 43, 0.2);
    border: 1px solid rgba(192, 57, 43, 0.4);
    color: #c0392b;
}

.badge--high {
    background: rgba(255, 107, 53, 0.15);
    border: 1px solid rgba(255, 107, 53, 0.4);
    color: #ff6b35;
}

.badge--complete {
    background: rgba(255, 215, 0, 0.12);
    border: 1px solid rgba(255, 215, 0, 0.5);
    color: #ffd700;
}

.ms-bar-track {
    height: 7px;
    background: rgba(139, 0, 0, 0.12);
    border-radius: 3px;
    border: 1px solid rgba(139, 0, 0, 0.2);
    overflow: visible;
    position: relative;
    margin-bottom: 9px;
}

.ms-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff4500, #ffd700);
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(255, 140, 0, 0.8), 0 0 20px rgba(255, 69, 0, 0.5);
    transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.ms-bar-fill.fill-complete {
    background: linear-gradient(90deg, #ff4500, #ffd700);
    box-shadow: 0 0 10px rgba(255, 140, 0, 0.8), 0 0 20px rgba(255, 69, 0, 0.5);
}

.ms-tick {
    position: absolute;
    top: -2px;
    width: 2px;
    height: 11px;
    background: rgba(139, 0, 0, 0.6);
    transform: translateX(-50%);
    z-index: 1;
}

.ms-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ms-remaining {
    font-size: 17px;
    color: #c8c0b8;
    font-style: italic;
}

.complete-text {
    color: #ffd070;
}

.ms-leader {
    font-size: 17px;
    color: #c8c0b8;
    font-family: 'Cinzel', serif;
}
</style>