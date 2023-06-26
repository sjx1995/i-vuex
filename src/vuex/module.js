import { forEachObj } from "./utils";

class Module {
  constructor(rawModule) {
    this.state = rawModule.state;
    this.namespaced = rawModule.namespaced || false
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

  getNamespaced(path, root) {
    let namespace = ''
    if (path.length !== 0) {
      path.reduce((module, key) => {
        const child = module.getChild(key)
        namespace += (child.namespaced ? `${key}/` : '')
        return child
      }, root)
    }
    return namespace
  }
}

export { Module };
