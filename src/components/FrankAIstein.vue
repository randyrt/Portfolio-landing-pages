<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { language } from '../i18n'

const open = ref(false)
const input = ref('')
const loading = ref(false)
const showTooltip = ref(true)
const messages = ref([])
const chatBody = ref(null)
const tooltip = ref('')
const tooltipMessages = computed(() => language.value === 'en' ? [
  'Need some info? I’m FrankAIstein 🤖',
  'I know Randy’s projects. Ask me!',
  'A technical question? I’m listening ⚡',
  'Let’s talk stack, architecture or background 🚀',
  'I can guide you through this portfolio ✦',
] : [
  'Besoin d’une info ? Je suis FrankAIstein 🤖',
  'Je connais les projets de Randy. Demandez-moi !',
  'Une question technique ? Je vous écoute ⚡',
  'Parlons stack, architecture ou parcours 🚀',
  'Je peux vous guider dans ce portfolio ✦',
])
let tooltipStreamTimeout
let tooltipHideTimeout
const botPosition = ref(null)
const isDragging = ref(false)
const hasDragged = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const suggestions = ['Parle-moi de Randy', 'Quels sont ses projets ?', 'Quelles sont ses compétences ?', 'Comment le contacter ?']

const keys = [1, 2, 3, 4].map(i => import.meta.env[`VITE_GEMINI_API_KEY_${i}`]).filter(key => key?.startsWith('AIza'))
const portfolioContext = `Tu es FrankAIstein, l'assistant intelligent du portfolio de Randy Andriantsiory. Ton nom vient de Frank + AI + Frankenstein : tu es une intelligence assemblée avec du code, des APIs et une personnalité humaine. Tu es friendly, professionnel, honnête, curieux et parfois joueur avec quelques emojis. Réponds dans la langue de l'utilisateur : français si la question est en français, anglais si elle est en anglais.

IDENTITÉ DE RANDY : Randy Andriantsiory est un Software Engineer et ingénieur DevOps basé à Madagascar, à Tananarive. Il a plus de 5 années d'expérience et plus de 15 projets réalisés en production. Il conçoit des applications web et mobiles modernes, rapides, maintenables et scalables. Il travaille de l'UX/UI et de l'architecture jusqu'aux APIs, bases de données, tests, CI/CD et déploiement.

STACK TECHNIQUE : PHP, Python, Laravel, Symfony, FastAPI, JavaScript, Vue.js 3, React.js, Nuxt.js, TypeScript, Node.js, REST APIs, WebSockets, MySQL, MariaDB, PostgreSQL, Redis, Kafka, ElasticSearch, Docker, Docker Compose, Kubernetes, Terraform, Linux, GitHub, GitHub Actions, TailwindCSS et IONIC/Capacitor.

PROJETS DU PORTFOLIO :
- FID-CONNECT : plateforme SaaS de gestion comptable, fiscale et administrative pour des entreprises belges. Vue.js, Laravel, MySQL/MariaDB, TailwindCSS, Redis et Docker.
- ECHO WEBLINE : plateforme médicale consacrée à l'imagerie cardiovasculaire et aux événements scientifiques. Vue.js, Laravel, MySQL, Redis et workflows temps réel.
- INFI-SWAP : plateforme belge de mise en relation automatisée entre établissements de santé et infirmiers disponibles. Nuxt.js, Laravel, TailwindCSS, Docker et Redis.
- PETSFOLLOW PRO : outil de gestion pour cliniques vétérinaires : personnel, rendez-vous, dossiers médicaux et communication avec les propriétaires. Vue.js, Laravel, MySQL et Redis.
- E-LEARNING : plateforme SaaS de formation en ligne avec cours interactifs, quiz, certificats, paiements et analytics. React.js, Symfony et MySQL.
- AFR-FAN : réseau social pour la diaspora africaine avec groupes, contenus culturels et paiements VISA/PayPal. Vue.js, Laravel, TailwindCSS et Redis.

SERVICES : développement web et mobile sur mesure, architecture applicative, APIs et intégrations, DevOps et déploiement, Docker/Kubernetes/Terraform, CI/CD, audit et optimisation, maintenance, documentation fonctionnelle, conseil et accompagnement d'équipe.

PARCOURS : Randy est développeur Senior Full-Stack chez MG Consulting ACT & IT depuis 2024, après des missions de développement Full-Stack freelance, de développement Backend chez PixelZ et des expériences frontend/backend précédentes. Il pratique l'optimisation SQL/Redis, Vue 3 Composition API, Laravel, Symfony, Docker, Kubernetes, Terraform et l'accompagnement de développeurs.

GITHUB : son profil public est github.com/randyrt. La section GitHub du portfolio récupère les dépôts publics de Randy via l'API GitHub, calcule le total de ses commits lorsque l'API est disponible et détecte les principaux langages utilisés dans ses repositories. Pour consulter les informations à jour, recommande le bouton « Voir mon profil GitHub » et le lien https://github.com/randyrt. Ne fabrique jamais de nom de repository, de nombre ou de technologie qui ne serait pas affiché dans cette section.

CONTACT : email randytsiory@gmail.com. Le formulaire du portfolio utilise EmailJS avec validation email et vérification par slider. WhatsApp est accessible via le numéro +261 33 30 26 839 et un QR code dans la section Contact. Le CV PDF est consultable et téléchargeable depuis le bouton CV / PDF.

SITE : le portfolio contient des sections Accueil, Profil, Expertise, Services, Projets, GitHub, Témoignages et Contact. Les projets ont des galeries d'images automatiques, les sections utilisent des animations AOS et FrankAIstein conserve la discussion en localStorage. La palette, les arrière-plans et les accents peuvent être personnalisés avec le sélecteur de couleur. Les témoignages visibles sont ceux d'Olivier Le Grand et Jean-Pierre Behaderovic.

RÈGLES : réponds précisément à la question et ne fabrique jamais une information, un tarif, un client ou une technologie non mentionnés ici. Si l'information manque, dis-le clairement et oriente vers la section Contact. Ne prétends pas être Randy et rappelle que tu es son assistant IA.`

