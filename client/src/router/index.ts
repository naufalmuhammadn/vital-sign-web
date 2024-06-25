import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import PatientDetailView from '../views/PatientDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        title: "Home",
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: {
        title: "Dashboard",
      },
    },
    {
      path: '/patient/:id',
      name: 'Patient',
      component: PatientDetailView,
      meta: {
        title: "Patient",
      },
    }
  ],
});

export default router;