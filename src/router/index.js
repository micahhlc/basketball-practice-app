import { createRouter, createWebHistory } from 'vue-router';
import PracticeView from '../views/PracticeView.vue';
import StatsView from '../views/StatsView.vue';
import SettingsView from '../views/SettingsView.vue';

const routes = [
  { path: '/', redirect: '/practice' },
  { path: '/practice', component: PracticeView },
  { path: '/stats', component: StatsView },
  { path: '/settings', component: SettingsView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;