import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faHouse, faGraduationCap, faBuildingColumns, faUserGraduate, faClipboardList, faUserCheck, faBars, faRectangleList, faUserPlus, faCircleUser, faChartSimple, faAngleRight, faCommentDots, faBell, faCircleArrowLeft} from '@fortawesome/free-solid-svg-icons'
import { faClipboardCheck, faTrophy } from '@fortawesome/free-solid-svg-icons'
import VueApexCharts from 'vue3-apexcharts'

library.add(faTrash, faUpload, faHouse, faGraduationCap, faBuildingColumns, faUserGraduate, faClipboardList, faUserCheck, faBars, faRectangleList, faUserPlus, faChartSimple, faAngleRight, faCommentDots, faBell, faCircleUser, faCircleArrowLeft,faClipboardCheck, faTrophy)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
app.use(VueApexCharts);

app.mount('#app')