import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from './../store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: {
      isRequestAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('../views/ListView.vue')
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('../views/AdminView.vue'),
        children: [
          {
            path: 'user',
            name: 'user',
            component: () => import('../views/UserView.vue')
          },
          {
            path: 'client',
            name: 'client',
            component: () => import('../views/ClientView.vue')
          },
          {
            path: 'business',
            name: 'business',
            component: () => import('../views/BusinessView.vue')
          },
          {
            path: 'system',
            name: 'system',
            component: () => import('../views/SystemView.vue')
          }
        ]
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const isAuthed = function() {
  return store.getters.isAuth
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.isRequestAuth)
      && !isAuthed()) {
        next({ path: '/', query: { path: to.fullPath }})
      } else {
        next()
      }
});

export default router
