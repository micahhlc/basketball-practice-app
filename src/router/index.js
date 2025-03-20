import { createRouter, createWebHistory } from "vue-router";
import PracticeGoalView from "../views/PracticeGoalView.vue";
import PracticeDetailView from "../views/PracticeDetailView.vue";
import StatsView from "../views/StatsView.vue";
import SettingsView from "../views/SettingsView.vue";

const routes = [
  { path: "/", redirect: "/practice-g" },
  { path: "/practice-g", component: PracticeGoalView },
  { path: "/practice-d", component: PracticeDetailView },
  { path: "/stats", component: StatsView },
  { path: "/settings", component: SettingsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
