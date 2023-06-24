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
    this.getters = Object.create(null);
    let _this = this;
    // 遍历getters对象，对象属性值都是函数，我们需要调用这些函数获取它们的返回值
    // 使用defineProperty将函数都添加到store.getters对象上，之后外部调用getters时就会走到get属性访问器中，并执行函数
    forEachObj(options.getters, (fn, key) => {
      Object.defineProperty(this.getters, key, {
        get() {
          return fn(_this.state);
        },
      });
    });

    // 添加mutations到store，等外部调用commit时触发
    this._mutations = Object.create(null);
    forEachObj(options.mutations, (fn, key) => {
      // 在_mutations上定义属性名同名的方法
      // payload由调用时传入
      this._mutations[key] = (payload) => {
        // 将方法的this重新绑定到当前实例上，store中定义mutations时需要两个参数：state和payload
        fn.call(_this, _this.state, payload);
      };
    });
  }

  get state() {
    return this._state.data;
  }

  // 外部调用commit时，传入对应的属性名和可选的payload
  commit(name, payload) {
    // 在store实例上面查找_mutations并触发对应的操作，将payload作为参加传入
    this._mutations[name](payload);
  }

  // use方法会调用，第一个参数默认是createApp()的vue对象
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