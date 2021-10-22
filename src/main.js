import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuex from "vuex";
import Axios from "axios"

Vue.config.productionTip = false;
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
Axios.defaults.xsrfCookieName = "XCSRF-TOKEN";
Axios.defaults.withCredentials = false;

Vue.use(Vuex)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
