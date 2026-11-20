<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import emailjs from '@emailjs/browser'
import QRCode from 'qrcode'
import confetti from 'canvas-confetti'

const form = ref({ name: '', email: '', message: '' })
const sending = ref(false)
const feedback = ref({ type: '', text: '' })
const verified = ref(false)
const dragging = ref(false)
const progress = ref(0)
const thumb = ref(0)
const track = ref(null)
const qrDataUrl = ref('')
const whatsappLink = 'https://wa.me/261333026839'
let startX = 0
let maxTravel = 0

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))

function startDrag(event) {
  if (verified.value) return
  dragging.value = true
  startX = event.clientX ?? event.touches?.[0]?.clientX
  maxTravel = (track.value?.clientWidth || 300) - 48
  window.addEventListener('pointermove', moveDrag)
  window.addEventListener('pointerup', stopDrag)
}
function moveDrag(event) {
  if (!dragging.value) return
  const delta = Math.min(Math.max((event.clientX - startX), 0), maxTravel)
  thumb.value = delta
  progress.value = delta / maxTravel * 100
  if (delta >= maxTravel) { verified.value = true; stopDrag() }
}
function stopDrag() {
  dragging.value = false
  window.removeEventListener('pointermove', moveDrag)
  window.removeEventListener('pointerup', stopDrag)
  if (!verified.value) { thumb.value = 0; progress.value = 0 }
}
function notify(type, text) { feedback.value = { type, text }; window.setTimeout(() => { feedback.value = { type: '', text: '' } }, 5000) }
function celebrate() { confetti({ particleCount: 150, spread: 70, origin: { y: .65 }, colors: ['#2fc8a3', '#8878ff', '#ffbd70', '#ff806e'] }) }
async function sendEmail() {
  if (!form.value.name || !form.value.email || !form.value.message) return notify('error', 'Veuillez remplir tous les champs.')
  if (!emailValid.value) return notify('error', 'Veuillez renseigner une adresse email valide.')
  if (!verified.value) return notify('error', 'Faites glisser le robot pour vérifier que vous êtes humain.')
  sending.value = true
  try {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'ZgI5TYSPYNESKjLKs')
    await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_higxj2g', import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_gnnec0j', { from_name: form.value.name, from_email: form.value.email, message: form.value.message })
    form.value = { name: '', email: '', message: '' }
    verified.value = false; thumb.value = 0; progress.value = 0
    notify('success', 'Message envoyé avec succès 🎉')
    celebrate()
  } catch { notify('error', 'L’envoi a échoué. Veuillez réessayer ou utiliser WhatsApp.') }
  finally { sending.value = false }
}
onMounted(async () => { qrDataUrl.value = await QRCode.toDataURL(whatsappLink, { width: 260, margin: 2 }) })
onUnmounted(stopDrag)
</script>

<template>
  <section id="contact" class="contact contact-premium" data-aos="zoom-in"><div class="shell"><p class="kicker">07 / OUVRIR UNE CONVERSATION</p><h2>Un projet en tête ?<br><em>Parlons-en.</em></h2><div v-if="feedback.text" class="contact-feedback" :class="feedback.type">{{ feedback.text }}</div><div class="contact-grid contact-panels"><form class="contact-form-card" @submit.prevent="sendEmail"><div class="field"><label for="contact-name">Nom</label><input id="contact-name" v-model="form.name" required placeholder="Votre nom"></div><div class="field"><label for="contact-email">Email</label><input id="contact-email" v-model="form.email" required type="email" placeholder="vous@exemple.com"></div><div class="field"><label for="contact-message">Message</label><textarea id="contact-message" v-model="form.message" required rows="4" placeholder="Parlez-moi de votre projet…"></textarea></div><div ref="track" class="verify-track" :class="{verified}" :style="{'--progress': `${progress}%`}"><span>{{ verified ? 'Vérifié !' : 'Glissez pour vérifier' }} <b>✦</b></span><button type="button" class="verify-thumb" :style="{transform:`translateX(${thumb}px)`}" @pointerdown.prevent="startDrag" aria-label="Vérifier">{{ verified ? '✓' : '→' }}</button></div><button class="button dark-button contact-submit" type="submit" :disabled="sending || !verified">{{ sending ? 'Envoi en cours…' : 'Envoyer le message ↗' }}</button></form><aside class="whatsapp-card"><div class="whatsapp-icon"><img src="/images/whatsApp.png" alt="WhatsApp" /></div><h3>Échangeons sur WhatsApp</h3><p>Une question rapide ou une première idée à partager ? Écrivez-moi directement.</p><img v-if="qrDataUrl" :src="qrDataUrl" alt="QR code WhatsApp de Randy"><a :href="whatsappLink" target="_blank" rel="noopener" class="whatsapp-link">Ouvrir WhatsApp ↗</a><small>Scannez le QR code avec votre téléphone</small></aside></div></div></section>
