import Vue from "vue";
import Vuex from "vuex";
import commonModule from "./common-module";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    commonModule,
  },
});
