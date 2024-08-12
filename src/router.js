import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue'; // Updated import to match the new component name
import SignUp from './components/SignUp.vue';
import Login from './components/Login.vue';

const routes = [
  { path: '/home', component: HomePage }, // Updated component name here
  { path: '/', component: SignUp },
  { path: '/login', component: Login, name: 'LoginPage' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
