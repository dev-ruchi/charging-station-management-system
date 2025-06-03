import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Stations from "../views/Stations.vue";

// Navigation guard for protected routes
const requireAuth = (to, from, next) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    next("/login");
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    redirect: "/stations",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/stations",
    name: "Stations",
    component: Stations,
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
