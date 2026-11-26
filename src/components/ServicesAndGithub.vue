<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { t, language } from '../i18n'

const github = ref({ repos: 25, followers: 0, commits: 0 })
const githubAnimated = ref({ repos: 0, followers: 0, commits: 0 })
const githubReady = ref(false)
const githubVisible = ref(false)
const githubAnimationStarted = ref(false)
const technologies = ref([
  { name: 'PHP', count: 34 }, { name: 'JavaScript', count: 28 }, { name: 'TypeScript', count: 18 },
  { name: 'Java', count: 1 },
  { name: 'Vue', count: 14 }, { name: 'HTML', count: 10 }, { name: 'CSS', count: 8 },
])
const maxTechnology = computed(() => Math.max(...technologies.value.map(technology => technology.count), 1))
const services = [
  { icon: '⌘', title: 'Développement sur mesure', text: 'Applications web et mobiles pensées pour vos usages, de l’interface à l’API.', points: ['Vue.js · React · Nuxt', 'Laravel · Symfony · Node.js', 'APIs REST et intégrations'] },
  { icon: '◈', title: 'DevOps & déploiement', text: 'Des environnements fiables et des livraisons maîtrisées, de votre machine à la production.', points: ['Docker · Kubernetes · Terraform', 'CI/CD GitHub Actions', 'Linux · sécurité · monitoring'] },
  { icon: '↗', title: 'Conseil & architecture', text: 'Clarifier le besoin, structurer le produit et choisir les technologies qui servent réellement le projet.', points: ['Architecture évolutive', 'Documentation fonctionnelle', 'Performance et qualité'] },
  { icon: '✦', title: 'Maintenance & évolution', text: 'Faire vivre un produit existant, corriger les frictions et préparer ses prochaines étapes.', points: ['Audit et optimisation', 'Refactoring sécurisé', 'Accompagnement d’équipe'] },
]
const servicesEn = [
  { title: 'Custom development', text: 'Web and mobile applications designed for your needs, from interface to API.', points: ['Vue.js · React · Nuxt', 'Laravel · Symfony · Node.js', 'REST APIs and integrations'] },
  { title: 'DevOps & deployment', text: 'Reliable environments and controlled releases, from your machine to production.', points: ['Docker · Kubernetes · Terraform', 'CI/CD GitHub Actions', 'Linux · security · monitoring'] },
  { title: 'Consulting & architecture', text: 'Clarify the need, structure the product and choose technologies that truly serve the project.', points: ['Scalable architecture', 'Functional documentation', 'Performance and quality'] },
  { title: 'Maintenance & evolution', text: 'Keep an existing product moving, remove friction and prepare its next steps.', points: ['Audit and optimization', 'Safe refactoring', 'Team support'] },
]
const localService = (service, index, field) => language.value === 'en' ? servicesEn[index][field] : service[field]

function animateGithubStats() {
  if (githubAnimationStarted.value) return
  githubAnimationStarted.value = true
  const start = performance.now()
  const duration = 1500
  const update = now => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    githubAnimated.value = {
      repos: Math.round(github.value.repos * eased),
      followers: Math.round(github.value.followers * eased),
      commits: Math.round(github.value.commits * eased),
    }
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

onMounted(async () => {
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      githubVisible.value = true
      if (githubReady.value) {
        animateGithubStats()
        statsObserver.disconnect()
      }
    }
  }, { threshold: .3 })
  const githubStats = document.querySelector('#github .github-stats')
  if (githubStats) statsObserver.observe(githubStats)
  try {
    const headers = import.meta.env.VITE_GITHUB_TOKEN ? { Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}` } : {}
    const [profile, repos] = await Promise.all([
      fetch('https://api.github.com/users/randyrt', { headers }).then(response => response.json()),
      fetch('https://api.github.com/users/randyrt/repos?per_page=100', { headers }).then(response => response.json()),
    ])
    const languageCounts = {}
    if (Array.isArray(repos)) repos.forEach(repo => { if (repo.language) languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1 })
    const sortedLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])
    const detected = sortedLanguages.slice(0, 8).map(([name, count]) => ({ name, count }))
    // Keep Java visible when the new Spring Boot repository is outside the top 8.
    const java = languageCounts.Java
    if (java && !detected.some(technology => technology.name === 'Java')) {
      detected[detected.length - 1] = { name: 'Java', count: java }
    }
    if (detected.length) technologies.value = detected
    let totalCommits = 0
    if (Array.isArray(repos)) {
      const commitCounts = await Promise.all(repos.map(async repo => {
        try {
          const response = await fetch(`https://api.github.com/repos/randyrt/${repo.name}/commits?author=randyrt&per_page=1`, { headers })
          const link = response.headers.get('link') || ''
          const lastPage = link.match(/[?&]page=(\d+)>; rel="last"/)
          if (lastPage) return Number(lastPage[1])
          const commits = await response.json()
          return Array.isArray(commits) ? commits.length : 0
        } catch { return 0 }
      }))
      totalCommits = commitCounts.reduce((sum, count) => sum + count, 0)
    }
    github.value = {
      repos: Math.max(25, Array.isArray(repos) ? repos.length : profile.public_repos ?? 25),
      followers: Number(profile.followers) || 0,
      commits: totalCommits,
    }
  } catch { /* Les valeurs publiques par défaut restent visibles hors connexion. */ }
  githubReady.value = true
  if (githubVisible.value) {
    animateGithubStats()
    statsObserver.disconnect()
  }
})

