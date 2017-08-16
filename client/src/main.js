import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import routeDefs from './routes';
import moment from 'moment';
import Chartkick from 'chartkick';
import VueChartkick from 'vue-chartkick';
import Chart from 'chart.js';

const router = new VueRouter({
  routes: routeDefs.routes
});

Vue.use(VueRouter);
Vue.use(VueChartkick, { Chartkick });

Vue.prototype.moment = moment;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

// router.push('/projects');
