import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
// 初始化插件
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path:'/home',
    component:home,
    redirect: '/welcome',
    children:[
      {
        path:'/welcome',
        component:welcome
      },
      {
        path:'/users',
        component:users
      }
    ]
  },
]

const router = new VueRouter({
  routes
})
// 导航守卫，防止用户没有登录通过url访问其他页面
router.beforeEach((to,form,next)=>{
  if(to.path === '/login'){
    return next()
  }else{
    // 获取token判断用户是否登录
    const tokenStr = sessionStorage.getItem('token');
    if(tokenStr){
      next();
    }else{
      return next('/login');
    }
  }
})

export default router