watch(githubReady, ready => {
  if (ready && githubVisible.value) animateGithubStats()
})
</script>

<template>
  <section id="services" class="services-section" data-aos="fade-up">
    <div class="shell">
      <div class="services-heading" data-aos="fade-right"><div><p class="kicker">05 / SERVICES</p><h2>{{ t('servicesTitle') }}<br><em>{{ t('servicesEm') }}</em></h2></div><p>{{ language === 'fr' ? 'Une expertise technique mise au service d’équipes qui veulent transformer une idée en produit fiable.' : 'Technical expertise for teams that want to turn an idea into a reliable product.' }}</p></div>
      <div class="services-grid"><article v-for="(service, index) in services" :key="service.title" class="service-card" data-aos="fade-up" :data-aos-delay="index * 100"><span class="service-index">0{{ index + 1 }}</span><div class="service-icon">{{ service.icon }}</div><h3>{{ localService(service, index, 'title') }}</h3><p>{{ localService(service, index, 'text') }}</p><ul><li v-for="point in localService(service, index, 'points')" :key="point">{{ point }}</li></ul></article></div>
    </div>
  </section>

  <section id="github" class="github-section" data-aos="fade-up"><div class="shell github-layout"><div class="github-copy"><p class="kicker">06 / GITHUB</p><h2>{{ t('githubTitle') }}<br><em>{{ t('githubEm') }}</em></h2><p>{{ t('githubText') }}</p><a class="github-button" href="https://github.com/randyrt" target="_blank" rel="noopener">{{ language === 'fr' ? 'Voir mon profil GitHub' : 'View my GitHub profile' }} ↗</a></div><div class="github-card"><div class="github-card-head"><span class="github-mark">◉</span><div><strong>github.com/randyrt</strong><small>Full Stack Developer · Madagascar</small></div><span class="online-dot"></span></div><div class="github-stats"><div><b>{{ githubAnimated.repos }}+</b><span>repositories</span></div><div><b>{{ githubAnimated.commits }}</b><span>{{ language === 'fr' ? 'commits totaux' : 'total commits' }}</span></div></div><div class="github-tech"><div class="github-tech-heading"><h3>{{ language === 'fr' ? 'Technologies utilisées' : 'Technologies used' }}</h3><small>LANGUAGES / REPOSITORIES</small></div><div v-for="technology in technologies" :key="technology.name" class="technology-row"><span>{{ technology.name }}</span><div><i :style="{width: `${Math.max(12, technology.count / maxTechnology * 100)}%`}"></i></div><b>{{ technology.count }}</b></div></div><div class="contribution-grid" aria-hidden="true"><i v-for="n in 56" :key="n" :class="`level-${(n * 7 + 3) % 5}`"></i></div><small class="github-caption">ACTIVITY / OPEN SOURCE / BUILD IN PUBLIC</small></div></div></section>
</template>

