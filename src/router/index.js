import { createMemoryHistory, createRouter } from 'vue-router'

import HomePage from '../components/HomePage.vue'
import NodesView from '../components/NodesView.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/createPromt', component: NodesView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})