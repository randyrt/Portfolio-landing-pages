<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import AOS from 'aos'
import FrankAIstein from './components/FrankAIstein.vue'
import ServicesAndGithub from './components/ServicesAndGithub.vue'
import ContactSection from './components/ContactSection.vue'
import WorkstationSection from './components/WorkstationSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import WebCupSection from './components/WebCupSection.vue'
import ConstellationAnimation from './components/ConstellationAnimation.vue'
import { language, t, setLanguage } from './i18n'

const active = ref(0)
const filter = ref('Tous')
const menuOpen = ref(false)
const sent = ref(false)
const selectedImage = ref(null)
const cvOpen = ref(false)
const galleryIndex = ref(0)
const scrollPercent = ref(0)
const aboutStats = ref({ years: 0, projects: 0 })
const aboutStatsStarted = ref(false)
const primaryColor = ref(localStorage.getItem('portfolio-primary-color') || localStorage.getItem('primary-color-preference') || '#2ac1d5')
const lightMode = ref(localStorage.getItem('portfolio-light-mode') === 'true')
const streamingText = ref('')
const streamingPhrases = computed(() => language.value === 'en'
  ? ['Randy Andriantsiory', 'Full-Stack Developer', 'DevOps Engineer', 'Application architecture']
  : ['Randy Andriantsiory', 'Développeur Full-Stack', 'Ingénieur DevOps', 'Architecture applicative'])
