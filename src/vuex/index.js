import { useStore } from "./useStore";
import { Store } from "./store";

const createStore = function (options) {
  return new Store(options);
};

export { createStore, useStore };
