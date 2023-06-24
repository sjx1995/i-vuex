import { inject, reactive } from "vue";

const DEFAULT_STORE_NAME = "defaultStore";

class Store {
  constructor(options) {
    console.log("store实例数据", options);
    this._state = reactive({ data: options.state });
  }
  get state() {
    return this._state.data;
  }
  install(app, injectKey = DEFAULT_STORE_NAME) {
    console.log("vue.use挂载vuex");
    app.provide(injectKey, this);
  }
}

const createStore = function (options) {
  return new Store(options);
};

const useStore = function (key = DEFAULT_STORE_NAME) {
  return inject(key);
};

export { createStore, useStore };
