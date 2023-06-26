<script setup>
import { computed } from "vue";
import { useStore } from "./vuex/index";

const store = useStore("custom-store");

const count = computed(() => store.state.count);
const doubleCount = computed(() => store.getters.doubleCount);
const aModuleCount = computed(() => store.state.aModule.count);
const bModuleCount = computed(() => store.state.bModule.count);
const cModuleCount = computed(() => store.state.aModule.cModule.count);
const tripleCount = computed(() => store.getters["aModule/tripleCount"]);

const handleEditState = () => {
  store.state.count += 1;
};

const handleCommit = () => {
  store.commit("add", 2);
};

const handleDispatch = () => {
  store.dispatch("addAfter1s", 3).then(() => {
    alert("异步执行完成");
  });
};

const handleCommitAModule = () => {
  store.commit("aModule/add", 2);
};

const subscribeFn = (mutation, state) => {
  console.log('订阅函数触发', mutation, state)
}

let unsubscribeFn = null
const handleSubscribe = () => {
  unsubscribeFn = store.subscribe(subscribeFn)
}

const handleUnsubscribe = () => {
  if (unsubscribeFn != null) {
    unsubscribeFn()
    unsubscribeFn = null
  }
}
</script>

<template>
  <div>
    <h1>vue3 + vuex demo</h1>
    <a href="https://github.com/sjx1995/i-vuex">View on Github</a>
    <hr />
    <h3 v-pre>
      store中数据嵌套: { root: { a: { namespaced: true, c: {...}, b: {...} } } }
    </h3>
    <h3>count (state): {{ count }}</h3>
    <h3>double count (getters): {{ doubleCount }}</h3>
    <h3>a-module count (state): {{ aModuleCount }}</h3>
    <h3>b-module count (state): {{ bModuleCount }}</h3>
    <h3>c-module count (state): {{ cModuleCount }}</h3>
    <h3>c-module triple count (getters): {{ tripleCount }}</h3>
    <hr />
    <button @click="handleEditState">+1 （直接修改state，不合法）</button>
    <br />
    <button @click="handleCommit">
      +2 （commit同步修改根模块的count，b-module也会被修改）
    </button>
    <br />
    <button @click="handleDispatch">
      +3 （dispatch异步修改根模块count，b-module也会被修改）
    </button>
    <br />
    <button @click="handleCommitAModule">
      +2 （commit同步修改A-Module命名空间下的count，c-module也会被修改）
    </button>
    <button @click="handleSubscribe">
      订阅mutation状态
    </button>
    <button @click="handleUnsubscribe">
      取消订阅mutation状态
    </button>
  </div>
</template>

<style>
button {
  margin: 8px;
}
</style>
