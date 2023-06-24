<script setup>
import { computed } from "vue";
import { useStore } from "./vuex/index";

const store = useStore("custom-store");

const count = computed(() => store.state.count);

const handleEditState = () => {
  store.state.count += 1;
};
</script>

<template>
  <div>
    <h1>vue3 + vuex demo</h1>
    <h3>count: {{ count }}</h3>
    <button @click="handleEditState">直接修改state(不合法)</button>
  </div>
</template>
