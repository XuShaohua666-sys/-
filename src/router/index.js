import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载形式 导入路由
const login = () => import( /* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
const home = () => import( /* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
const welcome = () => import( /* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')
// import login from '../components/login.vue'
//import home from '../components/home.vue'
//import welcome from '../components/welcome.vue'

const users = () => import( /* webpackChunkName: "users_rights_roles" */ '../components/user/users.vue')
const rights = () => import( /* webpackChunkName: "users_rights_roles" */ '../components/power/rights.vue')
const roles = () => import( /* webpackChunkName: "users_rights_roles" */ '../components/power/roles.vue')
// import users from '../components/user/users.vue'
//import rights from '../components/power/rights.vue'
//import roles from '../components/power/roles.vue'

const goods_list = () => import( /* webpackChunkName: "goods_list_add" */ '../components/goods/list.vue')
const add = () => import( /* webpackChunkName: "goods_list_add" */ '../components/goods/add.vue')
// import Cate from './components/goods/Cate.vue'
const Cate = () => import( /* webpackChunkName: "Cate_Params" */ '../components/goods/categories.vue')
// import Params from './components/goods/Params.vue'
const Params = () => import( /* webpackChunkName: "Cate_Params" */ '../components/goods/params.vue')
//import goods_list from '../components/goods/list.vue'
//import add from '../components/goods/add.vue'

const order = () => import( /* webpackChunkName: "order_report" */ '../components/order/order.vue')
const report = () => import( /* webpackChunkName: "order_report" */ '../components/report/report.vue')
//import order from '../components/order/order.vue'
//import report from '../components/report/report.vue'
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
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: users
      },
      {
        path: '/rights',
        component: rights
      },
      {
        path: '/roles',
        component: roles
      },
      {
        path: '/goods',
        component: goods_list
      },
      {
        path: '/goods/add',
        component: add
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/orders',
        component: order
      },
      {
        path: '/reports',
        component: report
      }
    ]
  },
]

const router = new VueRouter({
  routes
})
// 导航守卫，防止用户没有登录通过url访问其他页面
router.beforeEach((to, form, next) => {
  if (to.path === '/login') {
    return next()
  } else {
    // 获取token判断用户是否登录
    const tokenStr = sessionStorage.getItem('token');
    if (tokenStr) {
      next();
    } else {
      return next('/login');
    }
  }
})

export default router
