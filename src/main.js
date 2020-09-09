import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
// 引入axios
import axios from 'axios'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'element-ui/lib/theme-chalk/index.css'
// 引入font字体图标
import './assets/font/iconfont.css'

// 引入全局的公共样式
import './assets/css/global.css'
Vue.use(ElementUI)
Vue.use(VueQuillEditor /* { default global options } */)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
// Do something before request is sent
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, error => {
// Do something with request error
  return Promise.reject(error)
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
