import { ModuleCollection } from "./module-collection";
import { DEFAULT_STORE_NAME } from "./useStore";
import { reactive } from "vue";
import { forEachObj } from "./utils";

function getNestedState(storeState, path) {
  return path.reduce((state, key) => state[key], storeState);
}

function installModule(store, module, rootState, path) {
  // 如果不是根节点，将所有模块的state按照层级关系都挂载到root.state上面，实现state.aModule.bModule.count
  if (path.length !== 0) {
    const parentState = path
      .slice(0, -1)
      .reduce((state, key) => state[key], rootState);
    parentState[path[path.length - 1]] = module.state;
  }

  // 遍历查找并注册当前模块的所有getters，因为getter会获取最新的state，所以通过path获取最新的state
  module.forEachGetter((handler, getterName) => {
    // 获取最新的state，module中的state是_rawModule的state，不具备响应式
    registerGetters(store, getterName, handler, path);
  });

  // 遍历查找并注册当前模块的所有mutations
  module.forEachMutation((handler, mutationName) => {
    // 获取最新的state，module中的state是_rawModule的state，不具备响应式
    registerMutations(store, mutationName, handler, path);
  });

  // 遍历查找并注册当前模块的所有actions
  module.forEachAction((handler, actionName) => {
    registerActions(store, actionName, handler);
  });

  // 递归的遍历子模块，安装子模块的mutation、action、getter
  module.forEachChild((child, childName) => {
    installModule(store, child, rootState, path.concat(childName));
  });
}

// 在store上安装当前模块的getters
function registerGetters(store, name, handler, path) {
  store._wrapperGetters[name] = () => {
    const state = getNestedState(store.state, path);
    return handler.call(store, state);
  };
}

// 在store上安装当前模块的mutations
function registerMutations(store, name, handler, path) {
  const entry = store._mutations[name] || (store._mutations[name] = []);
  entry.push((payload) => {
    const state = getNestedState(store.state, path);
    handler.call(store, state, payload);
  });
}

// 安装当前模块的actions
function registerActions(store, name, handler) {
  const entry = store._actions[name] || (store._actions[name] = []);
  entry.push((payload) => {
    const res = handler.call(store, store, payload);
    if (res && typeof res === "function") {
      // 说明是promise直接返回
      return res;
    }
    return Promise.resolve(res);
  });
}

function resetStoreState(store, state) {
  // 添加响应式的state
  store._state = reactive({ data: state });

  // 将_wrapperGetters中的getter注册到store上面
  store.getters = Object.create(null);
  forEachObj(store._wrapperGetters, (getter, getterName) => {
    Object.defineProperty(store.getters, getterName, {
      get: () => getter(),
    });
  });
}

class Store {
  constructor(options) {
    console.log("store实例数据", options);

    this._wrapperGetters = Object.create(null);
    this._mutations = Object.create(null);
    this._actions = Object.create(null);

    // 创建一个module树，每一项是一个Module实例，包含：
    // { state: object; _rawModule: object; _children: object; }
    this._module = new ModuleCollection(options);
    console.log("_module", this._module);

    // 在store实例上面安装模块
    installModule(this, this._module.root, this._module.root.state, []);

    // 将state和getters添加到store实力上面，并添加响应式
    resetStoreState(this, this._module.root.state);

    console.log("store", this);
  }

  // use方法会调用，第一个参数默认是createApp()的vue对象
  install(app, injectKey = DEFAULT_STORE_NAME) {
    console.log("vue.use挂载vuex");
    app.provide(injectKey, this);
  }

  get state() {
    return this._state.data;
  }

  commit = (type, payload) => {
    const mutation = this._mutations[type] || [];
    mutation.forEach((fn) => fn(payload));
  };

  dispatch = (type, payload) => {
    const action = this._actions[type] || [];
    return Promise.all(action.map((fn) => fn(payload)));
  };
}

export { Store };
