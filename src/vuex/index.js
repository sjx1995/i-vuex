import { inject, reactive } from "vue";

const DEFAULT_STORE_NAME = "defaultStore";
const forEachObj = function (obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key));
};

class Store {
  constructor(options) {
    console.log("store实例数据", options);

    // 添加state到store
    this._state = reactive({ data: options.state });

    // 添加getter到store
    this.getters = {};
    let _this = this;
    // 遍历getters对象，对象属性值都是函数，我们需要调用这些函数获取它们的返回值
    // 使用defineProperty将函数都添加到store.getters对象上，之后外部调用getters时就会走到get属性访问器中，并执行函数
    forEachObj(options.getters, (fn, key) => {
      Object.defineProperty(this.getters, key, {
        get() {
          // return computed(() => fn(_this.state));
          return fn(_this.state);
        },
      });
    });
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
