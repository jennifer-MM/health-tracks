import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios' //we import axios from installed dependencies

Vue.config.productionTip = false

Vue.use(axios) 

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  render: h => h(App)
}).$mount('#app')
