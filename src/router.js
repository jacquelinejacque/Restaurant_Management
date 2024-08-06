import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import SignUp from './components/SignUp.vue';
import Login from './components/Login.vue';

const routes = [
  { path: '/home', component: Home },
  { path: '/', component: SignUp },
  { path: '/login', component: Login}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
