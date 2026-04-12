<template>
    <section class="hof-section">
        <div class="section-header">
            <h2 class="section-title">Hall of Fame</h2>
            <p class="section-subtitle">Clan Legends</p>
        </div>

        <div class="runic-divider"><span>✦ ⸸ ✦</span></div>

        <div class="frames-grid">
            <div
                v-for="entry in entries"
                :key="entry.id"
                class="painting-frame"
                :class="{ 'painting-frame--done': entry.completed }"
            >
                <!-- Ornate frame corners -->
                <div class="frame-corner frame-corner--tl">✦</div>
                <div class="frame-corner frame-corner--tr">✦</div>
                <div class="frame-corner frame-corner--bl">✦</div>
                <div class="frame-corner frame-corner--br">✦</div>

                <!-- Painting canvas -->
                <div class="painting-canvas">
                    <img
                        v-if="entry.completed && entry.imageUrl"
                        :src="entry.imageUrl"
                        :alt="entry.title"
                        class="painting-image"
                        @click="openLightbox(entry)"
                    />
                    <div v-else class="painting-placeholder">
                        <div class="placeholder-lock">🔒</div>
                        <p class="placeholder-text">Task not yet<br/>completed</p>
                    </div>
                </div>

                <!-- Frame caption area -->
                <div class="frame-caption">
                    <div class="caption-indicator">
                        <span v-if="entry.completed" class="indicator indicator--done" title="Completed">✔</span>
                        <span v-else class="indicator indicator--locked" title="Locked">⚿</span>
                    </div>
                    <h3 class="frame-title">{{ entry.title }}</h3>
                    <p class="frame-desc">{{ entry.description }}</p>
                </div>
            </div>
        </div>

        <!-- Lightbox -->
        <Teleport to="body">
            <Transition name="lightbox">
                <div v-if="lightboxEntry" class="lightbox-backdrop" @click="closeLightbox">
                    <img
                        :src="lightboxEntry.imageUrl"
                        :alt="lightboxEntry.title"
                        class="lightbox-img"
                        @click.stop
                    />
                    <div class="lightbox-caption" @click.stop>
                        <p class="lightbox-title">{{ lightboxEntry.title }}</p>
                        <p class="lightbox-desc">{{ lightboxEntry.description }}</p>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import entries from '@/data/hallOfFame.json'

const lightboxEntry = ref(null)

function openLightbox(entry) { lightboxEntry.value = entry }
function closeLightbox() { lightboxEntry.value = null }
</script>

<style scoped>
.hof-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* ── Header ── */
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

/* ── Grid ── */
.frames-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

/* ── Painting frame card ── */
.painting-frame {
    position: relative;
    background: rgba(18, 2, 2, 0.92);
    border: 2px solid rgba(139, 0, 0, 0.55);
    border-radius: 6px;
    box-shadow:
        0 0 0 1px rgba(80, 10, 10, 0.5) inset,
        0 0 0 4px rgba(18, 2, 2, 0.9) inset,
        0 0 0 5px rgba(139, 0, 0, 0.3) inset,
        0 0 24px rgba(180, 10, 10, 0.18),
        0 4px 32px rgba(0, 0, 0, 0.7);
    padding: 14px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: box-shadow 0.25s, border-color 0.25s;
}

.painting-frame:hover {
    border-color: rgba(192, 57, 43, 0.75);
    box-shadow:
        0 0 0 1px rgba(100, 20, 20, 0.6) inset,
        0 0 0 4px rgba(18, 2, 2, 0.9) inset,
        0 0 0 5px rgba(139, 0, 0, 0.4) inset,
        0 0 32px rgba(180, 10, 10, 0.3),
        0 4px 32px rgba(0, 0, 0, 0.8);
}

.painting-frame--done {
    border-color: rgba(255, 107, 53, 0.5);
    box-shadow:
        0 0 0 1px rgba(255, 107, 53, 0.15) inset,
        0 0 0 4px rgba(18, 2, 2, 0.9) inset,
        0 0 0 5px rgba(255, 107, 53, 0.2) inset,
        0 0 28px rgba(255, 107, 53, 0.18),
        0 4px 32px rgba(0, 0, 0, 0.7);
}

/* ── Corner ornaments ── */
.frame-corner {
    position: absolute;
    font-size: 8px;
    color: #8b0000;
    opacity: 0.65;
    line-height: 1;
    pointer-events: none;
}

