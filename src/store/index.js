import { createStore } from "../vuex/index";

const store = createStore({
  state: {
    count: 0,
  },
  mutations: {
    add(state, val) {
      state.count += val;
    },
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit("add");
      }, 1000);
    },
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
});

export default store;
