import { Module } from "./module";
import { forEachObj } from "./utils";

class ModuleCollection {
  constructor(rawModule) {
    this.register(rawModule);
  }

  register(rawModule, path = []) {
    const newModule = new Module(rawModule);
    if (path.length === 0) {
      // 是根节点
      this.root = newModule;
    } else {
      // 不是根节点
      // path记录当前模块路径，倒数第二个就是父模块
      // 找到父模块，传入当前模块的名称和rawModule，在父模块的_children上添加子模块
      const parent = this.getParent(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }

    // 如果有子模块，拼接path，递归调用
    if (rawModule.modules) {
      forEachObj(rawModule.modules, (child, moduleName) => {
        this.register(child, path.concat(moduleName));
      });
    }
  }

  // 父模块作为前一次递归的模块，子模块名称是本次递归参数，在父模块上找到子模块作为本地递归返回值，就能找到数组中最后一个模块
  getParent(path) {
    return path.reduce((parent, cur) => {
      return parent.getChild(cur);
    }, this.root);
  }
}

export { ModuleCollection };