.frame-corner--tl { top: 4px;  left: 6px; }
.frame-corner--tr { top: 4px;  right: 6px; }
.frame-corner--bl { bottom: 4px; left: 6px; }
.frame-corner--br { bottom: 4px; right: 6px; }

.painting-frame--done .frame-corner {
    color: #ff6b35;
    opacity: 0.8;
}

/* ── Painting canvas ── */
.painting-canvas {
    width: 100%;
    aspect-ratio: 4 / 3;
    background: rgba(8, 1, 1, 0.85);
    border: 1px solid rgba(139, 0, 0, 0.4);
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    box-shadow:
        inset 0 0 16px rgba(0, 0, 0, 0.7),
        inset 0 0 4px rgba(139, 0, 0, 0.2);
    flex-shrink: 0;
}

.painting-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    cursor: zoom-in;
}

/* ── Placeholder ── */
.painting-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background:
        repeating-linear-gradient(
            45deg,
            transparent,
            transparent 12px,
            rgba(139, 0, 0, 0.04) 12px,
            rgba(139, 0, 0, 0.04) 13px
        ),
        rgba(8, 1, 1, 0.85);
}

.placeholder-lock {
    font-size: 22px;
    opacity: 0.25;
    filter: grayscale(1);
    line-height: 1;
}

.placeholder-text {
    font-family: 'IM Fell English', Georgia, serif;
    font-size: 11px;
    font-style: italic;
    color: #c8c0b8;
    opacity: 0.55;
    text-align: center;
    letter-spacing: 0.5px;
    line-height: 1.4;
}

/* ── Caption area ── */
.frame-caption {
    padding: 9px 2px 2px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
}

.caption-indicator {
    position: absolute;
    top: 8px;
    right: 2px;
}

.indicator {
    font-size: 13px;
    line-height: 1;
}

.indicator--done {
    color: #ff6b35;
    text-shadow: 0 0 8px rgba(255, 107, 53, 0.8), 0 0 16px rgba(255, 107, 53, 0.4);
    animation: emberGlow 2.4s ease-in-out infinite;
}

.indicator--locked {
    color: #c8c0b8;
    opacity: 0.35;
    font-size: 14px;
}

@keyframes emberGlow {
    0%, 100% {
        text-shadow: 0 0 6px rgba(255, 107, 53, 0.7), 0 0 12px rgba(255, 107, 53, 0.3);
        opacity: 1;
    }
    50% {
        text-shadow: 0 0 14px rgba(255, 107, 53, 1), 0 0 28px rgba(255, 107, 53, 0.6), 0 0 42px rgba(220, 50, 0, 0.3);
        opacity: 0.85;
    }
}

.frame-title {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 700;
    color: #ffd070;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    line-height: 1.3;
    text-shadow: 0 0 8px rgba(255, 179, 71, 0.25);
    padding-right: 18px;
}

.frame-desc {
    font-family: 'IM Fell English', Georgia, serif;
    font-size: 11px;
    font-style: italic;
    color: #c8c0b8;
    line-height: 1.45;
    letter-spacing: 0.2px;
}

/* ── Lightbox ── */
.lightbox-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.88);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    cursor: zoom-out;
    padding: 32px;
}

.lightbox-img {
    max-width: 90vw;
    max-height: 80vh;
    object-fit: contain;
    border: 2px solid rgba(139, 0, 0, 0.6);
    box-shadow:
        0 0 0 1px rgba(80, 10, 10, 0.5),
        0 0 60px rgba(180, 10, 10, 0.3),
        0 8px 64px rgba(0, 0, 0, 0.9);
    border-radius: 3px;
    cursor: default;
}

.lightbox-caption {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 14px 24px;
    border-top: 1px solid rgba(139, 0, 0, 0.4);
    background: rgba(0, 0, 0, 0.45);
    border-radius: 4px;
    max-width: 90vw;
    text-align: center;
}

.lightbox-title {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    font-weight: 700;
    color: #ffd070;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-shadow: 0 0 12px rgba(255, 179, 71, 0.5);
    margin: 0;
}

.lightbox-desc {
    font-family: 'IM Fell English', Georgia, serif;
    font-size: 14px;
    font-style: italic;
    color: #c8c0b8;
    letter-spacing: 0.5px;
    margin: 0;
    line-height: 1.5;
    opacity: 0.85;
}

.lightbox-enter-active,
.lightbox-leave-active {
    transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
    opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 768px) {
    .frames-grid {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .frame-title {
        font-size: 11px;
    }

    .frame-desc {
        font-size: 10px;
    }
}
</style>
