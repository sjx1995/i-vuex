import { forEachObj } from "./utils";

class Module {
  constructor(rawModule) {
    this.state = rawModule.state;
    this._rawModule = rawModule;
    this._children = Object.create(null);
  }

  getChild(key) {
    return this._children[key];
  }

  addChild(key, module) {
    this._children[key] = module;
  }

  forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachObj(this._rawModule.getters, fn);
    }
  }

  forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachObj(this._rawModule.mutations, fn);
    }
  }

  forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachObj(this._rawModule.actions, fn);
    }
  }

  forEachChild(fn) {
    forEachObj(this._children, fn);
  }
}

export { Module };
