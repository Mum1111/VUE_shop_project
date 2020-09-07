import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/users/Users.vue'
import Rights from '../components/rights/Rights.vue'
import Roles from '../components/rights/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import TreeTable from 'vue-table-with-tree-grid'
import GoodsParams from '../components/goods/GoodsParams.vue'
import GoodList from '../components/goods/GoodList.vue'

Vue.use(Router)

Vue.component('tree-table', TreeTable)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: GoodsParams },
      { path: '/goods', component: GoodList }
    ]
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
