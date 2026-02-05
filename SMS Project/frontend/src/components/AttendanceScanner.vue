<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import QRCode from 'qrcode'

type Props = {
  classId: number | null
  classLabel: string
  studentsCount: number
}

const props = defineProps<Props>()

const sessionDurationMs = 5 * 60 * 1000
const sessionExpiresAt = ref<number | null>(null)
const sessionId = ref('')
const remainingMs = ref(0)
const qrDataUrl = ref('')
const errorMessage = ref('')
const isGenerating = ref(false)
const copyNotice = ref('')

let timerId: number | null = null
let copyTimerId: number | null = null

const hasSession = computed(() => Boolean(sessionExpiresAt.value))
const isExpired = computed(() => hasSession.value && remainingMs.value <= 0)
const sessionStatus = computed(() => {
  if (!hasSession.value) return 'Session length'
  return isExpired.value ? 'Session expired' : 'Expires in'
})
const formattedRemaining = computed(() => {
  if (!hasSession.value) return '05:00'
  const totalSeconds = Math.ceil(remainingMs.value / 1000)
  const minutes = Math.max(Math.floor(totalSeconds / 60), 0)
  const seconds = Math.max(totalSeconds % 60, 0)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const checkInUrl = computed(() => {
  if (!props.classId || !sessionExpiresAt.value) return ''
  const basePath = import.meta.env.BASE_URL ?? '/'
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`
  const envBaseRaw =
    (import.meta.env.VITE_PUBLIC_APP_URL as string | undefined) ??
    (import.meta.env.VITE_PUBLIC_BASE_URL as string | undefined) ??
    ''
  const envBase = envBaseRaw.trim()
  const withProtocol =
    envBase && !/^https?:\/\//i.test(envBase) ? `http://${envBase}` : envBase
  const fallbackBase = `${window.location.origin}${normalizedBase}`
  const resolvedBase = withProtocol
    ? new URL(normalizedBase, withProtocol.endsWith('/') ? withProtocol : `${withProtocol}/`).toString()
    : fallbackBase
  const url = new URL('attendance/check-in', resolvedBase)
  url.searchParams.set('classId', String(props.classId))
  url.searchParams.set('exp', String(sessionExpiresAt.value))
  url.searchParams.set('session', sessionId.value)
  return url.toString()
})

const shortLink = computed(() => {
  if (!checkInUrl.value) return ''
  return checkInUrl.value.replace(/^https?:\/\//, '')
})

const updateRemaining = () => {
  if (!sessionExpiresAt.value) {
    remainingMs.value = 0
    return
  }
  const diff = sessionExpiresAt.value - Date.now()
  remainingMs.value = diff > 0 ? diff : 0
  if (remainingMs.value === 0) {
    stopTimer()
  }
}

const startTimer = () => {
  stopTimer()
  updateRemaining()
  timerId = window.setInterval(updateRemaining, 1000)
}

const stopTimer = () => {
  if (timerId) {
    window.clearInterval(timerId)
    timerId = null
  }
}

const clearCopyNotice = () => {
  if (copyTimerId) {
    window.clearTimeout(copyTimerId)
    copyTimerId = null
  }
  copyNotice.value = ''
}

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 12)
}

const startSession = () => {
  if (!props.classId) {
    errorMessage.value = 'Select a class before starting a session.'
    return
  }
  errorMessage.value = ''
  sessionExpiresAt.value = Date.now() + sessionDurationMs
  sessionId.value = createSessionId()
  startTimer()
}

const resetSession = () => {
  stopTimer()
  sessionExpiresAt.value = null
  sessionId.value = ''
  remainingMs.value = 0
  qrDataUrl.value = ''
  clearCopyNotice()
}

const generateQr = async (value: string) => {
  isGenerating.value = true
  errorMessage.value = ''
  try {
    qrDataUrl.value = await QRCode.toDataURL(value, {
      width: 220,
      margin: 1,
      color: {
        dark: '#1f2933',
        light: '#ffffff',
      },
    })
  } catch (error) {
    qrDataUrl.value = ''
    errorMessage.value = 'Unable to generate the QR code.'
  } finally {
    isGenerating.value = false
  }
}

const copyLink = async () => {
  if (!checkInUrl.value) return
  try {
    await navigator.clipboard.writeText(checkInUrl.value)
    copyNotice.value = 'Link copied.'
  } catch (error) {
    copyNotice.value = 'Copy failed. You can manually copy the link.'
  }
  if (copyTimerId) window.clearTimeout(copyTimerId)
  copyTimerId = window.setTimeout(() => {
    copyNotice.value = ''
  }, 2000)
}

watch(
  () => props.classId,
  () => {
    resetSession()
  },
)

watch(
  () => checkInUrl.value,
  (value) => {
    if (!value) {
      qrDataUrl.value = ''
      return
    }
    generateQr(value).catch(() => {
      qrDataUrl.value = ''
    })
  },
)

onBeforeUnmount(() => {
  stopTimer()
  clearCopyNotice()
})
</script>

<template>
  <section class="scanner-panel">
    <div class="scanner-header">
      <div>
        <p class="eyebrow">Self Check-In</p>
        <h2>Attendance Scanner</h2>
        <p class="helper">
          Generate a 5-minute QR code so students can mark themselves present without creating accounts.
        </p>
      </div>
      <div class="scanner-actions">
        <button class="primary" type="button" @click="startSession">
          {{ hasSession && !isExpired ? 'Regenerate QR' : 'Start 5-min session' }}
        </button>
      </div>
    </div>

    <div class="scanner-grid">
      <div class="qr-card">
        <div class="qr-frame" :class="{ inactive: !qrDataUrl }">
          <img v-if="qrDataUrl" :src="qrDataUrl" alt="Attendance QR code" />
          <div v-else class="qr-placeholder">
            <div class="placeholder-title">QR ready when session starts</div>
            <div class="placeholder-subtitle">Select a class and click start.</div>
          </div>
          <div v-if="isGenerating" class="qr-overlay">Generating QR...</div>
        </div>

        <div class="qr-meta">
          <div class="timer" :class="{ expired: isExpired }">
            <span>{{ sessionStatus }}</span>
            <strong>{{ formattedRemaining }}</strong>
          </div>
          <div class="session-tags">
            <span class="tag">Students: {{ studentsCount }}</span>
            <span class="tag">{{ classLabel || 'No class selected' }}</span>
          </div>
          <div v-if="checkInUrl" class="link-row">
            <span>Check-in link</span>
            <div class="link-box">
              <code>{{ shortLink }}</code>
              <button class="ghost copy" type="button" @click="copyLink">Copy</button>
            </div>
            <p v-if="copyNotice" class="copy-note">{{ copyNotice }}</p>
          </div>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
      </div>

      <div class="steps-card">
        <h3>How it works</h3>
        <ol>
          <li>Start the session to generate a 5-minute QR code.</li>
          <li>Students scan and select their name.</li>
          <li>Present status updates in your attendance table.</li>
        </ol>
        <div class="tip">
          <strong>Tip:</strong> Use Regenerate QR to extend for another 5 minutes.
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scanner-panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #eef1f5;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 20px;
}