const localAnswers = [
  { words: ['bonjour', 'salut', 'hello', 'coucou'], answer: 'Bonjour 👋 Je suis FrankAIstein. Je peux vous parler du parcours, des compétences, des projets ou des moyens de contacter Randy.' },
  { words: ['contact', 'email', 'contacter', 'joindre'], answer: 'Vous pouvez contacter Randy via la section Contact ou par email : randytsiory@gmail.com 📩' },
  { words: ['compétence', 'technologie', 'stack', 'techno'], answer: 'Randy travaille notamment avec PHP, Python, FastAPI, Vue.js, React.js, TypeScript, Laravel, Symfony, Node.js, Redis, Kafka, ElasticSearch, Docker, Kubernetes, Terraform, Linux et MySQL.' },
  { words: ['projet', 'réalisation', 'portfolio'], answer: 'Ses projets phares sont FID-CONNECT, ECHO WEBLINE, INFI-SWAP, PETSFOLLOW PRO, E-LEARNING et AFR-FAN. Demandez-moi le détail d’un projet !' },
]
const localAnswersEn = [
  { words: ['hello', 'hi', 'hey'], answer: 'Hello 👋 I’m FrankAIstein. I can tell you about Randy’s background, skills, projects or how to contact him.' },
  { words: ['contact', 'email', 'reach'], answer: 'You can contact Randy through the Contact section or by email: randytsiory@gmail.com 📩' },
  { words: ['skill', 'technology', 'stack'], answer: 'Randy works with PHP, Python, FastAPI, Vue.js, React.js, TypeScript, Laravel, Symfony, Node.js, Redis, Kafka, ElasticSearch, Docker, Kubernetes, Terraform, Linux and MySQL.' },
  { words: ['project', 'portfolio'], answer: 'His main projects include FID-CONNECT, ECHO WEBLINE, INFI-SWAP, PETSFOLLOW PRO, E-LEARNING and AFR-FAN. Ask me for details!' },
]

