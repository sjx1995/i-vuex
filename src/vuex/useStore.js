import { inject } from "vue";

const DEFAULT_STORE_NAME = "defaultStore";
const useStore = function (key = DEFAULT_STORE_NAME) {
  return inject(key);
};

export { DEFAULT_STORE_NAME, useStore };
