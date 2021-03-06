import Vue from "vue";
import VueRouter from "vue-router";
import Zones from "../views/Zones.vue";
import Add from "../views/Add.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Add image",
    component: Add
  },
  {
    path: "/:data*",
    name: "Zones",
    component: Zones
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
