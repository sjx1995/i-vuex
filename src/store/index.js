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
    addAfter1s({ commit }, payload) {
      setTimeout(() => {
        commit("add", 3);
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