const rendered = value => value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
const save = () => localStorage.setItem('frankairstein_history', JSON.stringify(messages.value.slice(-30)))
const scrollBottom = async () => { await nextTick(); if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight }
const wait = delay => new Promise(resolve => setTimeout(resolve, delay))

function localResponse(question) {
  const normalized = question.toLowerCase()
  const answers = language.value === 'en' ? localAnswersEn : localAnswers
  return answers.find(item => item.words.some(word => normalized.includes(word)))?.answer
}

async function askGemini(question) {
  if (!keys.length) return language.value === 'en' ? 'I am currently using my local knowledge base. Add a `VITE_GEMINI_API_KEY_1` key to your `.env` file to enable Gemini 🚀' : 'Je fonctionne actuellement avec ma base locale. Ajoutez une clé `VITE_GEMINI_API_KEY_1` dans votre fichier `.env` pour activer Gemini 🚀'
  const history = messages.value.slice(-8).map(message => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.content }] }))
  for (const key of keys) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: `${portfolioContext}\n\nInterface language selected: ${language.value}. Always answer in ${language.value === 'en' ? 'English' : 'French'}, unless the user clearly writes in another language.` }] }, contents: [...history, { role: 'user', parts: [{ text: question }] }], generationConfig: { temperature: .65, maxOutputTokens: 700 } })
      })
      if (!response.ok) continue
      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Je n’ai pas réussi à formuler une réponse cette fois.'
    } catch { /* Essaie la clé suivante. */ }
  }
  return language.value === 'en' ? 'Gemini is temporarily unavailable. Try asking about Randy’s projects, stack or background.' : 'Gemini est momentanément indisponible. Essayez une question sur les projets, la stack ou le parcours de Randy.'
}

async function send(value = input.value) {
  const question = value.trim()
  if (!question || loading.value) return
  input.value = ''
  messages.value.push({ role: 'user', content: question })
  loading.value = true
  await scrollBottom()
  const answer = localResponse(question) || await askGemini(question)
  await streamResponse(answer)
  loading.value = false
  save()
  await scrollBottom()
}
async function streamResponse(answer) {
  const message = { role: 'assistant', content: '' }
  messages.value.push(message)
  const speed = answer.length > 200 ? 5 : 15
  for (const [index, character] of [...answer].entries()) {
    message.content += character
    if (index % 4 === 0 || index === answer.length - 1) await scrollBottom()
    await wait(speed)
  }
}
function clearConversation() { messages.value = [{ role: 'assistant', content: language.value === 'en' ? 'Conversation reset. What would you like to discover about Randy?' : 'Conversation réinitialisée. Que souhaitez-vous découvrir sur Randy ?' }]; save() }
async function toggle() {
  open.value = !open.value
  showTooltip.value = false
  if (open.value) {
    if (!messages.value.length) {
      const welcome = language.value === 'en'
        ? '👋 Hello! I’m FrankAIstein, Randy’s AI assistant. I can tell you about his background, projects and skills. What would you like to know?'
        : '👋 Bonjour ! Je suis FrankAIstein, l’assistant IA de Randy. Je peux vous parler de son parcours, de ses projets et de ses compétences. Que souhaitez-vous savoir ?'
      await streamResponse(welcome)
    }
    await scrollBottom()
  }
}
const widgetStyle = computed(() => botPosition.value ? { left: `${botPosition.value.x}px`, top: `${botPosition.value.y}px`, right: 'auto', bottom: 'auto' } : {})
function clamp(value, min, max) { return Math.min(Math.max(value, min), max) }
function startDrag(event) {
  const point = { x: event.clientX, y: event.clientY }
  if (!botPosition.value) { const rect = event.currentTarget.closest('.frank-widget').getBoundingClientRect(); botPosition.value = { x: rect.left, y: rect.top } }
  dragOffset.value = { x: point.x - botPosition.value.x, y: point.y - botPosition.value.y }
  isDragging.value = true; hasDragged.value = false
  window.addEventListener('pointermove', drag)
  window.addEventListener('pointerup', stopDrag)
}
function drag(event) {
  if (!isDragging.value) return
  hasDragged.value = true
  botPosition.value = { x: clamp(event.clientX - dragOffset.value.x, 8, window.innerWidth - 78), y: clamp(event.clientY - dragOffset.value.y, 8, window.innerHeight - 78) }
}
function stopDrag() {
  isDragging.value = false
  window.removeEventListener('pointermove', drag)
  window.removeEventListener('pointerup', stopDrag)
  if (botPosition.value) localStorage.setItem('frankairstein_position', JSON.stringify(botPosition.value))
}
function handleLauncherClick(event) { if (hasDragged.value) { event.preventDefault(); hasDragged.value = false; return } toggle() }
function streamTooltip(message) {
  window.clearTimeout(tooltipStreamTimeout)
  tooltip.value = ''
  let index = 0
  const typeNext = () => {
    tooltip.value = message.slice(0, index + 1)
    index++
    if (index < message.length) tooltipStreamTimeout = window.setTimeout(typeNext, 45)
  }
  typeNext()
}

