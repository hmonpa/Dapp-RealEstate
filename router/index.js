import Vue from "vue";
import Router from "vue-router";

import Home from "@/components/hero";
import Access from "@/pages/access";
import Create from "@/pages/create";

Vue.use(Router);

const routes = [
  { path: "/", component: Home },
  { path: "/access", component: Access },
  { path: "/create", component: Create }
];

const router = new Router({
  routes
});

export default router;