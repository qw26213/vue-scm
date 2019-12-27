import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './styles/element-variables.scss';
import axios from "./utils/request";

import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import './icons'
import './permission'

import * as filters from './filters'

Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