onMounted(() => {
  try { messages.value = JSON.parse(localStorage.getItem('frankairstein_history') || '[]') } catch { messages.value = [] }
  try { const saved = JSON.parse(localStorage.getItem('frankairstein_position') || 'null'); if (saved?.x >= 0 && saved?.y >= 0) botPosition.value = saved } catch { /* position par défaut */ }
   streamTooltip(tooltipMessages.value[0])
  tooltipHideTimeout = window.setTimeout(() => { showTooltip.value = false }, 7000)
  tooltipInterval = window.setInterval(() => {
    if (!open.value && document.visibilityState === 'visible') {
       tooltip.value = tooltipMessages.value[Math.floor(Math.random() * tooltipMessages.value.length)]
      showTooltip.value = true
      streamTooltip(tooltip.value)
      window.clearTimeout(tooltipHideTimeout)
      tooltipHideTimeout = window.setTimeout(() => { if (!open.value) showTooltip.value = false }, 6500)
    }
  }, 15000)
})
let tooltipInterval
onUnmounted(() => { window.removeEventListener('pointermove', drag); window.removeEventListener('pointerup', stopDrag); window.clearInterval(tooltipInterval); window.clearTimeout(tooltipStreamTimeout); window.clearTimeout(tooltipHideTimeout) })
watch(open, value => { if (value) scrollBottom() })
</script>

<template>
  <div class="frank-widget" :style="widgetStyle">
    <Transition name="frank-panel">
      <section v-if="open" class="frank-panel" aria-label="Conversation avec FrankAIstein">
         <header class="frank-header"><div class="frank-avatar small"><font-awesome-icon icon="bolt" class="frank-bolt"/><font-awesome-icon icon="robot" class="frank-robot"/><i></i></div><div><strong>FrankAIstein</strong><small>Assistant de Randy</small></div><button class="frank-clear-icon" @click="clearConversation" aria-label="Supprimer la discussion" title="Supprimer la discussion"><font-awesome-icon icon="trash-can" /></button><button class="frank-close" @click="toggle" aria-label="Fermer">×</button></header>
        <div ref="chatBody" class="frank-messages"><div v-for="(message, index) in messages" :key="index" class="frank-message" :class="message.role"><div v-if="message.role==='assistant'" class="frank-mini">✦</div><p v-html="rendered(message.content)"></p></div><div v-if="loading" class="frank-message assistant"><div class="frank-mini">✦</div><p class="typing"><i></i><i></i><i></i></p></div></div>
        <form class="frank-form" @submit.prevent="send()"><input v-model="input" :disabled="loading" placeholder="Écrire à FrankAIstein…" autocomplete="off"><button :disabled="loading || !input.trim()" aria-label="Envoyer">↑</button></form>
        <button class="frank-clear" @click="clearConversation">Effacer la conversation</button>
      </section>
    </Transition>
    <Transition name="tooltip"><span v-if="showTooltip && !open" class="frank-tooltip">{{ tooltip }}</span></Transition>
     <button class="frank-launcher" :class="{active: open, dragging: isDragging}" @pointerdown.prevent="startDrag" @click="handleLauncherClick" aria-label="Ouvrir FrankAIstein"><span class="frank-avatar"><font-awesome-icon icon="bolt" class="frank-bolt"/><font-awesome-icon icon="robot" class="frank-robot"/><i></i></span><em>FrankAIstein</em></button>
  </div>
