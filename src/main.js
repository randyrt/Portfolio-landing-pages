import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import './mobile.css'
import './projects.css'
import './theme.css'
import './cv.css'
import './hero-actions.css'
import './frank-overrides.css'
import './constellation.css'
import './streaming.css'
import './github-theme.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRobot, faBolt, faArrowUp, faTrashCan, faPalette } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faRobot, faBolt, faArrowUp, faTrashCan, faPalette)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
AOS.init({
  duration: 850,
  easing: 'ease-out-cubic',
  offset: 90,
  once: false,
  mirror: true,
  disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 768,
})
app.mount('#app')
