<template>
    <Teleport to="body">
        <Transition name="faq-fade">
            <div v-if="open" class="faq-backdrop" @click.self="$emit('close')">
                <div class="faq-modal panel">
                    <button class="faq-close" @click="$emit('close')" title="Close">✕</button>

                    <h2 class="faq-title">
                        <span class="title-deco">⸸</span>
                        Setup Guide
                        <span class="title-deco">⸸</span>
                    </h2>
                    <p class="faq-subtitle">How to connect the Dink plugin</p>

                    <div class="faq-divider"></div>

                    <div class="faq-block">
                        <h3 class="block-title">Import Dink Settings</h3>
                        <ul class="instruction-list">
                            <li>Install <em>Dink</em> from the Plugin Hub</li>
                            <li>Open <em>Dink Settings → Advanced</em></li>
                            <li>Paste the dynamic config URL:</li>
                        </ul>
                        <div class="code-scroll" @click="copyUrl">
                            <code>https://api.tea-osrs.com/config</code>
                            <span class="copy-hint">{{ copied ? '✓ Copied' : 'click to copy' }}</span>
                        </div>
                        <ul class="instruction-list">
                            <li>Set <em>Import policy</em> → <em>Overwrite Webhooks</em></li>
                            <li>Turn the Dink plugin <em>off</em>, then back <em>on</em></li>
                            <li>Close the plugin by clicking the <em>'&lt;'</em> arrow</li>
                        </ul>
                        <p class="note-text">
                            ⚠ Manually changing Dink settings may cause tasks to be tracked incorrectly.
                        </p>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ open: Boolean })
defineEmits(['close'])

const copied = ref(false)

function copyUrl() {
    navigator.clipboard.writeText('https://api.tea-osrs.com/config').then(() => {
        copied.value = true
        setTimeout(() => { copied.value = false }, 2000)
    })
}
</script>

<style scoped>
.faq-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}

.faq-modal {
    position: relative;
    width: 100%;
    max-width: 520px;
    padding: 36px 40px 40px;
    border: 1px solid #c0392b !important;
    border-top: 2px solid #ff6b35 !important;
    box-shadow:
        0 0 0 1px rgba(255, 107, 53, 0.12) inset,
        0 0 40px rgba(139, 0, 0, 0.7),
        0 0 80px rgba(139, 0, 0, 0.25),
        0 8px 48px rgba(0, 0, 0, 0.9) !important;
}

.faq-close {
    position: absolute;
    top: 14px;
    right: 16px;
    background: none;
    border: none;
    color: #c8c0b8;
    font-size: 16px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.15s, color 0.15s;
    line-height: 1;
}

.faq-close:hover {
    opacity: 1;
    color: #ff6b35;
}

.faq-title {
    font-family: 'Cinzel Decorative', 'Cinzel', serif;
    font-size: 26px;
    font-weight: 700;
    color: #ffd070;
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(255, 179, 71, 0.4);
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 6px;
}

.title-deco {
    color: #8b0000;
    font-size: 16px;
    opacity: 0.8;
}

.faq-subtitle {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    color: #c8c0b8;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin: 0;
    opacity: 0.7;
}

.faq-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #8b0000, transparent);
    margin: 22px 0;
    opacity: 0.5;
}

.faq-block {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.block-title {
    font-family: 'Cinzel', serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #ff6b35;
    margin: 0;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 107, 53, 0.25);
}

.instruction-list {
    margin: 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    list-style: none;
}

.instruction-list li {
    font-size: 14.5px;
    color: #f0ece4;
    line-height: 1.5;
    position: relative;
    padding-left: 4px;
}

.instruction-list li::before {
    content: '›';
    position: absolute;
    left: -14px;
    color: #8b0000;
    font-size: 16px;
    line-height: 1.4;
}

.instruction-list em {
    font-style: normal;
    color: #ffd070;
}

.code-scroll {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(139, 0, 0, 0.5);
    border-radius: 4px;
    padding: 10px 14px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
}

.code-scroll:hover {
    border-color: #ff6b35;
    background: rgba(139, 0, 0, 0.12);
}

.code-scroll code {
    font-family: 'Courier New', monospace;
    font-size: 13.5px;
    color: #ffd070;
    letter-spacing: 0.5px;
    word-break: break-all;
}

.copy-hint {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #c8c0b8;
    flex-shrink: 0;
    opacity: 0.6;
    transition: opacity 0.15s, color 0.15s;
}

.code-scroll:hover .copy-hint {
    opacity: 1;
    color: #ff6b35;
}

.note-text {
    font-size: 13px;
    color: #c8c0b8;
    font-style: italic;
    margin: 0;
    padding: 10px 14px;
    border-left: 3px solid #8b0000;
    background: rgba(139, 0, 0, 0.08);
    border-radius: 0 3px 3px 0;
    line-height: 1.5;
    opacity: 0.85;
}

/* Transition */
.faq-fade-enter-active,
.faq-fade-leave-active {
    transition: opacity 0.2s ease;
}

.faq-fade-enter-active .faq-modal,
.faq-fade-leave-active .faq-modal {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.faq-fade-enter-from,
.faq-fade-leave-to {
    opacity: 0;
}

.faq-fade-enter-from .faq-modal,
.faq-fade-leave-to .faq-modal {
    transform: translateY(-12px);
    opacity: 0;
}
</style>