.scanner-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  font-weight: 700;
  color: #5b616b;
  margin: 0 0 6px;
}

.scanner-header h2 {
  margin: 0 0 6px;
  font-size: 1.4rem;
  color: #1f2933;
}

.helper {
  margin: 0;
  color: #5b616b;
  max-width: 520px;
}

.scanner-actions {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.primary {
  border: none;
  background: #5ba4d5;
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 18px rgba(91, 164, 213, 0.28);
}

.scanner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.qr-card {
  display: grid;
  gap: 16px;
  background: #f9fafc;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #e7ebf2;
}

.qr-frame {
  background: #ffffff;
  border-radius: 16px;
  border: 1px dashed #c6d1de;
  min-height: 240px;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
}

.qr-frame.inactive {
  background: #f3f6fb;
}

.qr-frame img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.qr-placeholder {
  text-align: center;
  color: #68707b;
  display: grid;
  gap: 6px;
  padding: 16px;
}

.placeholder-title {
  font-weight: 600;
  color: #293241;
}

.qr-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.78);
  display: grid;
  place-items: center;
  font-weight: 600;
  color: #1f2933;
}

.qr-meta {
  display: grid;
  gap: 12px;
}

.timer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: #eef4f9;
  color: #1f2933;
  font-weight: 600;
}

.timer.expired {
  background: #fff4f4;
  color: #b0403a;
}

.session-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #e7f1fa;
  color: #1f3e57;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.link-row {
  display: grid;
  gap: 6px;
  font-size: 0.85rem;
  color: #4a5563;
}

.link-box {
  display: flex;
  gap: 10px;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e0e6ef;
  padding: 8px 10px;
  border-radius: 10px;
}

.link-box code {
  font-family: 'Nunito', sans-serif;
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
}

.copy {
  padding: 6px 12px;
}

.copy-note {
  margin: 0;
  color: #2f79a8;
  font-weight: 600;
}

.error {
  margin: 0;
  color: #b0403a;
  font-weight: 600;
}

.steps-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #e7ebf2;
  display: grid;
  gap: 10px;
  color: #2b2d35;
}

.steps-card h3 {
  margin: 0;
  font-size: 1.1rem;
}

.steps-card ol {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #52606d;
}

.tip {
  background: #eef4f9;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #1f2933;
}

@media (max-width: 720px) {
  .scanner-header {
    flex-direction: column;
  }

  .scanner-actions {
    width: 100%;
  }

  .primary {
    width: 100%;
  }
}
</style>