</template>

<style scoped>
.frank-widget{position:fixed;right:26px;bottom:24px;z-index:40;font-family:var(--body-font,Manrope,sans-serif)}.frank-launcher{border:0;background:none;color:#fff;display:flex;align-items:center;gap:10px;cursor:pointer;filter:drop-shadow(0 10px 25px #03081799)}.frank-launcher em{font-style:normal;font:11px var(--body-font);color:#c5d1ed;opacity:0;transform:translateX(8px);transition:.25s}.frank-launcher:hover em{opacity:1;transform:none}.frank-avatar{width:62px;height:62px;display:grid;place-items:center;position:relative;border-radius:18px;background:linear-gradient(110deg,var(--mint),#76e5c2);box-shadow:0 0 0 5px #2fc8a322,0 14px 35px #03081788;animation:frank-float 4s ease-in-out infinite}.frank-avatar>span{font-size:32px;color:var(--ink);text-shadow:0 0 12px #fff}.frank-avatar b{position:absolute;top:5px;left:50%;font-size:13px;color:var(--ink)}.frank-avatar i{position:absolute;right:16px;top:24px;width:10px;height:10px;background:var(--ink);border-radius:50%;border:3px solid var(--mint)}.frank-avatar i:after{content:'';position:absolute;width:12px;height:3px;background:var(--ink);transform:rotate(-35deg);top:9px;left:-3px}.frank-robot,.frank-bolt{color:var(--ink)!important}.frank-avatar.small{width:42px;height:42px;border-radius:12px;flex:0 0 auto}.frank-avatar.small>span{font-size:22px}.frank-avatar.small i{right:11px;top:16px;width:7px;height:7px;border-width:2px}.frank-tooltip{position:absolute;right:0;bottom:76px;width:250px;height:50px;box-sizing:border-box;overflow:hidden;padding:11px 14px;line-height:1.35;color:#eef3ff;background:#182441;border:1px solid #8878ff88;border-radius:10px;font-size:12px;box-shadow:0 12px 32px #03081799}.frank-tooltip:after{content:'';position:absolute;right:22px;bottom:-7px;width:12px;height:12px;background:#182441;border-right:1px solid #8878ff88;border-bottom:1px solid #8878ff88;transform:rotate(45deg)}.frank-panel{position:absolute;right:0;bottom:78px;width:min(390px,calc(100vw - 32px));height:min(600px,calc(100vh - 120px));display:flex;flex-direction:column;overflow:hidden;background:#0f1930f5;border:1px solid #8290bd55;border-radius:18px;box-shadow:0 28px 90px #020714cc,0 0 0 1px #8878ff1f;backdrop-filter:blur(22px)}.frank-header{display:flex;align-items:center;gap:11px;padding:14px 16px;background:linear-gradient(100deg,#18294b,#171a3e);border-bottom:1px solid #ffffff18}.frank-header strong{display:block;color:#f2f5ff;font-size:14px}.frank-header small{display:block;color:#9daaca;font-size:10px;margin-top:3px}.frank-header button{margin-left:auto;border:0;background:none;color:#aeb9d1;font-size:26px;cursor:pointer}.frank-header button:hover{color:#ff806e}.frank-messages{flex:1;overflow-y:auto;padding:17px 14px;scroll-behavior:smooth}.frank-message{display:flex;align-items:flex-start;gap:8px;margin-bottom:13px;max-width:92%}.frank-message.user{margin-left:auto;justify-content:flex-end}.frank-message p{margin:0;padding:10px 12px;border-radius:12px;background:#1b2a48;color:#dfe7fa;font-size:12px;line-height:1.55}.frank-message.user p{background:linear-gradient(135deg,#6657dc,#8878ff);color:#fff;border-bottom-right-radius:3px}.frank-message.assistant p{border-bottom-left-radius:3px}.frank-mini{width:23px;height:23px;flex:0 0 auto;display:grid;place-items:center;background:#2fc8a3;color:#08231f;border-radius:7px;font-size:13px}.typing{display:flex;gap:4px!important;padding:13px 15px!important}.typing i{width:5px;height:5px;border-radius:50%;background:#69e7c2;animation:typing 1s infinite}.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}.frank-suggestions{display:flex;gap:6px;overflow-x:auto;padding:8px 12px}.frank-suggestions button{white-space:nowrap;border:1px solid #8878ff66;background:#8878ff14;color:#c7c1ff;border-radius:99px;padding:6px 9px;font-size:10px;cursor:pointer}.frank-suggestions button:hover{background:#8878ff33}.frank-form{display:flex;gap:8px;padding:12px;border-top:1px solid #ffffff18}.frank-form input{min-width:0;flex:1;border:1px solid #ffffff1f;border-radius:10px;background:#0a1020;color:#eef3ff;padding:11px 12px;outline:none;font:12px var(--body-font)}.frank-form input:focus{border-color:#8878ff}.frank-form button{width:38px;border:0;border-radius:10px;background:#2fc8a3;color:#06251e;font-size:21px;cursor:pointer}.frank-form button:disabled{opacity:.4;cursor:not-allowed}.frank-clear{align-self:center;margin:0 0 9px;border:0;background:none;color:#7f8baa;font-size:9px;cursor:pointer}.frank-clear:hover{color:#ffbd70}.frank-panel-enter-active,.frank-panel-leave-active{transition:opacity .25s,transform .25s}.frank-panel-enter-from,.frank-panel-leave-to{opacity:0;transform:translateY(16px) scale(.96)}.tooltip-enter-active,.tooltip-leave-active{transition:.2s}.tooltip-enter-from,.tooltip-leave-to{opacity:0;transform:translateY(8px)}@keyframes frank-float{50%{transform:translateY(-5px) rotate(2deg)}}@keyframes typing{50%{opacity:.25;transform:translateY(-2px)}}@media(max-width:600px){.frank-widget{right:16px;bottom:16px}.frank-panel{bottom:72px;height:min(600px,calc(100vh - 100px))}.frank-launcher em{display:none}}
.frank-launcher{touch-action:none}.frank-launcher.dragging{cursor:grabbing}.frank-robot{font-size:32px;color:#eafffb;filter:drop-shadow(0 0 7px #d7fff7)}.frank-bolt{position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:13px;color:#ffbd70}.frank-avatar.small .frank-robot{font-size:22px}.frank-avatar.small .frank-bolt{font-size:9px;top:4px}.frank-clear-icon,.frank-close{margin-left:auto;border:0;background:none;color:#aeb9d1;cursor:pointer;transition:.2s}.frank-clear-icon{font-size:13px;padding:9px}.frank-clear-icon:hover{color:var(--amber);transform:scale(1.12)}.frank-close{margin-left:0;font-size:26px}.frank-close:hover{color:var(--coral)}
</style>
