<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import AOS from 'aos'
import FrankAIstein from './components/FrankAIstein.vue'
import ServicesAndGithub from './components/ServicesAndGithub.vue'
import ContactSection from './components/ContactSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import ConstellationAnimation from './components/ConstellationAnimation.vue'

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
const primaryColor = ref(localStorage.getItem('portfolio-primary-color') || localStorage.getItem('primary-color-preference') || '#d52abe')
const streamingText = ref('')
const streamingPhrases = ['Randy Andriantsiory', 'Développeur Full-Stack', 'DevOps Engineer', 'Architecture applicative']
const techMarquee = [
  { name: 'PHP', image: '/images/tecnos/php.png' },
  { name: 'Python', image: '/images/tecnos/python.png' },
  { name: 'FastAPI', image: '/images/tecnos/fastAPI.png' },
  { name: 'Symfony', image: '/images/tecnos/synfony.png' },
  { name: 'Laravel', image: '/images/tecnos/laravel.png' },
  { name: 'Vue.js', image: '/images/tecnos/vuejs.jpg' },
  { name: 'React', image: '/images/tecnos/react.webp' },
  { name: 'JavaScript', image: '/images/tecnos/js.png' },
  { name: 'TypeScript', image: '/images/tecnos/typescript.png' },
  { name: 'Tailwind', image: '/images/tecnos/tailwinds.png' },
  { name: 'WordPress', image: '/images/tecnos/wordpress.webp' },
  { name: 'Docker', image: '/images/tecnos/docker.png' },
  { name: 'Terraform', image: '/images/tecnos/terraform.png' },
  { name: 'Git', image: '/images/tecnos/git.png' },
]
let streamTimeout
let streamIndex = 0
let streamChar = 0
let streamDeleting = false
const projects = [
  { name: 'Mastery Pro', kind: 'SaaS fiduciaire', type: 'SaaS', images: ['/images/projects/fid-connect/capture12.png','/images/projects/fid-connect/capture0.png','/images/projects/fid-connect/capture3.png','/images/projects/fid-connect/capture7.png','/images/projects/fid-connect/capture10.png'], image: '/images/projects/fid-connect/capture12.png', url: 'https://mastery-pro.be/', text: 'Plateforme tout-en-un qui centralise la gestion comptable, fiscale et administrative des entreprises.', tags: 'Vue.js · Laravel · MySQL · TailwindCSS · Redis' },
  { name: 'ECHO WEBLINE', kind: 'Imagerie cardiovasculaire', type: 'Web', images: ['/images/projects/echo-webLine/echo-1.PNG','/images/projects/echo-webLine/echo-3.PNG','/images/projects/echo-webLine/echo-4.PNG','/images/projects/echo-webLine/echo-6.PNG','/images/projects/echo-webLine/echo-8.PNG'], image: '/images/projects/echo-webLine/echo-1.PNG', url: 'https://www.echowebline.com/', text: 'Plateforme web pour présenter des contenus médicaux, gérer les congrès et valoriser une communauté professionnelle.', tags: 'React.js · Symfony · Imagerie médicale · Redis' },
  { name: 'INFI-SWAP', kind: 'Mise en relation santé', type: 'Web', images: ['/images/projects/swap/swap1.png','/images/projects/swap/swap2.png','/images/projects/swap/swap3.png','/images/projects/swap/swap4.png','/images/projects/swap/swap5.png','/images/projects/swap/swap6.png'], image: '/images/projects/swap/swap1.png', url: 'https://infiswap.be/', text: 'Solution qui connecte directement les établissements de santé avec les infirmiers disponibles.', tags: 'Nuxt.js · Symfony · Matching · Planning' },
  { name: 'PETSFOLLOW PRO', kind: 'Application vétérinaire', type: 'SaaS', images: ['/images/projects/petsfollow-pro/1.webp','/images/projects/petsfollow-pro/2.webp','/images/projects/petsfollow-pro/3.webp'], image: '/images/projects/petsfollow-pro/1.webp', url: 'https://petsfollow.app/', text: 'Application qui centralise le personnel, les rendez-vous, les dossiers médicaux et la relation client.', tags: 'Vue.js · Laravel · API métier · Docker' },
  { name: 'E-LEARNING', kind: 'Formation en ligne', type: 'Web', images: ['/images/projects/E-learning/1.webp','/images/projects/E-learning/2.webp','/images/projects/E-learning/3.webp','/images/projects/E-learning/4.webp','/images/projects/E-learning/5.webp'], image: '/images/projects/E-learning/1.webp', text: 'Plateforme SaaS dédiée à l’apprentissage en ligne, aux quiz, certificats et tableaux de bord.', tags: 'React.js · Symfony · Paiement · Analytics' },
  { name: 'AFR-FAN', kind: 'Réseau social', type: 'Freelance', images: ['/images/projects/afr/afr-1.PNG','/images/projects/afr/afr-2.PNG','/images/projects/afr/afr-3.PNG','/images/projects/afr/afr-4.PNG'], image: '/images/projects/afr/afr-1.PNG', text: 'Un réseau social pensé pour la communauté africaine, ses groupes et ses contenus.', tags: 'Vue.js · Laravel · VISA · PayPal' }
]
const visible = computed(() => filter.value === 'Tous' ? projects : projects.filter(p => p.type === filter.value))
const currentProject = computed(() => projects[active.value])
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
function runStreamingText() {
  const phrase = streamingPhrases[streamIndex]
  if (!streamDeleting) {
    streamingText.value = phrase.slice(0, streamChar + 1)
    streamChar++
    if (streamChar >= phrase.length) { streamDeleting = true; streamTimeout = window.setTimeout(runStreamingText, 1500); return }
  } else {
    streamingText.value = phrase.slice(0, streamChar - 1)
    streamChar--
    if (streamChar <= 0) { streamDeleting = false; streamIndex = (streamIndex + 1) % streamingPhrases.length }
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
  document.querySelectorAll('.signal-grid,.expertise-head,.skill-grid,.experience,.project-heading,.project-atlas,.manifest-grid,.contact-grid').forEach(el => { el.classList.add('reveal'); observer.observe(el) })
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      animateAboutStats()
      statsObserver.disconnect()
    }
  }, { threshold: .35 })
  const statsElement = document.querySelector('.stats')
  if (statsElement) statsObserver.observe(statsElement)
  const aosDirections = [['.signal', 'fade-up'], ['.expertise', 'fade-right'], ['.projects', 'fade-left'], ['.manifest', 'fade-up'], ['.contact', 'zoom-in']]
  aosDirections.forEach(([selector, animation]) => document.querySelector(selector)?.setAttribute('data-aos', animation))
  document.querySelectorAll('.skill-card').forEach((card, index) => { card.setAttribute('data-aos', index === 1 ? 'fade-up' : index === 0 ? 'fade-right' : 'fade-left'); card.setAttribute('data-aos-delay', String(index * 120)) })
  document.querySelectorAll('.timeline-item').forEach((item, index) => { item.setAttribute('data-aos', index % 2 ? 'fade-left' : 'fade-right'); item.setAttribute('data-aos-delay', String(index * 100)) })
  requestAnimationFrame(() => AOS.refreshHard())
  window.addEventListener('scroll', updateScrollProgress)
  window.addEventListener('keydown', handleEscape)
  updateScrollProgress()
  updatePrimaryColor()
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
  <div class="site">
    <FrankAIstein />
    <header class="nav shell">
      <a href="#accueil" class="brand">RANDY ANDRIANTSIORY<span> / PORTFOLIO</span></a>
      <button class="hamburger" @click="menuOpen=!menuOpen" aria-label="Menu">☰</button>
      <nav :class="{open: menuOpen}">
        <a href="#signal" @click="menuOpen=false">À propos</a><a href="#expertise" @click="menuOpen=false">Expertise</a><a href="#services" @click="menuOpen=false">Services</a><a href="#github" @click="menuOpen=false">GitHub</a><a href="#temoignages" @click="menuOpen=false">Témoignages</a><a href="#projets" @click="menuOpen=false">Projets</a><a href="#contact" @click="menuOpen=false">Contact</a>
        <b><i></i> Disponible pour missions</b>
      </nav>
      <label class="theme-picker floating-theme-picker" title="Changer la couleur principale"><input v-model="primaryColor" type="color" @input="updatePrimaryColor" aria-label="Choisir la couleur principale"><font-awesome-icon icon="palette" /></label>
    </header>

    <main>
       <section id="accueil" class="hero" data-aos="fade-in" data-aos-duration="1000">
         <div class="hero-grid shell">
          <div class="hero-copy" data-aos="fade-right" data-aos-delay="150">
            <p class="kicker">PORTFOLIO / 2026 <span>•</span> MADAGASCAR / TANANARIVE</p>
            <h1>Je transforme vos idées en produits numériques <em>modernes et scalables.</em></h1>
            <p class="lede">Je suis Randy, développeur PHP / Full-Stack et DevOps, passionné par la création d’applications modernes, rapides et pensées pour l’utilisateur.</p>
          </div>
          <div class="portrait-wrap" data-aos="fade-left" data-aos-delay="300"><div class="hero-streaming"><span>{{ streamingText }}</span><i></i></div><figure class="portrait"><img src="/images/me/randy.jpg" alt="Portrait de Randy Andriantsiory"><figcaption>RANDY ANDRIANTSIORY / CODE · BUILD · DEPLOY</figcaption></figure><div class="orb"><span></span><span></span><span></span><span></span><div class="orb-core">✦</div></div><div class="actions hero-photo-actions"><a class="button" href="#projets">Voir les preuves <span>↓</span></a><button class="cv-button" type="button" @click="openCv">CV / PDF <span>↗</span></button></div><p class="time">00:00:18<br>SCROLL TO ENTER</p></div>
        </div>
      </section>

       <section id="signal" class="signal"><div class="shell signal-grid"><div class="chapter">CHAPITRE <b>01</b> LE PROFIL</div><div class="signal-copy"><p class="kicker">DU BESOIN À LA SOLUTION</p><h2>Le code au service d’idées <em>qui avancent.</em></h2><p>Je conçois des applications web et mobiles en mêlant qualité technique, UX/UI design et efficacité de livraison.</p><p>JavaScript, Vue.js, React.js, TypeScript, PHP, Laravel, Symfony, Redis et Docker sont mes outils pour construire des solutions solides et évolutives.</p></div><div class="signal-art"><ConstellationAnimation /></div><dl class="stats"><div><dt>{{ aboutStats.years }}+</dt><dd>ans d’expérience</dd></div><div><dt>{{ aboutStats.projects }}+</dt><dd>projets réalisés</dd></div><div><dt>∞</dt><dd>envie<br>d’apprendre</dd></div></dl></div></section>

      <section id="expertise" class="expertise"><div class="shell"><div class="expertise-head"><div><p class="kicker violet">02 / EXPERTISE</p><h2>Une stack pensée<br>pour le <em>réel.</em></h2></div><p>Du premier écran jusqu’au déploiement, je transforme des contraintes métier en expériences rapides, fiables et maintenables.</p></div><div class="skill-grid"><article class="skill-card skill-vue"><span class="skill-number">01</span><div class="skill-icon">⌁</div><h3>Frontend</h3><p>Des interfaces lisibles et réactives, pensées pour les utilisateurs et les équipes.</p><div class="badges"><b>Vue.js 3</b><b>React.js</b><b>TypeScript</b><b>Tailwind</b><b>WordPress</b></div></article><article class="skill-card skill-laravel"><span class="skill-number">02</span><div class="skill-icon">◈</div><h3>Backend</h3><p>Des APIs et architectures métier solides, sécurisées et prêtes à évoluer.</p><div class="badges"><b>PHP</b><b>Symfony</b><b>Laravel</b><b>MySQL</b><b>Python (FastAPI)</b></div></article><article class="skill-card skill-devops"><span class="skill-number">03</span><div class="skill-icon">↗</div><h3>DevOps & qualité</h3><p>Automatiser les livraisons et rendre la production plus sereine.</p><div class="badges"><b>Docker</b><b>CI/CD</b><b>GitHub Actions</b><b>Linux</b><b>Terraform</b></div></article></div><div class="tech-marquee" aria-label="Technologies utilisées"><div class="tech-marquee-track"><div v-for="(tech, index) in [...techMarquee, ...techMarquee]" :key="`${tech.name}-${index}`" class="tech-marquee-item"><img :src="tech.image" :alt="tech.name" loading="lazy"><span>{{ tech.name }}</span></div></div></div><div class="experience"><div class="experience-title"><p class="kicker">PARCOURS / EXPÉRIENCE</p><h3>Les étapes qui<br>m’ont construit.</h3></div><div class="timeline"><div class="timeline-item"><span class="timeline-dot"></span><time>2023 — Aujourd’hui</time><div><h4>Développeur Senior Full-Stack</h4><p>Conception d’applications complexes avec Laravel, Symfony, Vue.js et Nuxt.js. Performance, sécurité, CI/CD et accompagnement d’équipes.</p></div></div><div class="timeline-item"><span class="timeline-dot"></span><time>2021 — 2023</time><div><h4>Développeur Full-Stack · Remote</h4><p>Solutions web sur mesure pour des clients locaux et internationaux, intégrations de paiements et APIs tierces.</p></div></div><div class="timeline-item"><span class="timeline-dot"></span><time>2019 — 2021</time><div><h4>Développeur Web Backend</h4><p>Applications Laravel, bases de données, APIs REST, authentification et collaboration Git/GitLab.</p></div></div></div></div></div></section>

      <section id="projets" class="projects"><div class="shell"><div class="project-heading"><p class="kicker coral">03 / INDEX / RÉALISATIONS</p><h2>Des systèmes<br><em>en mouvement.</em></h2><p>Quelques terrains où j’ai transformé des contraintes métier en produits concrets.</p></div><div class="filters"><button v-for="f in ['Tous','SaaS','Web','Freelance']" :key="f" :class="{active:filter===f}" @click="filter=f">{{ f }}</button></div><div class="project-atlas"><div class="project-list"><button v-for="p in visible" :key="p.name" @click="selectProject(p)" :class="{selected:projects.indexOf(p)===active}"><span>0{{ projects.indexOf(p)+1 }}</span><strong>{{ p.name }}</strong><small>{{ p.kind }}</small><b>↗</b></button></div><article class="project-card"><button class="project-image" type="button" :aria-label="`Agrandir ${currentProject.name}`" @click="openImage(currentProject.images[galleryIndex])"><Transition name="project-image-fade" mode="out-in"><img :key="currentProject.images[galleryIndex]" :src="currentProject.images[galleryIndex]" :alt="`${currentProject.name} — capture ${galleryIndex + 1}`"></Transition><span>PROJECT / 0{{active+1}} · CAPTURE {{ galleryIndex + 1 }} / {{ currentProject.images.length }}</span><i>⌕</i><div class="gallery-dots"><b v-for="(_, index) in currentProject.images" :key="index" :class="{active:index===galleryIndex}" @click.stop="selectGalleryImage(index)"></b></div></button><div class="project-detail"><p class="kicker">{{ currentProject.kind }}</p><h3>{{ currentProject.name }}</h3><p>{{ currentProject.text }}</p><div class="tags"><b v-for="tag in currentProject.tags.split(' · ')" :key="tag">{{ tag }}</b></div><div class="project-actions"><a v-if="currentProject.url" class="project-button" :href="currentProject.url" target="_blank" rel="noopener">Voir le projet ↗</a><a class="text-link dark" href="#contact">Parler de ce projet →</a></div></div></article></div></div></section>

      <section class="manifest"><div class="shell"><p class="kicker">02 / MA MANIÈRE DE TRAVAILLER</p><h2>La technique au service<br>des <em>métiers.</em></h2><div class="manifest-grid"><div><b>01</b><h3>Comprendre</h3><p>Clarifier les usages, les enjeux et les vrais problèmes avant d’écrire une ligne de code.</p></div><div><b>02</b><h3>Construire</h3><p>Concevoir des architectures simples, robustes et capables d’accompagner la croissance.</p></div><div><b>03</b><h3>Transmettre</h3><p>Documenter, automatiser et livrer des systèmes que les équipes peuvent faire évoluer.</p></div></div></div></section>

    </main>
    <ServicesAndGithub />
    <TestimonialsSection />
    <ContactSection />
    <Transition name="cv-modal"><div v-if="cvOpen" class="cv-modal" role="dialog" aria-modal="true" aria-label="Curriculum vitae" @click.self="cvOpen=false"><div class="cv-dialog"><header><div><p class="kicker">DOCUMENT / RANDY ANDRIANTSIORY</p><h2>Curriculum <em>vitae.</em></h2></div><button class="cv-close" type="button" @click="cvOpen=false" aria-label="Fermer">×</button></header><div class="cv-viewer"><iframe src="/images/cv/CV_Randy_Andriantsiory_Laravel_symfony.pdf" title="CV de Randy Andriantsiory"></iframe></div><footer><span>PDF · Laravel · Symfony · Vue.js</span><a class="cv-download" href="/images/cv/CV_Randy_Andriantsiory_Laravel_symfony.pdf" download="CV_Randy_Andriantsiory_Laravel_symfony.pdf">Télécharger mon CV ↓</a></footer></div></div></Transition>
    <Transition name="back-to-top"><button v-if="scrollPercent > 12" class="back-to-top" type="button" @click="scrollToTop" aria-label="Revenir en haut"><font-awesome-icon icon="arrow-up" /></button></Transition>
    <footer class="footer shell"><span>© 2026 RANDY ANDRIANTSIORY</span><span>MADE WITH CODE / MADAGASCAR</span><a href="#accueil">REVENIR EN HAUT ↑</a></footer>
    <Transition name="lightbox"><div v-if="selectedImage" class="lightbox" role="dialog" aria-modal="true" aria-label="Aperçu du projet" @click.self="closeImage"><button class="lightbox-close" @click="closeImage" aria-label="Fermer">×</button><img :src="selectedImage" alt="Capture du projet agrandie"><p>Échap ou cliquer à l’extérieur pour fermer</p></div></Transition>
  </div>
</template>
