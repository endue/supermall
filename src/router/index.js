import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('views/home/Home')
const Cart = () => import('views/cart/Cart')
const Category = () => import('views/category/Category')
const Profile = () => import('views/profile/Profile')
const Detail = () => import('views/detail/Detail')

Vue.use(Router)

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/detail:iid',// 这里的iid会影响到取值时的key值
    component: Detail
  }
]

const router = new Router({
  routes,
  mode: 'history'
})

export default router

