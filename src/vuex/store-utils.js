import { reactive, watch } from "vue";
import { forEachObj } from "./utils";

// 根据path获取最新的store.state，获取state、getter时调用
function getNestedState(storeState, path) {
  return path.reduce((state, key) => state[key], storeState);
}

// 将getters、mutations、mutations挂载到_module上面
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

  if (store.strict) {
    enableStrictMode(store);
  }
}

// 对在mutation之外修改state做出错误提示，使用了vue暴露的watch方法
function enableStrictMode(store) {
  watch(
    () => store.state,
    () => {
      console.assert(store._committing, "不能在mutation之外修改state");
    },
    {
      deep: true,
      flush: "sync",
    }
  );
}

export { installModule, resetStoreState };
