<template>
  <video class="bg-video" src="/bg.webm" autoplay loop muted playsinline></video>
  <div class="bg-overlay"></div>

  <div class="side-layout">

    <!-- LEFT: Live Feed -->
    <aside class="side-panel side-left">
      <LiveFeed />
    </aside>

    <!-- MIDDLE: empty (desktop only) -->
    <div class="middle-void" aria-hidden="true"></div>

    <!-- RIGHT: toggled content -->
    <aside class="side-panel side-right">

      <div class="panel-toggles">
        <button class="toggle-btn" :class="{ 'toggle-btn--active': activePanel === 'stats' }"
          @click="activePanel = 'stats'">
          ⚔ Clan Stats
        </button>
        <button class="toggle-btn" :class="{ 'toggle-btn--active': activePanel === 'milestones' }"
          @click="activePanel = 'milestones'">
          ⸸ Milestones
        </button>
        <button class="toggle-btn" :class="{ 'toggle-btn--active': activePanel === 'league' }"
          @click="activePanel = 'league'">
          ⚿ League Info
        </button>
        <button class="toggle-btn" :class="{ 'toggle-btn--active': activePanel === 'halloffame' }"
          @click="activePanel = 'halloffame'">
          ☩ Hall of Fame
        </button>
      </div>

      <template v-if="activePanel === 'stats'">
        <StatTrackers />
      </template>

      <template v-else-if="activePanel === 'milestones'">
        <Milestones />
      </template>

      <template v-else-if="activePanel === 'league'">
        <LeagueInfoPanel />
      </template>

      <template v-else>
        <HallOfFamePanel />
      </template>

    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LiveFeed from '@/components/LiveFeed.vue'
import StatTrackers from '@/components/StatTrackers.vue'
import Milestones from '@/components/Milestones.vue'
import LeagueInfoPanel from '@/components/LeagueInfoPanel.vue'
import HallOfFamePanel from '@/components/HallOfFamePanel.vue'
import { initStats, closeStats } from '@/stores/statsStore.js'

const activePanel = ref('stats')

onMounted(initStats)
onUnmounted(closeStats)
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* Desktop: no page scroll, panels scroll independently */
@media (min-width: 769px) {

  html,
  body,
  #app {
    overflow: hidden;
  }
}

/* Mobile: page itself scrolls */
@media (max-width: 768px) {

  html,
  body,
  #app {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>

<style scoped>
.bg-video {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: -2;
  pointer-events: none;
}

.bg-overlay {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.25) 100%),
    rgba(5, 0, 0, 0.25);
}

/* ── Desktop layout ──────────────────────────────────────────────────────── */
.side-layout {
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-columns: 500px 1fr 540px;
  z-index: 1;
}

.side-panel {
  min-height: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 28px 20px 60px;
  scrollbar-width: thin;
  scrollbar-color: #8b0000 transparent;
}

.side-left {
  background: linear-gradient(90deg, rgba(5, 0, 0, 0.55) 0%, rgba(5, 0, 0, 0.08) 100%);
}

.side-right {
  background: linear-gradient(270deg, rgba(5, 0, 0, 0.55) 0%, rgba(5, 0, 0, 0.08) 100%);
}

.middle-void {
  pointer-events: none;
}

/* ── Mobile layout ───────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .side-layout {
    position: relative;
    inset: auto;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .side-panel {
    height: auto;
    min-height: 100vh;
    overflow-y: visible;
    overflow-x: hidden;
    padding: 24px 16px 40px;
  }

  /* On mobile both panels get full-width solid backgrounds */
  .side-left {
    background: rgba(5, 0, 0, 0.78);
  }

  .side-right {
    background: rgba(5, 0, 0, 0.78);
  }

  .middle-void {
    display: none;
  }
}

/* ── Toggle buttons ──────────────────────────────────────────────────────── */
.panel-toggles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}

.toggle-btn {
  font-family: 'Cinzel', serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #e8e0d4;
  background: rgba(18, 2, 2, 0.75);
  border: 1px solid rgba(139, 0, 0, 0.45);
  border-radius: 6px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.toggle-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 60, 0, 0.04) 0%, transparent 60%);
  pointer-events: none;
}

.toggle-btn:hover {
  color: #ff6b35;
  border-color: #8b0000;
  background: rgba(139, 0, 0, 0.2);
  box-shadow: 0 0 16px rgba(139, 0, 0, 0.3);
}

.toggle-btn--active {
  color: #ffd070;
  background: rgba(139, 0, 0, 0.35);
  border-color: #c0392b;
  box-shadow:
    0 0 20px rgba(139, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 107, 53, 0.15);
  text-shadow: 0 0 10px rgba(255, 179, 71, 0.5);
}

.toggle-btn--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff6b35, transparent);
  box-shadow: 0 0 8px #ff6b35;
}

@media (max-width: 768px) {
  .toggle-btn {
    font-size: 13px;
    padding: 10px 12px;
    letter-spacing: 1px;
  }
}

.col-spacer {
  height: 28px;
  flex-shrink: 0;
}

</style>