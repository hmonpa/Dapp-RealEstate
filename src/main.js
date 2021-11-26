import Vue from "vue";
import index from "@/pages/index";
import router from "@/router/index";

new Vue({
    router,
    render: h => h(index)
  }).$mount("#access");