import { createMemoryHistory, createRouter } from 'vue-router'

// import HomePage from '../components/HomePage.vue'
import ErorrPage from '../components/ErorrPage.vue';
import NodesView from '../components/NodesView.vue';
import AuthPage from '../components/AuthPage.vue';
import ProfileView from '../components/ProfileView.vue';



const routes = [
  { path: '/', component: ErorrPage },
  { path: '/prompting', component: NodesView },
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