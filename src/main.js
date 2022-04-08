import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
//import routes from './router/routes';
import router from './router/routes';
import i18n from './locales'
import './assets/fonticon/iconfont.css'
import VueCookies  from 'vue-cookies';

// var router = new VueRouter({
//     routes
// })

//새로추가
import Stomp from "webstomp-client";
import SockJS from "sockjs-client";
//
Vue.use(VueRouter);
Vue.use(VueCookies);
Vue.$cookies.config("1d")
Vue.config.productionTip = false


//새로추가 
const serverURL = "/ws";
const socket = new SockJS(serverURL);
const stompClient = Stomp.over(socket);
stompClient.connect({}, ()=>{});
Vue.prototype.$stompClient = stompClient;
//
new Vue({
  i18n,
  render: h => h(App),
  router
}).$mount('#app')