const techMarquee = [
  { name: 'PHP', image: '/images/tecnos/php.png' },
  { name: 'Python', image: '/images/tecnos/python.png' },
  { name: 'FastAPI', image: '/images/tecnos/fastAPI.png' },
  { name: 'Linux', image: '/images/tecnos/lunix.png' },
  { name: 'Symfony', image: '/images/tecnos/synfony.png' },
  { name: 'Laravel', image: '/images/tecnos/laravel.png' },
  { name: 'Vue.js', image: '/images/tecnos/vuejs.jpg' },
  { name: 'React', image: '/images/tecnos/react.webp' },
  { name: 'JavaScript', image: '/images/tecnos/js.png' },
  { name: 'Java', image: '/images/tecnos/java.png' },
  { name: 'Spring Boot', image: '/images/tecnos/spring_boot.png' },
  { name: 'TypeScript', image: '/images/tecnos/typescript.png' },
  { name: 'Tailwind', image: '/images/tecnos/tailwinds.png' },
  { name: 'WordPress', image: '/images/tecnos/wordpress.webp' },
  { name: 'Docker', image: '/images/tecnos/docker.png' },
  { name: 'Terraform', image: '/images/tecnos/terraform.png' },
  { name: 'GitHub Actions', image: '/images/tecnos/github-action.jpeg' },
  { name: 'Postman', image: '/images/tecnos/postman.png' },
  { name: 'Redis', image: '/images/tecnos/redis3D.png' },
  { name: 'Kafka' },
  { name: 'RabbitMQ' },
  { name: 'ElasticSearch' },
  { name: 'SSL / TLS', image: '/images/tecnos/ssl.png' },
  { name: 'SSH', image: '/images/tecnos/ssh.jpg' },
  { name: 'Nginx', image: '/images/tecnos/nginx.jpg' },
]
let streamTimeout
let streamIndex = 0
let streamChar = 0
let streamDeleting = false
const projects = [
  { name: 'Mastery Pro', kind: 'SaaS fiduciaire', type: 'SaaS', images: ['/images/projects/fid-connect/capture12.png','/images/projects/fid-connect/capture0.png','/images/projects/fid-connect/capture3.png','/images/projects/fid-connect/capture7.png','/images/projects/fid-connect/capture10.png'], image: '/images/projects/fid-connect/capture12.png', url: 'https://mastery-pro.be/', text: 'Plateforme tout-en-un qui centralise la gestion comptable, fiscale et administrative des entreprises.' },
  { name: 'ECHO WEBLINE', kind: 'Imagerie cardiovasculaire', type: 'Web métier', images: ['/images/projects/echo-webLine/echo-1.PNG','/images/projects/echo-webLine/echo-3.PNG','/images/projects/echo-webLine/echo-4.PNG','/images/projects/echo-webLine/echo-6.PNG','/images/projects/echo-webLine/echo-8.PNG'], image: '/images/projects/echo-webLine/echo-1.PNG', url: 'https://www.echowebline.com/', text: 'Plateforme web pour présenter des contenus médicaux, gérer les congrès et valoriser une communauté professionnelle.' },
  { name: 'INFI-SWAP', kind: 'Mise en relation santé', type: 'Web métier', images: ['/images/projects/swap/swap1.png','/images/projects/swap/swap2.png','/images/projects/swap/swap3.png','/images/projects/swap/swap4.png','/images/projects/swap/swap5.png','/images/projects/swap/swap6.png'], image: '/images/projects/swap/swap1.png', url: 'https://infiswap.be/', text: 'Solution qui connecte directement les établissements de santé avec les infirmiers disponibles.' },
  { name: 'PETSFOLLOW PRO', kind: 'Application vétérinaire', type: 'Web métier', images: ['/images/projects/petsfollow-pro/1.webp','/images/projects/petsfollow-pro/2.webp','/images/projects/petsfollow-pro/3.webp'], image: '/images/projects/petsfollow-pro/1.webp', url: 'https://petsfollow.app/', text: 'Application qui centralise le personnel, les rendez-vous, les dossiers médicaux et la relation client.' },
  { name: 'E-LEARNING', kind: 'Formation en ligne', type: 'SaaS', images: ['/images/projects/E-learning/1.webp','/images/projects/E-learning/2.webp','/images/projects/E-learning/3.webp','/images/projects/E-learning/4.webp','/images/projects/E-learning/5.webp'], image: '/images/projects/E-learning/1.webp', text: 'Plateforme SaaS dédiée à l’apprentissage en ligne, aux quiz, certificats et tableaux de bord.' },
  { name: 'AFR-FAN', kind: 'Réseau social', type: 'Micro-service', images: ['/images/projects/afr/afr-1.PNG','/images/projects/afr/afr-2.PNG','/images/projects/afr/afr-3.PNG','/images/projects/afr/afr-4.PNG'], image: '/images/projects/afr/afr-1.PNG', text: 'Un réseau social pensé pour la communauté africaine, ses groupes et ses contenus.' }
]
const visible = computed(() => filter.value === 'Tous' ? projects : projects.filter(p => p.type === filter.value))
const projectFilterLabel = value => language.value === 'en' ? ({ 'Tous': 'All', 'Web métier': 'Business web', 'Micro-service': 'Microservice' }[value] || value) : value
const projectEnglishTexts = {
  'Mastery Pro': 'All-in-one platform centralizing accounting, tax and administrative management for businesses.',
  'ECHO WEBLINE': 'Web platform for medical content, congress management and professional community engagement.',
  'INFI-SWAP': 'Solution connecting healthcare facilities directly with available nurses.',
  'PETSFOLLOW PRO': 'Application centralizing staff, appointments, medical records and customer relationships.',
  'E-LEARNING': 'SaaS platform dedicated to online learning, quizzes, certificates and dashboards.',
  'AFR-FAN': 'A social network designed for the African community, its groups and content.',
}
const currentProject = computed(() => {
  const project = projects[active.value]
  return language.value === 'en' ? { ...project, text: projectEnglishTexts[project.name] || project.text } : project
})
const projectImpacts = { 'Mastery Pro': '−40% de tâches manuelles', 'ECHO WEBLINE': '+60% de contenus publiés', 'INFI-SWAP': 'Disponibilité 24/7', 'PETSFOLLOW PRO': 'Un suivi centralisé', 'E-LEARNING': 'Des parcours mesurables', 'AFR-FAN': 'Une communauté connectée' }
const projectImpactsEn = { 'Mastery Pro': '−40% manual tasks', 'ECHO WEBLINE': '+60% published content', 'INFI-SWAP': '24/7 availability', 'PETSFOLLOW PRO': 'Centralized tracking', 'E-LEARNING': 'Measurable learning paths', 'AFR-FAN': 'A connected community' }
const projectKindsEn = { 'SaaS fiduciaire': 'Accounting SaaS', 'Imagerie cardiovasculaire': 'Cardiovascular imaging', 'Mise en relation santé': 'Healthcare matching', 'Application vétérinaire': 'Veterinary application', 'Formation en ligne': 'Online learning', 'Réseau social': 'Social network' }
const projectKind = kind => language.value === 'en' ? projectKindsEn[kind] || kind : kind
const currentImpact = computed(() => (language.value === 'en' ? projectImpactsEn : projectImpacts)[currentProject.value.name] || '')
function selectProject(p) { active.value = projects.indexOf(p); galleryIndex.value = 0 }
function selectGalleryImage(index) { galleryIndex.value = index }
function submit() { sent.value = true }
function openImage(image) { selectedImage.value = image }
function closeImage() { selectedImage.value = null }
function handleEscape(event) { if (event.key === 'Escape') { closeImage(); cvOpen.value = false } }
function openCv() { cvOpen.value = true }
function updateScrollProgress() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollPercent.value = (scrollTop / scrollHeight) * 100
  document.documentElement.style.setProperty('--scroll-percent', scrollPercent.value)
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
function shadeColor(hex, amount) {
  const value = hex.replace('#', '')
  const number = parseInt(value.length === 3 ? value.split('').map(char => char + char).join('') : value, 16)
  const r = Math.max(0, Math.min(255, (number >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((number >> 8) & 255) + amount))
  const b = Math.max(0, Math.min(255, (number & 255) + amount))
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}
function updatePrimaryColor() {
  document.documentElement.style.setProperty('--primary', primaryColor.value)
  document.documentElement.style.setProperty('--primary-deep', shadeColor(primaryColor.value, -28))
  document.documentElement.style.setProperty('--color-accent-primary', primaryColor.value)
  document.documentElement.style.setProperty('--app-primary', primaryColor.value)
  document.documentElement.style.setProperty('--accent-soft', `color-mix(in srgb, ${primaryColor.value} 18%, #0a1020)`)
  document.documentElement.style.setProperty('--accent-pale', `color-mix(in srgb, ${primaryColor.value} 12%, #f2f5ff)`)
  document.documentElement.style.setProperty('--accent-surface', `color-mix(in srgb, ${primaryColor.value} 18%, #111a31)`)
  localStorage.setItem('portfolio-primary-color', primaryColor.value)
  localStorage.setItem('primary-color-preference', primaryColor.value)
}
function toggleLightMode() {
  lightMode.value = !lightMode.value
  localStorage.setItem('portfolio-light-mode', String(lightMode.value))
}
function toggleLanguage() {
  setLanguage(language.value === 'fr' ? 'en' : 'fr')
}
function runStreamingText() {
  const phrase = streamingPhrases.value[streamIndex]
  if (!streamDeleting) {
    streamingText.value = phrase.slice(0, streamChar + 1)
    streamChar++
    if (streamChar >= phrase.length) { streamDeleting = true; streamTimeout = window.setTimeout(runStreamingText, 1500); return }
  } else {
    streamingText.value = phrase.slice(0, streamChar - 1)
    streamChar--
    if (streamChar <= 0) { streamDeleting = false; streamIndex = (streamIndex + 1) % streamingPhrases.value.length }
  }
  streamTimeout = window.setTimeout(runStreamingText, streamDeleting ? 48 : 92)
}
function animateAboutStats() {
  if (aboutStatsStarted.value) return
  aboutStatsStarted.value = true
  const start = performance.now()
  const duration = 1400
  const update = now => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    aboutStats.value = { years: Math.round(5 * eased), projects: Math.round(15 * eased) }
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}
onMounted(() => {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting)
  }), { threshold: .12 })
   document.querySelectorAll('.signal-grid,.expertise-head,.skill-grid,.experience,.project-heading,.project-atlas,.manifest-grid,.contact-grid,.webcup-case-study,.workstation-section').forEach(el => { el.classList.add('reveal'); observer.observe(el) })
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      animateAboutStats()
      statsObserver.disconnect()
    }
  }, { threshold: .35 })
  const statsElement = document.querySelector('.stats')
  if (statsElement) statsObserver.observe(statsElement)
   const aosDirections = [['.signal', 'fade-up'], ['.expertise', 'fade-right'], ['.projects', 'fade-left'], ['.webcup-section', 'fade-up'], ['.manifest', 'fade-up'], ['.contact', 'zoom-in'], ['.workstation-section', 'fade-up']]
  aosDirections.forEach(([selector, animation]) => document.querySelector(selector)?.setAttribute('data-aos', animation))
  document.querySelectorAll('.skill-card').forEach((card, index) => { card.setAttribute('data-aos', index === 1 ? 'fade-up' : index === 0 ? 'fade-right' : 'fade-left'); card.setAttribute('data-aos-delay', String(index * 120)) })
  document.querySelectorAll('.timeline-item').forEach((item, index) => { item.setAttribute('data-aos', index % 2 ? 'fade-left' : 'fade-right'); item.setAttribute('data-aos-delay', String(index * 100)) })
  requestAnimationFrame(() => AOS.refreshHard())
  window.addEventListener('scroll', updateScrollProgress)
  window.addEventListener('keydown', handleEscape)
  updateScrollProgress()
  updatePrimaryColor()
  document.documentElement.classList.toggle('light-mode', lightMode.value)
  document.documentElement.lang = language.value
  runStreamingText()
})
let galleryTimer
onMounted(() => {
  galleryTimer = window.setInterval(() => {
    const total = currentProject.value.images?.length || 1
    galleryIndex.value = (galleryIndex.value + 1) % total
  }, 4200)
})
onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('keydown', handleEscape)
  window.clearTimeout(streamTimeout)
  window.clearInterval(galleryTimer)
})
</script>

