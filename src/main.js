import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/iconfont'

import axios from 'axios'
// 将axios方法直接绑定到原型上面，然后直接通过this.$http就可以使用了
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL=`http://127.0.0.1:8888/api/private/v1/`
// 导入全局样式
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
