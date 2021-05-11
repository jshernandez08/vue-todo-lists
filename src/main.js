import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.config.productionTip = false
Vue.use(require("moment"));
Vue.use(Buefy);

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
