<script setup>
import { computed } from "vue";
import { useStore } from "./vuex/index";

const store = useStore("custom-store");

const count = computed(() => store.state.count);
const doubleCount = computed(() => store.getters.doubleCount);
const aModuleCount = computed(() => store.state.aModule.count);
const bModuleCount = computed(() => store.state.bModule.count);

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
</script>

<template>
  <div>
    <h1>vue3 + vuex demo</h1>
    <h3>count: {{ count }}</h3>
    <h3>getter double count: {{ doubleCount }}</h3>
    <h3>a-module count: {{ aModuleCount }}</h3>
    <h3>b-module count: {{ bModuleCount }}</h3>
    <h3></h3>
    <button @click="handleEditState">直接修改state(不合法), +1</button>
    <button @click="handleCommit">commit同步修改, +2</button>
    <button @click="handleDispatch">dispatch异步修改, +3</button>
  </div>
</template>

<style>
button {
  margin: 8px;
}
</style>
