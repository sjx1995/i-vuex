import { ModuleCollection } from "./module-collection";
import { DEFAULT_STORE_NAME } from "./useStore";
import { installModule, resetStoreState } from "./store-utils";

class Store {
  constructor(options) {
    console.log("store实例数据", options);

    this.strict = options.strict || false;

    // 判断修改state是不是发生在commit中
    this._committing = false;
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
    this._withCommit(() => {
      mutation.forEach((fn) => fn(payload));
    });
  };

  dispatch = (type, payload) => {
    const action = this._actions[type] || [];
    return Promise.all(action.map((fn) => fn(payload)));
  };

  _withCommit(fn) {
    const originCommitting = this._committing;
    this._committing = true;
    fn();
    this._committing = originCommitting;
  }
}

export { Store };
