import { createMemoryHistory, createRouter } from 'vue-router'

// import HomePage from '../components/HomePage.vue'
import ErorrPage from '../components/ErorrPage.vue';
import NodesView from '../components/NodesView.vue';
import ProfileView from '../components/ProfileView.vue';

import ManLibView from '../components/userLib/ManLibView.vue';

const routes = [
  { path: '/', component: ErorrPage },
  { path: '/prompting/editor/:templateId', component: NodesView },
  { path: '/prompting', component: ManLibView },
  { path: '/profile', component:  ProfileView  },
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