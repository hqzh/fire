import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MHome from '../views/MHome.vue'
import MAbout from '../views/MAbout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/m',
    name: 'mHome',
    component: MHome
  },
  {
    path: '/m-about',
    name: 'mAbout',
    component: MAbout
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
