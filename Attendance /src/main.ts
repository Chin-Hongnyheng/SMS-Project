import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse, faGraduationCap, faBuildingColumns, faUserGraduate, faClipboardList, faUserCheck, faBars, faRectangleList, faUserPlus, faCircleUser, faChartSimple, faAngleRight, faCommentDots, faBell, faCircleArrowLeft} from '@fortawesome/free-solid-svg-icons'

library.add(faHouse, faGraduationCap, faBuildingColumns, faUserGraduate, faClipboardList, faUserCheck, faBars, faRectangleList, faUserPlus, faChartSimple, faAngleRight, faCommentDots, faBell, faCircleUser, faCircleArrowLeft)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
