import { createStore } from "../vuex/index";

const store = createStore({
  state: {
    count: 0,
  },
  mutations: {
    add(state, val) {
      state.count += val;
      return state.count;
    },
  },
  actions: {
    addAfter1s({ commit }, payload) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit("add", 3);
          resolve();
        }, 1000);
      });
    },
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
});

export default store;
