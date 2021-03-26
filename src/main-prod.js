import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* import './plugins/element.js' */
import './plugins/iconfont'
import './plugins/fonts/iconfont.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'


// 导入全局样式
import './assets/css/global.css'
import axios from 'axios'

// 导入进度条包对应的js和css
import NProgress from 'nprogress'

// tree-table
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// 配置请求的根路径
axios.defaults.baseURL=`http://127.0.0.1:8888/api/private/v1/`
// 请求拦截器，在请求头中加入token
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token');
  // 在请求拦截器中展示进度条
  NProgress.start();
  return config;
})
// 响应拦截器
axios.interceptors.response.use(response => {
    // 在响应拦截器中隐藏进度条
    NProgress.done();  
return response;
},error => {
// Do something with response error
return Promise.reject(error);
});
// 将axios方法直接绑定到原型上面，然后直接通过this.$http就可以使用了
Vue.prototype.$http = axios

// 时间过滤器
Vue.filter('format', function(val,arg){
  function dateFormat(date, format) {
    if (typeof date === "string") {
        var mts = date.match(/(\/Date\((\d+)\)\/)/);
        if (mts && mts.length >= 3) {
            date = parseInt(mts[2]);
        }
    }
    date = new Date(date);
    if (!date || date.toUTCString() == "Invalid Date") {
        return "";
    }
    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };

    format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
}
  return dateFormat(val, arg);
  });

Vue.config.productionTip = false
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
