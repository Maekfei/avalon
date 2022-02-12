import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "dlt" */ '../views/Create.vue')
  },
  {
    path: '/room',
    name: 'room',
    component: () => import(/* webpackChunkName: "ssq" */ '../views/Room.vue')
  },
  {
    path: '/game',
    name: 'game',
    component: () => import(/* webpackChunkName: "Random" */ '../views/Game.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