<template>
  <div class="site" :class="{'light-mode': lightMode}">
    <FrankAIstein />
    <header class="nav shell">
      <a href="#accueil" class="brand">RANDY@ART.DEVMASTER</a>
      <button class="hamburger" @click="menuOpen=!menuOpen" aria-label="Menu">☰</button>
       <nav :class="{open: menuOpen}">
         <a href="#signal" @click="menuOpen=false">{{ t('about') }}</a><a href="#expertise" @click="menuOpen=false">{{ t('expertise') }}</a><a href="#services" @click="menuOpen=false">{{ t('services') }}</a><a href="#github" @click="menuOpen=false">{{ t('github') }}</a><a href="#temoignages" @click="menuOpen=false">{{ t('testimonials') }}</a><a href="#projets" @click="menuOpen=false">{{ t('projects') }}</a><a href="#webcup" @click="menuOpen=false">WebCup</a><a href="#contact" @click="menuOpen=false">{{ t('contact') }}</a>
         <b><i></i> {{ t('available') }}</b>
      </nav>
       <div class="theme-controls"><button class="language-toggle" type="button" @click="toggleLanguage" :aria-label="language === 'fr' ? 'Switch to English' : 'Passer en français'">{{ language === 'fr' ? 'EN' : 'FR' }}</button><label class="theme-picker floating-theme-picker" title="Changer la couleur principale"><input v-model="primaryColor" type="color" @input="updatePrimaryColor" aria-label="Choisir la couleur principale"><font-awesome-icon icon="palette" /></label><button class="mode-toggle" type="button" @click="toggleLightMode" :aria-label="lightMode ? 'Activer le mode sombre' : 'Activer le mode clair'">{{ lightMode ? '☾' : '☀' }}</button></div>
    </header>

    <main>
       <section id="accueil" class="hero" data-aos="fade-in" data-aos-duration="1000">
         <div class="hero-grid shell">
          <div class="hero-copy" data-aos="fade-right" data-aos-delay="150">
            <p class="kicker">PORTFOLIO / 2026 <span>•</span> MADAGASCAR / TANANARIVE</p>
            <h1>{{ t('heroTitle') }} <em>{{ t('heroEm') }}</em></h1>
             <p class="lede">{{ t('heroLede') }}</p><div class="availability-badge"><i></i> {{ t('newProjects') }}</div>
          </div>
           <div class="portrait-wrap" data-aos="fade-left" data-aos-delay="300"><div class="hero-streaming"><span>{{ streamingText }}</span><i></i></div><figure class="portrait"><img src="/images/me/randy.jpg" alt="Portrait de Randy Andriantsiory"><figcaption>RANDY ANDRIANTSIORY / CODE · BUILD · DEPLOY</figcaption></figure><div class="orb"><span></span><span></span><span></span><span></span><div class="orb-core">✦</div></div><div class="actions hero-photo-actions"><a class="button" href="#projets">{{ t('proofs') }} <span>↓</span></a><a class="button hero-contact-button" href="#contact">{{ t('talk') }} ↗</a><button class="cv-button" type="button" @click="openCv">{{ t('cv') }} <span>↗</span></button></div><p class="time">00:00:18<br>SCROLL TO ENTER</p></div>
        </div>
      </section>

       <section id="signal" class="signal"><div class="shell signal-grid"><div class="chapter">CHAPITRE <b>01</b> LE PROFIL</div><div class="signal-copy"><p class="kicker">{{ t('signalKicker') }}</p><h2>{{ t('signalTitle') }} <em>{{ t('signalEm') }}</em></h2><p>{{ t('signalText1') }}</p><p>{{ t('signalText2') }}</p></div><div class="signal-art"><ConstellationAnimation /></div><dl class="stats"><div><dt>{{ aboutStats.years }}+</dt><dd>{{ t('statYears') }}</dd></div><div><dt>{{ aboutStats.projects }}+</dt><dd>{{ t('statProjects') }}</dd></div><div><dt>∞</dt><dd>{{ t('statLearning') }}</dd></div></dl></div></section>

      <section id="expertise" class="expertise"><div class="shell"><div class="expertise-head"><div><p class="kicker violet">02 / {{ t('expertise') }}</p><h2>{{ t('expertiseTitle') }}<br><em>{{ t('expertiseEm') }}</em></h2></div><p>{{ t('expertiseText') }}</p></div><div class="skill-grid"><article class="skill-card skill-vue"><span class="skill-number">01</span><div class="skill-icon">⌁</div><h3>Frontend</h3><p>{{ t('frontendText') }}</p><div class="badges"><b>Vue.js 3</b><b>React.js</b><b>TypeScript</b><b>Tailwind</b><b>WordPress</b></div></article><article class="skill-card skill-laravel"><span class="skill-number">02</span><div class="skill-icon">◈</div><h3>Backend</h3><p>{{ t('backendText') }}</p><div class="badges"><b>Symfony</b><b>Laravel</b><b>Spring Boot</b><b>Python (FastAPI)</b></div></article><article class="skill-card skill-database"><span class="skill-number">03</span><div class="skill-icon">◉</div><h3>{{ t('databaseTitle') }}</h3><p>{{ t('databaseText') }}</p><div class="badges"><b>MySQL</b><b>MariaDB</b><b>MongoDB</b><b>PostgreSQL</b><b>SQL Server</b></div></article><article class="skill-card skill-devops"><span class="skill-number">04</span><div class="skill-icon">↗</div><h3>{{ t('devopsTitle') }}</h3><p>{{ t('devopsText') }}</p><div class="badges"><b>Docker</b><b>CI/CD</b><b>GitHub Actions</b><b>Linux</b><b>Terraform</b></div></article><article class="skill-card skill-tools"><span class="skill-number">05</span><div class="skill-icon">⌘</div><h3>{{ t('toolsTitle') }}</h3><p>{{ t('toolsText') }}</p><div class="badges"><b>GitHub</b><b>Postman</b><b>Redis</b><b>Kafka</b><b>RabbitMQ</b><b>ElasticSearch</b></div></article><article class="skill-card skill-security"><span class="skill-number">06</span><div class="skill-icon">◇</div><h3>{{ t('securityTitle') }}</h3><p>{{ t('securityText') }}</p><div class="badges"><b>SSL / TLS</b><b>SSH</b><b>Nginx</b><b>Apache</b></div></article></div><div class="tech-marquee" aria-label="Technologies utilisées"><div class="tech-marquee-track"><div v-for="(tech, index) in [...techMarquee, ...techMarquee]" :key="`${tech.name}-${index}`" class="tech-marquee-item"><img v-if="tech.image" :src="tech.image" :alt="tech.name" loading="lazy"><span>{{ tech.name }}</span></div></div></div><div class="experience"><div class="experience-title"><p class="kicker">{{ t('career') }}</p><h3>{{ t('careerTitle') }}</h3></div><div class="timeline"><div class="timeline-item"><span class="timeline-dot"></span><time>2023 — Aujourd’hui</time><div><h4>{{ t('senior') }}</h4><p>{{ t('seniorText') }}</p></div></div><div class="timeline-item"><span class="timeline-dot"></span><time>2021 — 2023</time><div><h4>{{ t('remote') }}</h4><p>{{ t('remoteText') }}</p></div></div><div class="timeline-item"><span class="timeline-dot"></span><time>2019 — 2021</time><div><h4>{{ t('backendRole') }}</h4><p>{{ t('backendRoleText') }}</p></div></div></div></div></div></section>

      <section id="projets" class="projects"><div class="shell"><div class="project-heading"><p class="kicker">03 / INDEX / RÉALISATIONS</p><h2>{{ t('projectsTitle') }}<br><em>{{ t('projectsEm') }}</em></h2><p>{{ t('projectsIntro') }}</p></div><div class="filters"><button v-for="f in ['Tous','SaaS','Web métier','Micro-service']" :key="f" :class="{active:filter===f}" @click="filter=f">{{ projectFilterLabel(f) }}</button></div><div class="project-atlas"><div class="project-list"><button v-for="p in visible" :key="p.name" @click="selectProject(p)" :class="{selected:projects.indexOf(p)===active}"><span>0{{ projects.indexOf(p)+1 }}</span><strong>{{ p.name }}</strong><small>{{ projectKind(p.kind) }}</small><b>↗</b></button></div><article class="project-card"><button class="project-image" type="button" :aria-label="`Agrandir ${currentProject.name}`" @click="openImage(currentProject.images[galleryIndex])"><Transition name="project-image-fade" mode="out-in"><img :key="currentProject.images[galleryIndex]" :src="currentProject.images[galleryIndex]" :alt="`${currentProject.name} — capture ${galleryIndex + 1}`"></Transition><span>PROJECT / 0{{active+1}} · CAPTURE {{ galleryIndex + 1 }} / {{ currentProject.images.length }}</span><i>⌕</i><div class="gallery-dots"><b v-for="(_, index) in currentProject.images" :key="index" :class="{active:index===galleryIndex}" @click.stop="selectGalleryImage(index)"></b></div></button><div class="project-detail"><p class="kicker">{{ projectKind(currentProject.kind) }}</p><h3>{{ currentProject.name }}</h3><p>{{ currentProject.text }}</p><p class="project-impact"><strong>{{ currentImpact }}</strong><span>{{ t('impactLabel') }}</span></p><div class="project-actions"><a v-if="currentProject.url" class="project-button" :href="currentProject.url" target="_blank" rel="noopener"><span>{{ t('projectView') }} ↗</span></a><a class="text-link dark" href="#contact">{{ t('projectDiscuss') }} →</a></div></div></article></div></div></section>

         <WebCupSection />

    </main>
    <ServicesAndGithub />
     <TestimonialsSection />
     <ContactSection />
     <WorkstationSection />
    <Transition name="cv-modal"><div v-if="cvOpen" class="cv-modal" role="dialog" aria-modal="true" aria-label="Curriculum vitae" @click.self="cvOpen=false"><div class="cv-dialog"><header><div><p class="kicker">DOCUMENT / RANDY ANDRIANTSIORY</p><h2>Curriculum <em>vitae.</em></h2></div><button class="cv-close" type="button" @click="cvOpen=false" aria-label="Fermer">×</button></header><div class="cv-viewer"><iframe src="/images/cv/CV_Randy_Andriantsiory_DEV_Backend.pdf" title="CV de Randy Andriantsiory"></iframe></div><footer><span>PDF · Laravel · Symfony · Vue.js</span><a class="cv-download" href="/images/cv/CV_Randy_Andriantsiory_DEV_Backend.pdf" download="CV_Randy_Andriantsiory_DEV_Backend.pdf">Télécharger mon CV ↓</a></footer></div></div></Transition>
    <Transition name="back-to-top"><button v-if="scrollPercent > 12" class="back-to-top" type="button" @click="scrollToTop" aria-label="Revenir en haut"><font-awesome-icon icon="arrow-up" /></button></Transition>
    <footer class="footer shell"><span>© 2026 RANDY ANDRIANTSIORY</span><span>MADE WITH CODE / MADAGASCAR</span><a href="#accueil">REVENIR EN HAUT ↑</a></footer>
    <Transition name="lightbox"><div v-if="selectedImage" class="lightbox" role="dialog" aria-modal="true" aria-label="Aperçu du projet" @click.self="closeImage"><button class="lightbox-close" @click="closeImage" aria-label="Fermer">×</button><img :src="selectedImage" alt="Capture du projet agrandie"><p>Échap ou cliquer à l’extérieur pour fermer</p></div></Transition>
  </div>
</template>
