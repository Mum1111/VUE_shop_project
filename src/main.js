import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
// 引入axios
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
// 引入font字体图标
import './assets/font/iconfont.css'

// 引入全局的公共样式
import './assets/css/global.css'
Vue.use(ElementUI)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
