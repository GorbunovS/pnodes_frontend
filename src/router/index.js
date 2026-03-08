import { createMemoryHistory, createRouter } from 'vue-router'

import ErorrPage from '../components/ErorrPage.vue';
import ProfileView from '../components/ProfileView.vue';
import HomePage from '../components/HomePage.vue';
import ManLibView from '../components/userLib/ManLibView.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/prompting', component: ManLibView },
  { path: '/community', component: ErorrPage },
  { path: '/profile', component: ProfileView },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: ErorrPage,
  },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})