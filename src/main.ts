import './style.css'

import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faGithub } from '@fortawesome/free-brands-svg-icons'

import App from './App.vue'

library.add(faGithub)

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
