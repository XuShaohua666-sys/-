import Vue from 'vue'
import { Button,Form,FormItem,Input,Row,Message } from 'element-ui'
//import { Button,Form,FormItem,Input } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
// 需要全局挂载到原型
Vue.prototype.$message = Message