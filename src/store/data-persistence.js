// 数据持久化
const STORAGE_NAME = "VUEX-PERSISTENCE-DATA";

const initStateData = (store) => {
  const data = JSON.parse(localStorage.getItem(STORAGE_NAME));
  if (data) {
    store.replaceState(data);
  }
};

const saveStateData = (_, state) => {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(state));
};

export { initStateData, saveStateData };