</template>

<style scoped>
.contact-premium{position:relative}.contact-panels{align-items:stretch}.contact-form-card,.whatsapp-card{padding:30px;border:1px solid #0a102044;border-radius:var(--radius-md);background:#ffffff25;backdrop-filter:blur(10px)}.contact-form-card{display:flex;flex-direction:column;gap:19px}.field label{display:block;margin-bottom:7px;color:#10203a;font:11px var(--body-font);font-weight:800;text-transform:uppercase;letter-spacing:.08em}.field input,.field textarea{width:100%;padding:12px 0;border:0;border-bottom:1px solid #0a102066;background:transparent;color:#0a1020;outline:none;font:14px var(--body-font);resize:vertical}.field input:focus,.field textarea:focus{border-color:#fff;box-shadow:0 1px #fff}.verify-track{height:50px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid #0a102044;border-radius:10px;background:linear-gradient(90deg,#ffffff55 var(--progress),#ffffff22 var(--progress));color:#27405f;font:11px var(--body-font);user-select:none}.verify-track.verified{color:#06483b;background:#ffffff66}.verify-track>span{pointer-events:none}.verify-thumb{position:absolute;left:4px;top:4px;bottom:4px;width:42px;border:0;border-radius:7px;background:#0a1020;color:#2fc8a3;font-size:19px;cursor:grab;box-shadow:0 4px 12px #0a102044}.verify-thumb:active{cursor:grabbing}.contact-submit{align-self:flex-start;color:var(--paper)!important}.contact-submit:disabled{opacity:.45;cursor:not-allowed;transform:none}.contact-feedback{position:relative;margin-bottom:18px;padding:13px 16px;border-radius:9px;font-size:13px}.contact-feedback.success{background:#0c5d4d;color:#e5fff8}.contact-feedback.error{background:#fff0e8;color:#702d24}.whatsapp-card{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(145deg,#ffffff44,#ffffff18)}.whatsapp-icon{display:grid;place-items:center;width:54px;height:54px;margin-bottom:15px;border-radius:50%;background:#0c9b72;color:#d8fff1;font-size:34px;box-shadow:0 10px 25px #0c9b7244}.whatsapp-card h3{font:600 27px var(--heading-font);letter-spacing:-.05em;color:#10203a;margin:0 0 9px}.whatsapp-card p{max-width:290px;color:#203c58;font-size:13px;line-height:1.5}.whatsapp-card img{width:180px;height:180px;margin:18px 0 14px;border:8px solid #fff;border-radius:12px;box-shadow:0 10px 30px #0a102033}.whatsapp-link{padding:11px 15px;border-radius:99px;background:#0c9b72;color:#fff;text-decoration:none;font:11px var(--body-font);font-weight:800}.whatsapp-link:hover{background:#087456;transform:translateY(-2px)}.whatsapp-card small{margin-top:12px;color:#203c58;font-size:10px}@media(max-width:700px){.contact-panels{display:flex;flex-direction:column}.contact-form-card,.whatsapp-card{padding:22px}.whatsapp-card img{width:160px;height:160px}}
</style>