<style scoped>
.services-section{position:relative;padding:140px 0;background:linear-gradient(145deg,#e9edff,#dce5ff);color:var(--ink);overflow:hidden}.services-section:before{content:'';position:absolute;inset:0;opacity:.4;background-image:radial-gradient(#8878ff33 1px,transparent 1px);background-size:22px 22px;mask-image:linear-gradient(90deg,#000,transparent 78%)}.services-section .shell{position:relative}.services-heading{display:grid;grid-template-columns:1fr .48fr;align-items:end;margin-bottom:68px}.services-heading h2,.github-copy h2{font:600 clamp(53px,7vw,100px)/.83 var(--heading-font);letter-spacing:-.07em;margin:18px 0 0}.services-heading h2 em,.github-copy h2 em{font-style:italic;color:var(--primary-deep)}.services-heading>p{max-width:300px;line-height:1.6;color:#4b5874}.services-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.service-card{position:relative;min-height:370px;padding:25px 22px;border:1px solid #8d9bc844;border-radius:var(--radius-md);background:#ffffffa8;box-shadow:0 18px 45px #5266a31c;transition:transform .35s,box-shadow .35s,background .35s}.service-card:hover{transform:translateY(-10px);background:#fff;box-shadow:0 25px 60px #5266a344}.service-index{font:10px 'DM Mono';color:var(--primary-deep)}.service-icon{margin:32px 0 18px;color:var(--primary-deep);font:38px var(--heading-font)}.service-card h3{font:600 23px/1.05 var(--heading-font);letter-spacing:-.04em;margin:0 0 14px}.service-card>p{min-height:72px;color:#526078;font-size:13px;line-height:1.55}.service-card ul{padding:14px 0 0;margin:15px 0 0;border-top:1px solid #63729455;list-style:none;color:#33415f;font:10px 'DM Mono';line-height:2}.service-card li:before{content:'→';color:var(--mint);margin-right:7px}.github-section{padding:145px 0;background:#0b1328;color:var(--text);overflow:hidden}.github-layout{display:grid;grid-template-columns:.8fr 1.2fr;gap:110px;align-items:center}.github-copy>p:not(.kicker){max-width:350px;color:var(--muted);line-height:1.6}.github-button{display:inline-flex;margin-top:30px;padding:14px 18px;border:1px solid var(--mint);border-radius:999px;color:var(--text);font:11px 'Manrope';text-decoration:none;transition:.3s}.github-button:hover{background:var(--mint);color:var(--ink);transform:translateY(-3px)}.github-card{padding:28px;border:1px solid #8290bd55;border-radius:var(--radius-md);background:linear-gradient(145deg,#172441,#101a33);box-shadow:var(--shadow-deep)}.github-card-head{display:flex;align-items:center;gap:13px;padding-bottom:24px;border-bottom:1px solid #ffffff1b}.github-mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#0a1020;color:var(--mint);font-size:28px}.github-card-head strong,.github-card-head small{display:block}.github-card-head strong{font:600 16px var(--heading-font)}.github-card-head small{color:var(--muted);font-size:11px;margin-top:4px}.online-dot{width:8px;height:8px;border-radius:50%;background:var(--mint);box-shadow:0 0 14px var(--mint);margin-left:auto}.github-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:25px 0}.github-stats b,.github-stats span{display:block}.github-stats b{font:600 28px var(--heading-font);color:var(--amber)}.github-stats span{margin-top:4px;color:var(--muted);font-size:10px}.contribution-grid{display:grid;grid-template-columns:repeat(14,1fr);gap:6px;padding:19px 0;border-top:1px solid #ffffff1b}.contribution-grid i{aspect-ratio:1;border-radius:3px;background:#1b2e4e}.contribution-grid i.level-1{background:#1c5e5b}.contribution-grid i.level-2{background:#258f7d}.contribution-grid i.level-3{background:#35c8a5}.contribution-grid i.level-4{background:#a0f5d8}.github-caption{color:#7585a6;font:9px 'Manrope';letter-spacing:.1em}
@media(max-width:900px){.services-grid{grid-template-columns:repeat(2,1fr)}.github-layout{gap:55px}}
@media(max-width:600px){.services-section,.github-section{padding:90px 0}.services-heading,.github-layout{display:block}.services-heading>p{margin-top:25px}.services-grid{grid-template-columns:1fr}.service-card{min-height:0}.github-card{margin-top:45px;padding:20px}.github-stats{grid-template-columns:repeat(2,1fr);gap:20px}.contribution-grid{gap:4px}}
.github-tech{padding:22px 0;border-top:1px solid #ffffff1b}.github-tech-heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.github-tech-heading h3{font:600 15px var(--heading-font);margin:0}.github-tech-heading small{font:9px 'Manrope';color:#7585a6}.technology-row{display:grid;grid-template-columns:90px 1fr 28px;align-items:center;gap:10px;margin:10px 0;color:#dce5fb;font:10px 'Manrope'}.technology-row>div{height:6px;border-radius:99px;background:#ffffff14;overflow:hidden}.technology-row i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--mint),var(--primary));box-shadow:0 0 10px #2fc8a366}.technology-row b{color:var(--amber);font-weight:600;text-align:right}
</style>
