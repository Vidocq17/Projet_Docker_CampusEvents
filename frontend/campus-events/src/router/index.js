import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginView from "../views/Auth/LoginView.vue";
import RegisterView from "../views/Auth/RegisterView.vue";
import AdminView from "../views/AdminView.vue";
import EventFormView from "../views/EventFormView.vue";
import EventsListView from "../views/EventsListView.vue";
import EventDetailView from "../views/EventDetailView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: EventsListView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: { guestOnly: true },
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/event/:id/form",
    name: "event-form",
    component: EventFormView,
    meta: { requiresAuth: false },
  },
  {
    path: "/events/:id",
    name: "event-details",
    component: EventDetailView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.token && !auth.user && !auth.loading) {
    await auth.init();
  }

  if (to.meta?.guestOnly && auth.isAuthenticated) {
    return { name: "home" };
  }

  if (to.meta?.requiresAuth && !auth.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta?.requiresAdmin && !auth.isAdmin) {
    return { name: "home" };
  }

  return true;
});

export default router;
