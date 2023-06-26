import { ModuleCollection } from "./module-collection";
import { DEFAULT_STORE_NAME } from "./useStore";
import { installModule, resetStoreState } from "./store-utils";

class Store {
  constructor(options) {
    console.log("store实例数据", options);

    this.strict = options.strict || false;
    const plugins = options.plugins || [];

    // 判断修改state是不是发生在commit中
    this._committing = false;
    this._subscribers = [];
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

    // 注册插件，只在初始化时调用一次，传得给插件当前的store实例
    plugins.forEach((plugin) => plugin(this));
  }

  // use方法会调用，第一个参数默认是createApp()的vue对象
  install(app, injectKey = DEFAULT_STORE_NAME) {
    console.log("vue.use挂载vuex");
    app.provide(injectKey, this);
  }

  get state() {
    return this._state.data;
  }

  // 注意使用箭头函数绑定this到当前Store类，因为外部可能使用结构之后调用
  commit = (type, payload) => {
    const mutation = this._mutations[type] || [];
    this._withCommit(() => {
      mutation.forEach((fn) => fn(payload));
    });
    // 发布订阅的函数，传入两个参数：
    // 第一个参数：{type: string; payload: any}；第二个参数：state
    this._subscribers.forEach((fn) => fn({ type, payload }, this.state));
  };

  dispatch = (type, payload) => {
    const action = this._actions[type] || [];
    return Promise.all(action.map((fn) => fn(payload)));
  };

  // 订阅store的mutation，每次commit执行时触发
  // 接收两个参数：第一个参数是订阅函数，第二个参数是个可选的{prepend: boolean}，如果为true添加到订阅列表头部，否则添加到订阅列表尾部
  // 返回一个函数，用来取消订阅
  subscribe = (fn, options) => {
    if (this._subscribers.indexOf(fn) < 0) {
      console.log("订阅成功");
      if (options && options.prepend) {
        this._subscribers.unshift(fn);
      } else {
        this._subscribers.push(fn);
      }
    } else {
      console.log("这个subscribe已经被订阅");
    }

    return () => {
      const i = this._subscribers.indexOf(fn);
      if (i > -1) {
        this._subscribers.splice(i, 1);
        console.log("取消订阅");
      }
    };
  };

  // 先保存初始状态等待执行结束再恢复初始状态，而不是直接赋值true等待结束后置为false
  // 是为了避免commit中套用commit的情况
  // 如果采用后一种方法，内部commit执行完后this._committing被置为false，外部commit如果此时修改state就会报错
  _withCommit(fn) {
    const originCommitting = this._committing;
    this._committing = true;
    fn();
    this._committing = originCommitting;
  }
}

export { Store };
