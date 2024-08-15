import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue'; // Updated import to match the new component name
import SignUp from './components/SignUp.vue';
import Login from './components/Login.vue';
import Add from './components/Add.vue';
import Edit from './components/Edit.vue';


const routes = [
  { path: '/home', component: Home, name:'HomePage'}, // Updated component name here
  { path: '/', component: SignUp, name: 'SignUp' },
  { path: '/login', component: Login, name: 'LoginPage' },
  { path: '/add', component: Add, name: 'AddRestaurant' },
  { path: '/edit', component: Edit, name: 'EditRestaurant' },

  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
