import Vue from 'vue'
import App from './App.vue'
import './plugins/ant-design-vue.js'
import router from './router'
import directives from './directives.js';

Vue.use(directives);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
