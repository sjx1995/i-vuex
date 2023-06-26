import { createStore } from "../vuex/index";

const store = createStore({
  strict: true,
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
  modules: {
    aModule: {
      state: {
        count: 1,
      },
      mutations: {
        add(state, val) {
          state.count += val;
        },
      },
      modules: {
        cModule: {
          state: {
            count: 3,
          },
          getters: {
            tripleCount(state) {
              return state.count * 3;
            },
          },
          mutations: {
            add(state, val) {
              state.count += val;
            },
          },
        },
      },
    },
    bModule: {
      state: {
        count: 2,
      },
      mutations: {
        add(state, val) {
          state.count += val;
        },
      },
    },
  },
});

export default store;
