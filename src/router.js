import Vue from "vue";
import Router from "vue-router";

import Dapp from "../dapp";
import Home from "../pages/index";
import Login from "../pages/access";
import Register from "../pages/create";

Vue.use(Router);

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register }
];

const router = new Router({
  routes
});