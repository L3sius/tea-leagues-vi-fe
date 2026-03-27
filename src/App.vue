<template>
  <video class="bg-video" src="/bg.webm" autoplay loop muted playsinline></video>
  <div class="bg-overlay"></div>

  <!-- <SiteHeader :playerCount="players.length" /> -->

  <div class="side-layout">
    <aside class="side-panel side-left">
      <LiveFeed />
    </aside>

    <div class="middle-void" aria-hidden="true"></div>

    <aside class="side-panel side-right">
      <StatTrackers />
      <div class="col-spacer"></div>
      <Milestones />
      <div class="col-spacer"></div>
      <LeaguePoints />
    </aside>
  </div>
</template>

<script setup>
import SiteHeader from '@/components/SiteHeader.vue'
import LiveFeed from '@/components/LiveFeed.vue'
import StatTrackers from '@/components/StatTrackers.vue'
import Milestones from '@/components/Milestones.vue'
import LeaguePoints from '@/components/LeaguePoints.vue'
import { CLAN_PLAYERS } from '@/data/mockData.js'

const players = CLAN_PLAYERS
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
    radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.45) 100%),
    rgba(5, 0, 0, 0.45);
}

.side-layout {
  position: fixed;
  /* Use CSS var so we only tweak one number if header height changes */
  --header-h: 121px;
  top: var(--header-h);
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 420px 1fr 460px;
  z-index: 1;
}

.side-panel {
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 16px 40px;
  scrollbar-width: thin;
  scrollbar-color: var(--blood-red) transparent;
}

.side-left {
  background: linear-gradient(90deg, rgba(5, 0, 0, 0.65) 0%, rgba(5, 0, 0, 0.15) 100%);
}

.side-right {
  background: linear-gradient(270deg, rgba(5, 0, 0, 0.65) 0%, rgba(5, 0, 0, 0.15) 100%);
}

.middle-void {
  pointer-events: none;
}

.col-spacer {
  height: 24px;
  flex-shrink: 0;
}
</style>