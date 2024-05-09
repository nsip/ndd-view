import App from "@/App.vue";
import vue3Spinner from 'vue3-spinner';
import Notifications from '@kyvg/vue3-notification'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPhone, faPlus, faThumbsUp, faCheck, faSearch, faBookmark, faPen, faCross, faTimes, faDownload, faUpload, faCheckSquare, faFileCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPhone, faPlus, faThumbsUp, faCheck, faSearch, faBookmark, faPen, faCross, faTimes, faDownload, faUpload, faCheckSquare, faFileCircleCheck);

// import { globalCookiesConfig } from "vue3-cookies";
// globalCookiesConfig({
//     expireTimes: "30d",
//     path: "/",
//     domain: "",
//     secure: false,
//     sameSite: "Lax",
// });

// createApp(App).mount('#app')

const app = createApp(App)
app.component("font-awesome-icon", FontAwesomeIcon).use(vue3Spinner).use(Notifications).mount("#app");

// npm install @fortawesome/fontawesome-svg-core
// npm install @fortawesome/free-solid-svg-icons
// npm install @fortawesome/vue-fontawesome@latest-3
