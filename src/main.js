//import { getMode } from "@nano-sql/adapter-sqlite-cordova";
//import { nSQL } from "@nano-sql/core";
import VueLazyInput from 'vue-lazy-input'
import VueTheMask from 'vue-the-mask'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Chat from 'vue-beautiful-chat'
Vue.use(Chat)
Vue.use(VueSweetalert2);
Vue.use(VueLazyInput);
Vue.use(VueTheMask);
Vue.config.productionTip = false

var CoffeCloudVueApp = new Vue({
  vuetify,
  router,
  render: h => h(App)
});

CoffeCloudVueApp.$mount('#app');
