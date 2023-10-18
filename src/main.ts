import App from "@/App.vue";
import Notifications from '@kyvg/vue3-notification'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPhone, faPlus, faThumbsUp, faCheck, faSearch, faBookmark, faPen, faCross, faTimes, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPhone, faPlus, faThumbsUp, faCheck, faSearch, faBookmark, faPen, faCross, faTimes, faDownload);

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
app.component("font-awesome-icon", FontAwesomeIcon).use(Notifications).mount("#app");

// npm install @fortawesome/fontawesome-svg-core
// npm install @fortawesome/free-solid-svg-icons
// npm install @fortawesome/vue-fontawesome@latest-3
