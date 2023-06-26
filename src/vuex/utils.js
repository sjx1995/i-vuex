const forEachObj = function (obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key));
};

export { forEachObj };
