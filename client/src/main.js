import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routeDefs from './routes';

const router = new VueRouter({
  routes: routeDefs.routes
})

Vue.use(VueRouter);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

router.push('/projects')
